import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageDescriptor {
  src: string;
  thumb?: string;
  med?: string;
  alt?: string;
}

interface ImageCarouselProps {
  images?: Array<string | ImageDescriptor>;
  altBase?: string;
}

export function ImageCarousel({ images = [], altBase = "Item image" }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => setSelected(0), [images]);

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    const toPreload = [selected - 1, selected + 1].filter((i) => i >= 0 && i < images.length);
    toPreload.forEach((i) => {
      if (loadedMap[i]) return;
      const maybe = images[i];
      const src = typeof maybe === "string" ? maybe : (maybe.med || maybe.src);
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedMap((m) => ({ ...m, [i]: true }));
    });
  }, [selected, images, loadedMap]);

  // IntersectionObserver-based preloader (mark slides near viewport as loaded)
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const root = containerRef.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll(".embla__slide")) as HTMLElement[];
    if (!slides.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slides.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setLoadedMap((m) => ({ ...m, [idx]: true }));
          }
        });
      },
      { root: null, rootMargin: "400px 0px", threshold: 0.01 }
    );
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [images]);

  // Fullscreen change listener
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      // enter
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const prev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div
      className={`embla-root ${isFullscreen ? "embla-fullscreen" : ""}`}
      ref={containerRef}
      data-fullscreen={isFullscreen ? "true" : "false"}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((img, i) => {
            const isString = typeof img === "string";
            const descriptor: ImageDescriptor = isString ? { src: img } : img;
            const src = descriptor.med || descriptor.src;
            const altText = descriptor.alt || `${altBase} ${i + 1}`;
            return (
              <div className="embla__slide" key={String(src) + i}>
                <img
                  src={src}
                  alt={altText}
                  loading={i === selected ? "eager" : "lazy"}
                  onLoad={() => setLoadedMap((m) => ({ ...m, [i]: true }))}
                  className={loadedMap[i] || i === selected ? "loaded" : "loading"}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="carousel-prev"
        onClick={prev}
        aria-label="Previous image"
        disabled={selected === 0}
      >
        ‹
      </button>
      <button
        className="carousel-next"
        onClick={next}
        aria-label="Next image"
        disabled={selected === images.length - 1}
      >
        ›
      </button>

      <button
        className="fullscreen-toggle"
        onClick={toggleFullscreen}
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? "⤢" : "⤡"}
      </button>

      <div className="carousel-indicator" role="status" aria-live="polite" aria-atomic="true">
        Image {selected + 1} of {images.length}
      </div>

      <div className="embla-thumbs" aria-hidden={images.length <= 1}>
        {images.map((img, i) => {
          const isString = typeof img === "string";
          const src = isString ? img : (img.src);
          const thumb = isString ? src : (img.thumb || img.src);
          return (
            <button
              key={String(src) + i}
              className={`embla-thumb ${i === selected ? "active" : ""}`}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              aria-label={`View image ${i + 1}`}
              title={`View image ${i + 1}`}
            >
              <img src={thumb} alt={`${altBase} thumbnail ${i + 1}`} loading="lazy" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ImageCarousel;
