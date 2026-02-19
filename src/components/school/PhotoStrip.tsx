interface PhotoStripProps {
  images: { src?: string; alt: string }[];
}

export function PhotoStrip({ images }: PhotoStripProps) {
  return (
    <div className="flex gap-4 overflow-x-auto py-6 border-b border-warm-border scrollbar-thin">
      {images.map((img, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[280px] h-[190px] bg-cream-300 relative overflow-hidden"
        >
          {img.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal-muted text-label-sm uppercase">
              {img.alt}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
