"use client";

import { NodeViewWrapper, type NodeViewWrapperProps } from "@tiptap/react";

interface InlineResearchPlaceholderProps extends NodeViewWrapperProps {}

export function InlineResearchPlaceholder({
  node,
}: InlineResearchPlaceholderProps) {
  const placeholderText = node.attrs.placeholderText || "[RESEARCH NEEDED: Research]";
  
  const description = placeholderText
    .replace(/\[RESEARCH NEEDED:\s*/i, "")
    .replace(/\]/g, "")
    .trim();

  return (
    <NodeViewWrapper className="inline-research-placeholder my-8 p-6 bg-red-50 border-l-4 border-red-600 rounded-sm">
      <div className="flex items-start gap-3">
        <div className="text-red-600 text-xl">⚠️</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-red-900 mb-2">
            Research Needed
          </div>
          <div className="text-sm text-red-800">
            {description}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
