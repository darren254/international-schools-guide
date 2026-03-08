"use client";

import { useState, useCallback } from "react";

type SchoolRow = {
  id: string;
  name: string;
  slug: string;
  citySlug: string | null;
  imageCount: number;
};

type MatchRow = {
  line: string;
  school: SchoolRow | null;
  include: boolean;
};

type ScrapedImage = { url: string; thumbnailUrl?: string; width?: number; height?: number; selected: boolean };

type ScrapeResult = {
  slug: string;
  schoolName: string;
  status: "pending" | "running" | "succeeded" | "failed" | "timeout";
  runId?: string;
  error?: string;
  images?: ScrapedImage[];
};

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function findBestMatch(line: string, schools: SchoolRow[]): SchoolRow | null {
  const n = normalize(line);
  if (!n) return null;
  const lineWords = n.split(/\s+/).filter((w) => w.length > 1);
  let best: SchoolRow | null = null;
  let bestScore = 0;
  for (const s of schools) {
    const nameNorm = normalize(s.name);
    if (!nameNorm) continue;
    if (nameNorm === n) return s;
    const slugNorm = s.slug.replace(/-/g, " ");
    let score = 0;
    if (nameNorm.includes(n) || n.includes(nameNorm)) score = 10 + Math.min(n.length, nameNorm.length);
    else if (slugNorm.includes(n) || n.includes(slugNorm)) score = 5;
    else {
      const matchWords = lineWords.filter((w) => nameNorm.includes(w) || slugNorm.includes(w)).length;
      if (matchWords >= Math.min(2, lineWords.length)) score = matchWords;
    }
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

const POLL_INTERVAL_MS = 5000;
const POLL_MAX = 36; // 3 min

export default function ImageScraperClient() {
  const [pastedText, setPastedText] = useState("");
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [scrapeResults, setScrapeResults] = useState<ScrapeResult[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveDone, setSaveDone] = useState(false);
  const [error, setError] = useState("");

  const handleMatchSchools = useCallback(() => {
    setError("");
    setLoadingSchools(true);
    fetch("/api/admin/schools", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("Unauthorized");
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        const list: SchoolRow[] = d.schools ?? [];
        setSchools(list);
        const lines = pastedText.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const newMatches: MatchRow[] = lines.map((line) => ({
          line,
          school: findBestMatch(line, list),
          include: true,
        }));
        setMatches(newMatches);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingSchools(false));
  }, [pastedText]);

  const runScrapeForOne = useCallback(
    async (match: MatchRow, index: number): Promise<ScrapeResult> => {
      if (!match.school) return { slug: "", schoolName: match.line, status: "failed", error: "No match" };

      const schoolName = match.school.name;
      const city = match.school.citySlug ?? "";

      const startRes = await fetch("/api/admin/image-scraper/start", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName, city }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) {
        return {
          slug: match.school.slug,
          schoolName: match.school.name,
          status: "failed",
          error: startData.error || startData.detail || "Failed to start",
        };
      }
      const runId = startData.runId as string;
      if (!runId) {
        return { slug: match.school.slug, schoolName: match.school.name, status: "failed", error: "No runId" };
      }

      for (let poll = 0; poll < POLL_MAX; poll++) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        const resRes = await fetch(`/api/admin/image-scraper/results?runId=${encodeURIComponent(runId)}`, {
          credentials: "include",
        });
        const resData = await resRes.json();
        if (resData.status === "succeeded") {
          const images: ScrapedImage[] = (resData.images ?? []).map((img: { url: string; thumbnailUrl?: string }) => ({
            url: img.url,
            thumbnailUrl: img.thumbnailUrl,
            selected: true,
          }));
          return {
            slug: match.school!.slug,
            schoolName: match.school!.name,
            status: "succeeded",
            runId,
            images,
          };
        }
        if (resData.status === "failed") {
          return {
            slug: match.school!.slug,
            schoolName: match.school!.name,
            status: "failed",
            runId,
            error: resData.error || "Run failed",
          };
        }
        setScrapeResults((prev) => {
          const next = [...prev];
          if (next[index]) next[index] = { ...next[index], status: "running" };
          return next;
        });
      }

      return {
        slug: match.school!.slug,
        schoolName: match.school!.name,
        status: "timeout",
        runId,
        error: "Timed out after 3 minutes",
      };
    },
    []
  );

  const handleFetchImages = useCallback(() => {
    const toScrape = matches.filter((m) => m.include && m.school);
    if (!toScrape.length) {
      setError("No schools selected. Match first and ensure Include is checked.");
      return;
    }
    setError("");
    setScraping(true);
    const initial: ScrapeResult[] = toScrape.map((m) => ({
      slug: m.school!.slug,
      schoolName: m.school!.name,
      status: "pending" as const,
    }));
    setScrapeResults(initial);

    let index = 0;
    const runNext = async () => {
      if (index >= toScrape.length) {
        setScraping(false);
        return;
      }
      const result = await runScrapeForOne(toScrape[index], index);
      setScrapeResults((prev) => {
        const next = [...prev];
        next[index] = result;
        return next;
      });
      index++;
      await runNext();
    };
    runNext();
  }, [matches, runScrapeForOne]);

  const toggleImageSelected = useCallback((schoolIndex: number, imageIndex: number) => {
    setScrapeResults((prev) => {
      const next = [...prev];
      const r = next[schoolIndex];
      if (!r?.images) return next;
      const img = r.images[imageIndex];
      if (img) img.selected = !img.selected;
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const toSave = scrapeResults.filter((r) => r.status === "succeeded" && r.images?.some((i) => i.selected));
    if (!toSave.length) {
      setError("No images selected to save.");
      return;
    }
    setError("");
    setSaving(true);
    setSaveDone(false);
    const variants = ["photo1", "photo2", "photo3", "photo4", "photo5"];
    let failMsg = "";
    for (const row of toSave) {
      const selected = row.images!.filter((i) => i.selected);
      for (let i = 0; i < selected.length; i++) {
        const res = await fetch(`/api/admin/schools/${row.slug}/images`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: selected[i].url, variant: variants[i] ?? `photo${i + 1}` }),
        });
        const data = await res.json();
        if (!res.ok) {
          failMsg = data.error || data.detail || "Save failed";
          break;
        }
      }
      if (failMsg) break;
    }
    if (failMsg) setError(failMsg);
    else setSaveDone(true);
    setSaving(false);
  }, [scrapeResults]);

  const retryOne = useCallback(
    async (match: MatchRow, schoolIdx: number) => {
      if (!match.school) return;
      const result = await runScrapeForOne(match, schoolIdx);
      setScrapeResults((prev) => {
        const next = [...prev];
        next[schoolIdx] = result;
        return next;
      });
    },
    [runScrapeForOne]
  );

  return (
    <div className="space-y-8">
      <section className="bg-warm-white border border-warm-border rounded-lg p-6">
        <h2 className="font-display text-display-sm text-charcoal mb-2">1. Paste school names</h2>
        <p className="text-body-sm text-charcoal-muted mb-3">One school per line. You can paste a list from a spreadsheet.</p>
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="British School Jakarta&#10;Jakarta Intercultural School&#10;..."
          rows={6}
          className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-white font-body text-body-sm"
        />
        <button
          type="button"
          onClick={handleMatchSchools}
          disabled={loadingSchools || !pastedText.trim()}
          className="mt-3 px-4 py-2 bg-primary text-white rounded font-medium text-body-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingSchools ? "Matching…" : "Match Schools"}
        </button>
      </section>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-body-sm">
          {error}
        </div>
      )}

      {matches.length > 0 && (
        <section className="bg-warm-white border border-warm-border rounded-lg overflow-hidden">
          <h2 className="font-display text-display-sm text-charcoal p-4 pb-2">2. Confirm matches</h2>
          <p className="text-body-sm text-charcoal-muted px-4 pb-3">Uncheck any school you don’t want to fetch images for.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-warm-border bg-cream/50">
                  <th className="px-4 py-3 text-label-sm font-medium text-charcoal">Input</th>
                  <th className="px-4 py-3 text-label-sm font-medium text-charcoal">Matched school</th>
                  <th className="px-4 py-3 text-label-sm font-medium text-charcoal">City</th>
                  <th className="px-4 py-3 text-label-sm font-medium text-charcoal">Images</th>
                  <th className="px-4 py-3 text-label-sm font-medium text-charcoal">Include</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i} className="border-b border-warm-border last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3 text-body-sm text-charcoal">{m.line}</td>
                    <td className="px-4 py-3 text-body-sm text-charcoal">{m.school?.name ?? <span className="text-charcoal-muted">No match</span>}</td>
                    <td className="px-4 py-3 text-body-sm text-charcoal-muted">{m.school?.citySlug ?? "—"}</td>
                    <td className="px-4 py-3 text-body-sm text-charcoal-muted">{m.school?.imageCount ?? "—"}</td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={m.include}
                        onChange={() =>
                          setMatches((prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], include: !next[i].include };
                            return next;
                          })
                        }
                        disabled={!m.school}
                        className="rounded border-warm-border"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-warm-border">
            <button
              type="button"
              onClick={handleFetchImages}
              disabled={scraping || !matches.some((m) => m.include && m.school)}
              className="px-4 py-2 bg-primary text-white rounded font-medium text-body-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scraping ? "Fetching…" : "Fetch Images"}
            </button>
          </div>
        </section>
      )}

      {scrapeResults.length > 0 && (
        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-2">3. Review and save</h2>
          {scraping && (
            <p className="text-body-sm text-charcoal-muted mb-4">
              {scrapeResults.filter((r) => r.status === "succeeded" || r.status === "failed" || r.status === "timeout").length} of {scrapeResults.length} schools completed.
            </p>
          )}
          <div className="space-y-6">
            {scrapeResults.map((r, schoolIdx) => (
              <div key={r.slug || schoolIdx} className="border-b border-warm-border last:border-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-charcoal">{r.schoolName}</span>
                  {r.status === "pending" && <span className="text-body-sm text-charcoal-muted">Waiting…</span>}
                  {r.status === "running" && <span className="text-body-sm text-primary">Fetching…</span>}
                  {r.status === "succeeded" && <span className="text-body-sm text-green-700">{r.images?.length ?? 0} images</span>}
                  {r.status === "failed" && (
                    <span className="text-body-sm text-red-600">
                      {r.error}
                      {(() => {
                        const match = matches.find((m) => m.school?.slug === r.slug);
                        return match?.school ? <button type="button" onClick={() => retryOne(match, schoolIdx)} className="ml-2 text-primary hover:underline">Retry</button> : null;
                      })()}
                    </span>
                  )}
                  {r.status === "timeout" && (
                    <span className="text-body-sm text-red-600">
                      Timed out
                      {(() => {
                        const match = matches.find((m) => m.school?.slug === r.slug);
                        return match?.school ? <button type="button" onClick={() => retryOne(match, schoolIdx)} className="ml-2 text-primary hover:underline">Retry</button> : null;
                      })()}
                    </span>
                  )}
                </div>
                {r.status === "succeeded" && r.images && r.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {r.images.map((img, imgIdx) => (
                      <label key={imgIdx} className="relative block aspect-[4/3] rounded overflow-hidden border-2 border-transparent cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={img.selected}
                          onChange={() => toggleImageSelected(schoolIdx, imgIdx)}
                          className="absolute top-2 left-2 z-10 rounded"
                        />
                        <img
                          src={img.thumbnailUrl || img.url}
                          alt=""
                          className={`w-full h-full object-cover ${img.selected ? "opacity-100" : "opacity-50"}`}
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!scraping && scrapeResults.some((r) => r.status === "succeeded" && r.images?.some((i) => i.selected)) && (
            <div className="mt-6 pt-4 border-t border-warm-border">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded font-medium text-body-sm hover:bg-primary-hover disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save selected images"}
              </button>
              {saveDone && <span className="ml-3 text-body-sm text-green-700">Saved. Check the school edit page to see images.</span>}
            </div>
          )}
        </section>
      )}

      <p className="text-body-xs text-charcoal-muted">
        Images are stored as external URLs in the database. To test locally, run with wrangler and set <code className="bg-cream/50 px-1 rounded">APIFY_TOKEN</code> in <code className="bg-cream/50 px-1 rounded">.dev.vars</code>.
      </p>
    </div>
  );
}
