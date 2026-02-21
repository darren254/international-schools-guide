"use client";

import { useState } from "react";

export function ArticleShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      setCopied(false);
    }
  };

  const blueskyShareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title}\n\n${url}`)}`;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 text-sm font-sans text-charcoal-muted hover:text-hermes transition-colors"
      >
        {copied ? (
          <>
            <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </span>
            Copied
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy link
          </>
        )}
      </button>
      <span className="text-charcoal-muted/50">|</span>
      <a
        href={blueskyShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-sans text-charcoal-muted hover:text-hermes transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 4.278c0 1.197.378 2.042.646 2.481.268.439 1.072.878 2.392 1.757C4.273 9.505 6.006 10.794 12 15.689c5.994-4.895 7.727-6.184 8.962-7.173 1.32-.879 2.124-1.318 2.392-1.757.268-.439.646-1.284.646-2.481 0-1.198-.139-2.37-.902-2.713-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z" />
        </svg>
        Share on Bluesky
      </a>
    </div>
  );
}
