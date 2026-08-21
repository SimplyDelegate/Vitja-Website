"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { projectMedia, type ProjectCategory, type ProjectMedia } from "@/lib/content";

const filters: Array<"Alle" | ProjectCategory> = ["Alle", "Industrieisolierung", "Rohrbau", "GFK", "Schweißen", "Stahlbau", "Integration", "Instandsetzung"];

export function ProjectGallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Alle");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<ProjectMedia | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const galleryFrameRef = useRef<HTMLDivElement>(null);
  const visible = filter === "Alle" ? projectMedia : projectMedia.filter((project) => project.category === filter);
  const isCollapsed = filter === "Alle" && !expanded;
  const filteredColumns = visible.length === 4 ? 2 : Math.min(visible.length, 3);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
    if (!selected && dialog?.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    const frame = galleryFrameRef.current;
    if (!frame) return;

    const syncCardAccessibility = () => {
      const cards = frame.querySelectorAll<HTMLButtonElement>(".project-card");
      cards.forEach((card) => {
        const fullyVisible = !isCollapsed || window.getComputedStyle(card).display !== "none";
        card.tabIndex = fullyVisible ? 0 : -1;
        if (fullyVisible) card.removeAttribute("aria-hidden");
        else card.setAttribute("aria-hidden", "true");
      });
    };

    syncCardAccessibility();
    const observer = new ResizeObserver(syncCardAccessibility);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [filter, isCollapsed, visible.length]);

  const selectFilter = (item: (typeof filters)[number]) => {
    setFilter(item);
    setExpanded(false);
  };

  const toggleGallery = () => {
    if (expanded) {
      setExpanded(false);
      window.setTimeout(() => {
        galleryFrameRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
      }, 0);
      return;
    }
    setExpanded(true);
  };

  return (
    <>
      <div className="gallery-filters" aria-label="Projekte filtern">
        {filters.map((item) => (
          <button key={item} type="button" className={filter === item ? "is-active" : ""} aria-pressed={filter === item} onClick={() => selectFilter(item)}>{item}</button>
        ))}
      </div>
      <div ref={galleryFrameRef} className={`project-gallery-frame${isCollapsed ? " is-collapsed" : " is-expanded"}`}>
        <div className={`project-grid${filter === "Alle" ? "" : ` is-filtered project-grid-count-${filteredColumns}`}`} id="project-gallery-grid">
          {visible.map((project, index) => (
            <button className={`project-card project-${project.layout}`} type="button" key={project.src} onClick={() => setSelected(project)} aria-label={`${project.caption} vergrößern`}>
              <Image src={asset(project.src)} alt={project.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{ objectPosition: project.focus ?? "center" }} loading={filter === "Alle" && index < 3 ? "eager" : "lazy"} />
              <span className="project-overlay"><small>{project.category}</small><strong>{project.caption}</strong><ZoomIn aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </div>

      {filter === "Alle" && (
        <div className="gallery-toggle-row">
          <button className="button button-ghost button-small gallery-toggle" type="button" aria-expanded={expanded} aria-controls="project-gallery-grid" onClick={toggleGallery}>
            {expanded ? <><ChevronUp aria-hidden="true" /> Galerie einklappen</> : <>Alle Aufnahmen ansehen <ChevronDown aria-hidden="true" /></>}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="project-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setSelected(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setSelected(null);
          }
        }}
        onClose={() => setSelected(null)}
        onClick={(event) => { if (event.target === dialogRef.current) setSelected(null); }}
      >
        {selected && (
          <div className="dialog-card">
            <button className="dialog-close" type="button" onClick={() => setSelected(null)} aria-label="Großansicht schließen"><X aria-hidden="true" /></button>
            <div className="dialog-image"><Image src={asset(selected.src)} alt={selected.alt} fill sizes="90vw" /></div>
            <div><span>{selected.category}</span><p>{selected.caption}</p></div>
          </div>
        )}
      </dialog>
    </>
  );
}
