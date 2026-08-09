import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { caseStudies } from "@/lib/content";
import { asset } from "@/lib/assets";

export function CaseStudies() {
  return (
    <div className="case-study-list" aria-label="Anonymisierte Projekteinblicke">
      {caseStudies.map((study, index) => (
        <article className="case-study reveal" key={study.id}>
          <div className="case-study-media">
            <Image src={asset(study.image)} alt={study.alt} fill sizes="(max-width: 900px) 100vw, 48vw" />
            <span>{String(index + 1).padStart(2, "0")} · {study.category}</span>
          </div>
          <div className="case-study-copy">
            <p className="case-study-label">Anonymisierter Projekteinblick</p>
            <h3>{study.title}</h3>
            <dl>
              <div><dt>Aufgabe</dt><dd>{study.task}</dd></div>
              <div><dt>Randbedingungen</dt><dd>{study.constraints}</dd></div>
              <div><dt>Ausführung</dt><dd>{study.execution}</dd></div>
              <div><dt>Qualitätssicherung</dt><dd>{study.quality}</dd></div>
              <div><dt>Ergebnis</dt><dd>{study.result}</dd></div>
            </dl>
            <a className="case-study-link" href="#kontakt">Ähnliche Aufgabe besprechen <ArrowDownRight aria-hidden="true" /></a>
          </div>
        </article>
      ))}
    </div>
  );
}
