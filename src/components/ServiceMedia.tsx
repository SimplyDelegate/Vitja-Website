"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import type { ServiceImage } from "@/lib/content";

const TRANSITION_DURATION = 240;

type ServiceMediaProps = {
  images: readonly ServiceImage[];
  serviceTitle: string;
};

export function ServiceMedia({ images, serviceTitle }: ServiceMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const [liveMessage, setLiveMessage] = useState(images.length ? `Bild 1 von ${images.length}` : "");
  const mediaRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);

  const clearTransition = useCallback(() => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (transitionRef.current !== null) window.clearTimeout(transitionRef.current);
    frameRef.current = null;
    transitionRef.current = null;
    pendingRef.current = null;
  }, []);

  useEffect(() => {
    if (images.length < 2 || !mediaRef.current) return;

    const preloadNext = () => {
      const image = new window.Image();
      image.src = asset(images[(activeIndex + 1) % images.length].src);
    };

    if (!("IntersectionObserver" in window)) {
      preloadNext();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadNext();
        observer.disconnect();
      },
      { rootMargin: "160px" }
    );

    observer.observe(mediaRef.current);
    return () => observer.disconnect();
  }, [activeIndex, images]);

  useEffect(() => clearTransition, [clearTransition]);

  const selectImage = useCallback((targetIndex: number) => {
    if (targetIndex === activeIndex || pendingRef.current !== null) return;
    pendingRef.current = targetIndex;
    setIncomingIndex(targetIndex);
  }, [activeIndex]);

  const completeTransition = useCallback((targetIndex: number) => {
    if (pendingRef.current !== targetIndex || frameRef.current !== null || transitionRef.current !== null) return;

    const finish = () => {
      if (pendingRef.current !== targetIndex) return;
      setActiveIndex(targetIndex);
      setIncomingIndex(null);
      setIncomingVisible(false);
      setLiveMessage(`Bild ${targetIndex + 1} von ${images.length}`);
      clearTransition();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      if (pendingRef.current !== targetIndex) return;
      setIncomingVisible(true);
      transitionRef.current = window.setTimeout(finish, TRANSITION_DURATION);
    });
  }, [clearTransition, images.length]);

  const rejectTransition = (targetIndex: number) => {
    if (pendingRef.current !== targetIndex) return;
    clearTransition();
    setIncomingIndex(null);
    setIncomingVisible(false);
    setLiveMessage("Das nächste Bild konnte nicht geladen werden.");
  };

  if (!images.length) {
    return <div className="service-card-media is-empty" aria-hidden="true" />;
  }

  const visibleIndices = incomingIndex === null ? [activeIndex] : [activeIndex, incomingIndex];
  const hasGallery = images.length > 1;

  const navigate = (direction: -1 | 1) => {
    const targetIndex = (activeIndex + direction + images.length) % images.length;
    selectImage(targetIndex);
  };

  return (
    <div className={`service-card-media has-image${hasGallery ? " has-gallery" : ""}`} ref={mediaRef}>
      {visibleIndices.map((index) => {
        const image = images[index];
        const incoming = index === incomingIndex;
        return (
          <Image
            // Derselbe geladene Bildknoten bleibt auch nach der Überblendung erhalten.
            key={image.src}
            aria-hidden={incoming || undefined}
            className={`service-card-image ${incoming ? `service-card-image-incoming${incomingVisible ? " is-visible" : ""}` : "service-card-image-current"}`}
            src={asset(image.src)}
            alt={incoming ? "" : image.alt}
            fill
            loading={incoming ? "eager" : undefined}
            sizes="(max-width: 820px) calc(100vw - 38px), (max-width: 1120px) 50vw, 33vw"
            style={{ objectPosition: image.focus }}
            onLoad={incoming ? () => completeTransition(index) : undefined}
            onError={incoming ? () => rejectTransition(index) : undefined}
          />
        );
      })}

      {hasGallery && (
        <>
          <button
            type="button"
            className="service-gallery-control service-gallery-previous"
            aria-label={`Vorheriges Bild von ${serviceTitle}`}
            disabled={incomingIndex !== null}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="service-gallery-control service-gallery-next"
            aria-label={`Nächstes Bild von ${serviceTitle}`}
            disabled={incomingIndex !== null}
            onClick={() => navigate(1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
          <span className="service-gallery-counter" aria-hidden="true">
            {activeIndex + 1} / {images.length}
          </span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {liveMessage}
          </span>
        </>
      )}
    </div>
  );
}
