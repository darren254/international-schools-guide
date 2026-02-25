"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getOrCreateSessionKey,
  getUtcDayKey,
  orderOptionsForQuestion,
  pickModuleForArticle,
  pickQuestionsForModule,
} from "@/lib/reader-pulse/deterministic";
import type { ReaderPulseQuestion } from "@/lib/reader-pulse/questions";

interface ReaderPulseWidgetProps {
  articleId: string;
}

interface VoteSummaryResponse {
  totals: Record<string, number>;
  counts: Record<string, Record<string, number>>;
}

type LocalVote = {
  article_id: string;
  module_id: string;
  question_id: string;
  option_id: string;
  session_key: string;
  timestamp: string;
};

const LOCAL_VOTES_KEY = "reader_pulse_votes_v1";

function readLocalVotes(): LocalVote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_VOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalVote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalVotes(votes: LocalVote[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(votes));
}

function saveVoteLocally(vote: LocalVote): { inserted: boolean; duplicate: boolean } {
  const votes = readLocalVotes();
  const already = votes.some(
    (v) =>
      v.article_id === vote.article_id &&
      v.question_id === vote.question_id &&
      v.session_key === vote.session_key
  );
  if (already) return { inserted: false, duplicate: true };
  votes.push(vote);
  writeLocalVotes(votes);
  return { inserted: true, duplicate: false };
}

function computeLocalSummary(
  articleId: string,
  moduleId: string,
  questionIds: string[]
): VoteSummaryResponse {
  const votes = readLocalVotes().filter(
    (v) =>
      v.article_id === articleId &&
      v.module_id === moduleId &&
      questionIds.includes(v.question_id)
  );

  const counts: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};
  for (const qid of questionIds) {
    counts[qid] = {};
    totals[qid] = 0;
  }

  for (const v of votes) {
    counts[v.question_id][v.option_id] = (counts[v.question_id][v.option_id] ?? 0) + 1;
    totals[v.question_id] += 1;
  }

  return { counts, totals };
}

function emitAnalytics(event: string, payload: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...payload });
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", event, payload);
  }
}

export function ReaderPulseWidget({ articleId }: ReaderPulseWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState<VoteSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewedRef = useRef(false);

  const sessionKey = useMemo(() => getOrCreateSessionKey(), []);
  const dayKey = useMemo(() => getUtcDayKey(), []);
  const module = useMemo(() => pickModuleForArticle(articleId), [articleId]);
  const questions = useMemo(
    () => pickQuestionsForModule(module, articleId, sessionKey, dayKey),
    [module, articleId, sessionKey, dayKey]
  );
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || viewedRef.current) return;
    viewedRef.current = true;
    emitAnalytics("widget_view", { article_id: articleId, module_id: module.id });
  }, [isVisible, articleId, module.id]);

  async function fetchSummary() {
    const ids = questions.map((q) => q.id).join(",");
    try {
      const res = await fetch(
        `/api/reader-pulse/summary?article_id=${encodeURIComponent(articleId)}&module_id=${encodeURIComponent(module.id)}&question_ids=${encodeURIComponent(ids)}`
      );
      if (!res.ok) throw new Error("Could not load summary");
      const data = (await res.json()) as VoteSummaryResponse;
      setSummary(data);
    } catch {
      // Fallback for environments where API routes are not yet active.
      setSummary(computeLocalSummary(articleId, module.id, questions.map((q) => q.id)));
    }
  }

  async function submitAnswer(question: ReaderPulseQuestion, optionId: string) {
    if (submitting) return;
    if (answeredQuestionIds.has(question.id)) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        article_id: articleId,
        module_id: module.id,
        question_id: question.id,
        option_id: optionId,
        session_key: sessionKey,
        timestamp: new Date().toISOString(),
      };

      let saveOk = false;
      try {
        const res = await fetch("/api/reader-pulse/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        saveOk = res.ok;
      } catch {
        saveOk = false;
      }

      if (!saveOk) {
        const local = saveVoteLocally(payload);
        if (!local.inserted && local.duplicate) {
          setError("You’ve already answered this question.");
          setSubmitting(false);
          return;
        }
      }

      setAnsweredQuestionIds((prev) => new Set(prev).add(question.id));
      emitAnalytics("question_answered", {
        article_id: articleId,
        module_id: module.id,
        question_id: question.id,
        option_id: optionId,
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((v) => v + 1);
      } else {
        setCompleted(true);
        emitAnalytics("module_completed", { article_id: articleId, module_id: module.id });
        await fetchSummary();
      }
    } catch {
      setError("Couldn’t save your answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function percentage(questionId: string, optionId: string): number {
    if (!summary) return 0;
    const total = summary.totals[questionId] ?? 0;
    const count = summary.counts[questionId]?.[optionId] ?? 0;
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  return (
    <section
      ref={rootRef}
      className="my-10 rounded border border-warm-border bg-warm-white p-5 md:p-6"
      aria-label="Reader Pulse"
    >
      <div className="mb-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">Reader Pulse</p>
        <h3 className="font-display text-2xl text-charcoal">{module.title}</h3>
        <p className="font-sans text-sm text-charcoal-muted">{module.subtitle}</p>
      </div>

      {!isVisible ? (
        <div className="h-[140px] animate-pulse rounded bg-cream" aria-hidden />
      ) : !completed && currentQuestion ? (
        <div className="space-y-4">
          <p className="font-sans text-xs uppercase tracking-wide text-charcoal-muted">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="font-sans text-lg font-semibold text-charcoal">{currentQuestion.text}</p>

          <div className="space-y-3">
            {orderOptionsForQuestion(currentQuestion, articleId, sessionKey, dayKey).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => submitAnswer(currentQuestion, opt.id)}
                disabled={submitting}
                className="w-full rounded border border-warm-border bg-cream px-4 py-4 text-left font-sans text-base text-charcoal transition hover:border-hermes hover:bg-[#f7efe5] focus:outline-none focus:ring-2 focus:ring-hermes disabled:opacity-60"
                aria-label={opt.label}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {error ? <p className="font-sans text-sm text-red-700">{error}</p> : null}
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-sans text-base font-semibold text-charcoal">What other parents said</h4>
          {questions.map((q) => (
            <div key={q.id} className="rounded border border-warm-border-light p-3">
              <p className="mb-2 font-sans text-sm font-medium text-charcoal">{q.text}</p>
              <ul className="space-y-1">
                {q.options.map((o) => (
                  <li key={o.id} className="flex items-center justify-between font-sans text-sm text-charcoal-muted">
                    <span>{o.label}</span>
                    <span className="font-medium text-charcoal">{percentage(q.id, o.id)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

