"use client";

import { useState } from "react";
import { NodeViewWrapper, type NodeViewWrapperProps } from "@tiptap/react";

interface InlinePullQuotePlaceholderProps extends NodeViewWrapperProps {}

export function InlinePullQuotePlaceholder({
  node,
  updateAttributes,
}: InlinePullQuotePlaceholderProps) {
  const placeholderText = node.attrs.placeholderText || "[PULL QUOTE NEEDED: Quote]";
  const quote = node.attrs.quote || "";
  const source = node.attrs.source || "";
  const [localQuote, setLocalQuote] = useState(quote);
  const [localSource, setLocalSource] = useState(source);

  const description = placeholderText
    .replace(/\[PULL QUOTE NEEDED:\s*/i, "")
    .replace(/\]/g, "")
    .trim();

  const handleConfirm = () => {
    if (!localQuote.trim()) return;
    updateAttributes({
      quote: localQuote,
      source: localSource,
    });
  };

  if (quote) {
    // Render as actual pull quote
    return (
      <NodeViewWrapper className="pull-quote-block my-8">
        <div className="pull-quote-rule"></div>
        <blockquote className="pull-quote-text">{quote}</blockquote>
        {source && <div className="pull-quote-attribution">{source}</div>}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="inline-pullquote-placeholder my-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-sm">
      <div className="text-sm font-medium text-amber-900 mb-4">
        {description}
      </div>
      <div className="space-y-3">
        <textarea
          value={localQuote}
          onChange={(e) => setLocalQuote(e.target.value)}
          placeholder="Paste the verified quote here..."
          className="w-full text-base text-charcoal border border-warm-border rounded-sm p-3 resize-y min-h-[100px]"
          rows={4}
        />
        <input
          type="text"
          value={localSource}
          onChange={(e) => setLocalSource(e.target.value)}
          placeholder="Source/attribution (optional)"
          className="w-full text-sm text-charcoal border border-warm-border rounded-sm p-2"
        />
        <button
          onClick={handleConfirm}
          disabled={!localQuote.trim()}
          className="px-4 py-2 bg-hermes text-white text-sm rounded-sm hover:bg-hermes-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Pull Quote
        </button>
      </div>
    </NodeViewWrapper>
  );
}
