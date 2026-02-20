"use client";

import { useState, useEffect, useRef } from "react";
import { NodeViewWrapper, type NodeViewWrapperProps } from "@tiptap/react";

interface InlineImagePlaceholderProps extends NodeViewWrapperProps {}

export function InlineImagePlaceholder({
  node,
  updateAttributes,
}: InlineImagePlaceholderProps) {
  const placeholderText = node.attrs.placeholderText || "[IMAGE NEEDED: Image]";
  const imageUrl = node.attrs.imageUrl;
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState(node.attrs.caption || "");
  const [photoCredit, setPhotoCredit] = useState(node.attrs.photoCredit || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Extract search query from placeholder text
  const searchQuery = placeholderText
    .replace(/\[IMAGE NEEDED:\s*/i, "")
    .replace(/\]/g, "")
    .trim();

  // Fetch Unsplash suggestions
  useEffect(() => {
    if (!searchQuery || imageUrl) return;

    setLoading(true);
    // Use Unsplash API - you'll need to add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to .env.local
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "demo";
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=6&client_id=${accessKey}`;

    // For now, use placeholder images if no API key
    if (accessKey === "demo") {
      setSuggestions([
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
      ]);
      setLoading(false);
      return;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setSuggestions(
            data.results.map((photo: any) => photo.urls.regular)
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [searchQuery, imageUrl]);

  // Handle drag and drop
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            handleImageSelect(imageUrl);
          };
          reader.readAsDataURL(file);
        }
      }
    };

    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave);
    dropZone.addEventListener("drop", handleDrop);

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("dragleave", handleDragLeave);
      dropZone.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleImageSelect = (selectedUrl: string) => {
    // Update the node to show the image
    updateAttributes({
      imageUrl: selectedUrl,
      caption: caption || "",
      photoCredit: photoCredit || "",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        handleImageSelect(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync local state with node attributes
  useEffect(() => {
    if (node.attrs.caption !== caption) {
      setCaption(node.attrs.caption || "");
    }
    if (node.attrs.photoCredit !== photoCredit) {
      setPhotoCredit(node.attrs.photoCredit || "");
    }
  }, [node.attrs.caption, node.attrs.photoCredit]);

  if (imageUrl) {
    return (
      <NodeViewWrapper className="inline-image-block my-8 group">
        <div className="relative">
          <img
            src={imageUrl}
            alt={searchQuery}
            className="w-full h-auto"
          />
          <button
            onClick={() => {
              updateAttributes({
                imageUrl: null,
                caption: "",
                photoCredit: "",
              });
              setCaption("");
              setPhotoCredit("");
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white px-3 py-1.5 text-xs rounded-sm shadow-sm hover:bg-cream-50 transition-opacity"
          >
            Replace
          </button>
        </div>
        {(caption || photoCredit) && (
          <p className="image-caption mt-2 text-left">
            {caption}
            {caption && photoCredit && ". "}
            {photoCredit}
          </p>
        )}
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={caption}
            onChange={(e) => {
              const newCaption = e.target.value;
              setCaption(newCaption);
              updateAttributes({ caption: newCaption });
            }}
            placeholder="Caption (optional)"
            className="w-full text-xs text-charcoal-muted border border-warm-border rounded-sm px-2 py-1 font-sans"
          />
          <input
            type="text"
            value={photoCredit}
            onChange={(e) => {
              const newCredit = e.target.value;
              setPhotoCredit(newCredit);
              updateAttributes({ photoCredit: newCredit });
            }}
            placeholder="Photo credit (e.g., Photographer Name / Source)"
            className="w-full text-xs text-charcoal-muted border border-warm-border rounded-sm px-2 py-1 font-sans"
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      ref={dropZoneRef}
      className={`inline-image-placeholder my-8 p-8 border-2 border-dashed ${
        isDragging ? "border-hermes bg-cream-50" : "border-warm-border bg-cream-50"
      } rounded-sm transition-colors`}
    >
      <div className="text-center mb-4">
        <div className="text-sm font-medium text-charcoal mb-2">
          {searchQuery}
        </div>
        <div className="text-xs text-charcoal-muted mb-4">
          Drag an image here or select from suggestions below
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-hermes hover:text-hermes-hover underline"
        >
          Or choose file
        </button>
      </div>

      {loading ? (
        <div className="text-center text-sm text-charcoal-muted py-8">
          Loading suggestions...
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {suggestions.map((url, idx) => (
            <button
              key={idx}
              onClick={() => handleImageSelect(url)}
              className="relative aspect-video overflow-hidden rounded-sm border border-warm-border hover:border-hermes transition-colors"
            >
              <img
                src={url}
                alt={`Suggestion ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-charcoal-muted py-4">
          No suggestions available. Please drag an image or choose a file.
        </div>
      )}
    </NodeViewWrapper>
  );
}
