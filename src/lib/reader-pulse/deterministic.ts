import {
  READER_PULSE_MODULES,
  type ReaderPulseModule,
  type ReaderPulseModuleId,
  type ReaderPulseOption,
  type ReaderPulseQuestion,
} from "./questions";

const SESSION_KEY_STORAGE = "reader_pulse_session_key_v1";

export function simpleHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
}

export function getUtcDayKey(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getOrCreateSessionKey(): string {
  if (typeof window === "undefined") return "server";
  const existing = window.localStorage.getItem(SESSION_KEY_STORAGE);
  if (existing) return existing;

  const generated = `rp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY_STORAGE, generated);
  return generated;
}

export function pickModuleForArticle(articleId: string): ReaderPulseModule {
  const moduleIds: ReaderPulseModuleId[] = ["parent_snapshot", "micro_polls"];
  const idx = simpleHash(articleId) % moduleIds.length;
  return READER_PULSE_MODULES[moduleIds[idx]];
}

function rankBySeed<T extends { id: string }>(items: T[], seed: string): T[] {
  return [...items].sort((a, b) => {
    const ha = simpleHash(`${seed}:${a.id}`);
    const hb = simpleHash(`${seed}:${b.id}`);
    return ha - hb;
  });
}

export function pickQuestionsForModule(
  module: ReaderPulseModule,
  articleId: string,
  sessionKey: string,
  dayKey: string
): ReaderPulseQuestion[] {
  const seed = `${sessionKey}:${articleId}:${dayKey}:${module.id}`;
  return rankBySeed(module.questions, seed).slice(0, 3);
}

export function orderOptionsForQuestion(
  question: ReaderPulseQuestion,
  articleId: string,
  sessionKey: string,
  dayKey: string
): ReaderPulseOption[] {
  if (question.optionOrdering === "fixed") return question.options;

  const seed = `${sessionKey}:${articleId}:${dayKey}:${question.id}:options`;
  if (question.optionOrdering === "shuffle") {
    return rankBySeed(question.options, seed);
  }

  // shuffle_except_last: keep final option fixed (e.g. "Not sure").
  const last = question.options[question.options.length - 1];
  const shuffled = rankBySeed(question.options.slice(0, -1), seed);
  return [...shuffled, last];
}

