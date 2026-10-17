import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { FALLBACK_IMAGE } from "../../utils/images";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const count = images.length;
  const activeIndex = Math.min(index, Math.max(0, count - 1));

  const go = (d: number) => {
    if (count <= 1) return;
    setIndex((activeIndex + d + count) % count);
  };

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, count]);

  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`${alt} ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            onClick={() => setFull(true)}
            className="h-full w-full shrink-0 cursor-zoom-in object-cover"
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Цял екран"
        onClick={() => setFull(true)}
        className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-card/80 text-foreground shadow-soft backdrop-blur transition hover:bg-card"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      {full && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-foreground/95"
          onClick={() => setFull(false)}
        >
          <img
            src={images[activeIndex]}
            alt={`${alt} ${activeIndex + 1}`}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Затвори"
            onClick={() => setFull(false)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-card text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Предишна снимка"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card text-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Следваща снимка"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card text-foreground"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-card px-3 py-1 text-sm font-semibold text-foreground">
                {activeIndex + 1} / {count}
              </span>
            </>
          )}
        </div>
      )}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Предишна снимка"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-card/80 text-foreground shadow-soft backdrop-blur transition hover:bg-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Следваща снимка"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-card/80 text-foreground shadow-soft backdrop-blur transition hover:bg-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute right-3 top-3 z-10 flex gap-1.5 rounded-full bg-card/70 px-2 py-1.5 backdrop-blur">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Снимка ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === activeIndex
                    ? "w-5 bg-primary"
                    : "w-2 bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
