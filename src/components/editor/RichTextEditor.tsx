"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useRef } from "react";
import { FloatingToolbar } from "./FloatingToolbar";
import { ImageWithPlaceholder } from "./ImageWithPlaceholder";
import { MapboxPlaceholder } from "./MapboxPlaceholder";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onPlaceholderCountChange?: (count: number) => void;
}

export function RichTextEditor({
  content,
  onChange,
  onPlaceholderCountChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageWithPlaceholder,
      MapboxPlaceholder,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-hermes hover:underline",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose-hermes space-y-8 text-charcoal leading-relaxed focus:outline-none min-h-[600px]",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Count placeholders and apply styling
  useEffect(() => {
    if (!editor || !onPlaceholderCountChange) return;

    const updatePlaceholderCount = () => {
      const html = editor.getHTML();
      const text = editor.getText();
      
      // Count placeholders in both HTML and text (covers all cases)
      const researchMatches = [
        ...(html.match(/\[RESEARCH NEEDED:[^\]]*\]/g) || []),
        ...(text.match(/\[RESEARCH NEEDED:[^\]]*\]/g) || []),
      ];
      const pullquoteMatches = [
        ...(html.match(/\[PULL QUOTE NEEDED:[^\]]*\]/g) || []),
        ...(text.match(/\[PULL QUOTE NEEDED:[^\]]*\]/g) || []),
      ];
      const imageMatches = [
        ...(html.match(/\[IMAGE NEEDED:[^\]]*\]/g) || []),
        ...(text.match(/\[IMAGE NEEDED:[^\]]*\]/g) || []),
      ];
      const mapboxMatches = [
        ...(html.match(/\[MAPBOX MAP NEEDED:[^\]]*\]/g) || []),
        ...(text.match(/\[MAPBOX MAP NEEDED:[^\]]*\]/g) || []),
        ...(html.match(/data-type="mapbox-placeholder"/g) || []),
      ];
      
      // Use Set to deduplicate
      const total = new Set([...researchMatches, ...pullquoteMatches, ...imageMatches, ...mapboxMatches]).size;
      
      onPlaceholderCountChange(total);

      // Apply styling to paragraphs containing placeholders
      const editorElement = editor.view.dom;
      const paragraphs = editorElement.querySelectorAll("p");
      
      paragraphs.forEach((p) => {
        const text = p.textContent || "";
        const html = p.innerHTML || "";
        p.classList.remove("research-placeholder", "pullquote-placeholder", "image-placeholder");
        
        if (text.includes("[RESEARCH NEEDED:") || html.includes("[RESEARCH NEEDED:")) {
          p.classList.add("research-placeholder");
        } else if (text.includes("[PULL QUOTE NEEDED:") || html.includes("[PULL QUOTE NEEDED:")) {
          p.classList.add("pullquote-placeholder");
        } else if (text.includes("[IMAGE NEEDED:") || html.includes("[IMAGE NEEDED:")) {
          p.classList.add("image-placeholder");
        }
      });
      
      // Style mapbox placeholder blocks
      const mapboxBlocks = editorElement.querySelectorAll('[data-type="mapbox-placeholder"]');
      mapboxBlocks.forEach((block) => {
        block.classList.add("mapbox-placeholder-block");
      });
    };

    // Use requestAnimationFrame to ensure DOM is updated
    const scheduleUpdate = () => {
      requestAnimationFrame(() => {
        updatePlaceholderCount();
      });
    };

    editor.on("update", scheduleUpdate);
    editor.on("selectionUpdate", scheduleUpdate);
    scheduleUpdate();

    return () => {
      editor.off("update", scheduleUpdate);
      editor.off("selectionUpdate", scheduleUpdate);
    };
  }, [editor, onPlaceholderCountChange]);

  // Update content when prop changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if content actually changed to avoid loops
      const currentHtml = editor.getHTML();
      if (content !== currentHtml) {
        editor.commands.setContent(content, false); // false = don't emit update event
      }
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="h-[600px] bg-cream-50 animate-pulse" />;
  }

  return (
    <div ref={editorRef} className="relative">
      {editor && <FloatingToolbar editor={editor} />}
      {/* Insert Image/Map Toolbar - appears on empty line click */}
      {editor && (
        <div className="absolute top-4 right-4 z-40 flex gap-2">
          <button
            onClick={() => {
              try {
                const url = window.prompt("Enter image URL:");
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              } catch (error) {
                console.error("Failed to insert image:", error);
                alert("Failed to insert image. Please check the URL and try again.");
              }
            }}
            className="px-3 py-1.5 text-xs bg-white border border-warm-border rounded-sm shadow-sm hover:bg-cream-50 text-charcoal"
            title="Insert Image"
          >
            📷 Image
          </button>
          <button
            onClick={() => {
              try {
                const city = window.prompt("Enter city name (optional):") || "";
                const html = `<div data-type="mapbox-placeholder" ${city ? `data-city="${city.replace(/"/g, "&quot;")}"` : ""} class="mapbox-placeholder-block">[MAPBOX MAP NEEDED: ${city || "Interactive map"} - showing schools, neighborhoods, and POIs]</div>`;
                editor.chain().focus().insertContent(html).run();
              } catch (error) {
                console.error("Failed to insert mapbox placeholder:", error);
                alert("Failed to insert map. Please try again.");
              }
            }}
            className="px-3 py-1.5 text-xs bg-white border border-warm-border rounded-sm shadow-sm hover:bg-cream-50 text-charcoal"
            title="Insert Mapbox Map"
          >
            🗺️ Map
          </button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #4A4540;
          line-height: 1.75;
          font-size: 1rem;
          max-width: 100%;
          padding: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.75rem;
          font-weight: 600;
          line-height: 1.15;
          color: #1A1A1A;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
        }
        .ProseMirror h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.875rem;
          font-weight: 600;
          line-height: 1.3;
          color: #1A1A1A;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
        }
        .ProseMirror h3 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          color: #1A1A1A;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror p {
          margin-bottom: 1.25rem;
          color: #4A4540;
          line-height: 1.75;
        }
        .ProseMirror p.research-placeholder {
          background: #FEE2E2 !important;
          border-left: 4px solid #DC2626 !important;
          padding: 1rem 1.5rem !important;
          margin: 1.5rem 0 !important;
          border-radius: 4px;
          color: #991B1B !important;
          font-weight: 500 !important;
        }
        .ProseMirror p.pullquote-placeholder,
        .ProseMirror p.image-placeholder {
          background: #FEF3C7 !important;
          border-left: 4px solid #F59E0B !important;
          padding: 1rem 1.5rem !important;
          margin: 1.5rem 0 !important;
          border-radius: 4px;
          color: #92400E !important;
          font-weight: 500 !important;
        }
        .ProseMirror strong {
          font-weight: 600;
          color: #1A1A1A;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem 0;
          border-radius: 4px;
        }
        .ProseMirror .image-placeholder-block {
          display: flex !important;
          align-items: center;
          justify-content: center;
          background: #FEF3C7 !important;
          border: 2px dashed #F59E0B !important;
          border-left: 4px solid #F59E0B !important;
          padding: 2rem !important;
          text-align: center;
          color: #92400E !important;
          font-weight: 500 !important;
          min-height: 150px;
          margin: 1.5rem 0 !important;
          border-radius: 4px;
        }
        .ProseMirror .mapbox-placeholder-block {
          display: flex !important;
          align-items: center;
          justify-content: center;
          background: #E0F2FE !important;
          border: 2px dashed #0284C7 !important;
          border-left: 4px solid #0284C7 !important;
          padding: 3rem 2rem !important;
          text-align: center;
          color: #0C4A6E !important;
          font-weight: 500 !important;
          min-height: 400px;
          margin: 2rem 0 !important;
          border-radius: 4px;
          flex-direction: column;
          gap: 1rem;
        }
        .ProseMirror .mapbox-placeholder-block::before {
          content: "🗺️";
          font-size: 3rem;
        }
        .ProseMirror section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #E8E2D9;
        }
        .ProseMirror section:last-child {
          border-bottom: none;
        }
        .ProseMirror a {
          color: #E8722A;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #D4641F;
        }
      `}} />
      <EditorContent editor={editor} />
    </div>
  );
}
