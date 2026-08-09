"use client";

import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projectMedia, type ProjectCategory, type ProjectMedia } from "@/lib/content";

const filters: Array<"Alle" | ProjectCategory> = ["Alle", "Rohrbau", "GFK", "Schweißen", "Stahlbau", "Integration", "Instandsetzung"];

export function ProjectGallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Alle");
  const [selected, setSelected] = useState<ProjectMedia | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visible = filter === "Alle" ? projectMedia : projectMedia.filter((project) => project.category === filter);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
    if (!selected && dialog?.open) dialog.close();
  }, [selected]);

  return (
    <>
      <div className="gallery-filters" aria-label="Projekte filtern">
        {filters.map((item) => (
          <button key={item} type="button" className={filter === item ? "is-active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <div className="project-grid">
        {visible.map((project, index) => (
          <button className={`project-card project-${project.aspect} reveal`} type="button" key={project.src} onClick={() => setSelected(project)} aria-label={`${project.caption} vergrößern`}>
            <Image src={project.src} alt={project.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{ objectPosition: project.focus ?? "center" }} loading={filter === "Alle" && index < 3 ? "eager" : "lazy"} />
            <span className="project-overlay"><small>{project.category}</small><strong>{project.caption}</strong><ZoomIn aria-hidden="true" /></span>
          </button>
        ))}
      </div>

      <dialog ref={dialogRef} className="project-dialog" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === dialogRef.current) setSelected(null); }}>
        {selected && (
          <div className="dialog-card">
            <button className="dialog-close" type="button" onClick={() => setSelected(null)} aria-label="Großansicht schließen"><X aria-hidden="true" /></button>
            <div className="dialog-image"><Image src={selected.src} alt={selected.alt} fill sizes="90vw" /></div>
            <div><span>{selected.category}</span><p>{selected.caption}</p></div>
          </div>
        )}
      </dialog>
    </>
  );
}
