"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeToMotion = (callback: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getMotionPreference = () => window.matchMedia(motionQuery).matches;
const getServerMotionPreference = () => false;

export function VideoHighlight() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getMotionPreference, getServerMotionPreference);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play();
      else video.pause();
    }, { threshold: 0.45 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={videoRef}
      className="highlight-video"
      muted
      loop
      playsInline
      preload="metadata"
      poster="/media/hero/gfk-rohrbau.webp"
      aria-label="GFK-Rohrbaugruppe während der Fertigung"
      controls={reducedMotion}
    >
      {!reducedMotion && <source src="/media/video/gfk-systembau.mp4" type="video/mp4" />}
    </video>
  );
}
