"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";

interface InlinePullQuotePlaceholderProps {
  editor: Editor;
  placeholderText: string;
}

export function InlinePullQuotePlaceholder({
  editor,
  placeholderText,
}: InlinePullQuotePlaceholderProps) {
  const [quote, setQuote] = useState("");
  const [source, setSource] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  const description = placeholderText
    .replace(/\[PULL QUOTE NEEDED:\s*/i, "")
    .replace(/\]/g, "")
    .trim();

  const handleConfirm = () => {
    if (!quote.trim()) return;

    const html = `
      <div class="pull-quote-block">
        <div class="pull-quote-rule"></div>
        <blockquote class="pull-quote-text">${quote}</blockquote>
        ${source ? `<div class="pull-quote-attribution">${source}</div>` : ""}
      </div>
    `;

    const currentContent = editor.getHTML();
    const placeholderRegex = new RegExp(
      `\\[PULL QUOTE NEEDED:[^\\]]*\\]`,
      "gi"
    );
    const newContent = currentContent.replace(placeholderRegex, html);
    editor.commands.setContent(newContent, false);
    setIsResolved(true);
  };

  if (isResolved) {
    return null; // Will be replaced by actual pull quote
  }

  return (
    <div className="inline-pullquote-placeholder my-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-sm">
      <div className="text-sm font-medium text-amber-900 mb-4">
        {description}
      </div>
      <div className="space-y-3">
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Paste the verified quote here..."
          className="w-full text-base text-charcoal border border-warm-border rounded-sm p-3 resize-y min-h-[100px]"
          rows={4}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source/attribution (optional)"
          className="w-full text-sm text-charcoal border border-warm-border rounded-sm p-2"
        />
        <button
          onClick={handleConfirm}
          disabled={!quote.trim()}
          className="px-4 py-2 bg-hermes text-white text-sm rounded-sm hover:bg-hermes-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Pull Quote
        </button>
      </div>
    </div>
  );
}
