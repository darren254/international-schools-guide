"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updateToolbar = () => {
      const { from, to } = editor.state.selection;
      const isEmpty = from === to;

      if (isEmpty) {
        setShow(false);
        return;
      }

      const { $anchor } = editor.state.selection;
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

      setPosition({
        top: start.top - 50,
        left: (start.left + end.left) / 2,
      });
      setShow(true);
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("focus", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("focus", updateToolbar);
    };
  }, [editor]);

  if (!show) return null;

  return (
    <div
      className="fixed z-50 bg-white border border-warm-border rounded-sm shadow-lg p-2 flex gap-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
          editor.isActive("bold")
            ? "bg-hermes text-white"
            : "bg-cream-50 text-charcoal hover:bg-cream-100"
        }`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
          editor.isActive("italic")
            ? "bg-hermes text-white"
            : "bg-cream-50 text-charcoal hover:bg-cream-100"
        }`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
          editor.isActive("link")
            ? "bg-hermes text-white"
            : "bg-cream-50 text-charcoal hover:bg-cream-100"
        }`}
        title="Link"
      >
        🔗
      </button>
    </div>
  );
}
