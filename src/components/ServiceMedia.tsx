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

  useEffect(() => () => {
    if (transitionRef.current !== null) window.clearTimeout(transitionRef.current);
  }, []);

  const selectImage = useCallback((targetIndex: number) => {
    if (targetIndex === activeIndex || incomingIndex !== null) return;
    setIncomingIndex(targetIndex);
  }, [activeIndex, incomingIndex]);

  const completeTransition = useCallback((targetIndex: number) => {
    if (targetIndex !== incomingIndex) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(targetIndex);
      setIncomingIndex(null);
      setLiveMessage(`Bild ${targetIndex + 1} von ${images.length}`);
      return;
    }

    window.requestAnimationFrame(() => setIncomingVisible(true));
    transitionRef.current = window.setTimeout(() => {
      setActiveIndex(targetIndex);
      setIncomingIndex(null);
      setIncomingVisible(false);
      setLiveMessage(`Bild ${targetIndex + 1} von ${images.length}`);
      transitionRef.current = null;
    }, TRANSITION_DURATION);
  }, [images.length, incomingIndex]);

  const rejectTransition = () => {
    setIncomingIndex(null);
    setIncomingVisible(false);
    setLiveMessage("Das nächste Bild konnte nicht geladen werden.");
  };

  if (!images.length) {
    return <div className="service-card-media is-empty" aria-hidden="true" />;
  }

  const activeImage = images[activeIndex];
  const incomingImageIndex = incomingIndex;
  const incomingImage = incomingImageIndex === null ? null : images[incomingImageIndex];
  const hasGallery = images.length > 1;

  const navigate = (direction: -1 | 1) => {
    const targetIndex = (activeIndex + direction + images.length) % images.length;
    selectImage(targetIndex);
  };

  return (
    <div className={`service-card-media has-image${hasGallery ? " has-gallery" : ""}`} ref={mediaRef}>
      <Image
        className="service-card-image service-card-image-current"
        src={asset(activeImage.src)}
        alt={activeImage.alt}
        fill
        sizes="(max-width: 820px) calc(100vw - 38px), (max-width: 1120px) 50vw, 33vw"
        style={{ objectPosition: activeImage.focus }}
      />

      {incomingImage && incomingImageIndex !== null && (
        <Image
          aria-hidden="true"
          className={`service-card-image service-card-image-incoming${incomingVisible ? " is-visible" : ""}`}
          src={asset(incomingImage.src)}
          alt=""
          fill
          sizes="(max-width: 820px) calc(100vw - 38px), (max-width: 1120px) 50vw, 33vw"
          style={{ objectPosition: incomingImage.focus }}
          onLoad={() => completeTransition(incomingImageIndex)}
          onError={rejectTransition}
        />
      )}

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
