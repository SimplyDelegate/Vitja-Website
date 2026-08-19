import { Check, FileSearch, ShieldCheck } from "lucide-react";
import { qualificationGroups, qualifications } from "@/lib/content";

export function QualificationsSection() {
  const publicQualifications = qualifications.filter((item) => item.status === "verified" && item.publicVisibility === "summary");

  return (
    <section className="section qualifications-section" id="qualifikationen" aria-labelledby="qualifications-title">
      <div className="shell">
        <div className="qualification-intro reveal">
          <div>
            <p className="eyebrow eyebrow-light">Qualifikationen & Nachweise</p>
            <h2 id="qualifications-title">Nachweise, die zum Auftrag passen.</h2>
          </div>
          <div>
            <p>Entscheidend ist nicht die Anzahl der Zertifikate, sondern ob sie zu Ihrem Auftrag passen. Deshalb gleichen wir Qualifikationen mit ihrem tatsächlichen Geltungsbereich ab und stellen vollständige Präqualifikationsunterlagen auf Anfrage bereit.</p>
            <div className="qualification-principles">
              <span><ShieldCheck aria-hidden="true" /> Keine pauschalen Zertifikatsclaims</span>
              <span><FileSearch aria-hidden="true" /> Prüfung vor Auftragsbestätigung</span>
            </div>
          </div>
        </div>

        {publicQualifications.length > 0 && (
          <div className="verified-qualification-list reveal" aria-label="Geprüfte Qualifikationsnachweise">
            {publicQualifications.map((item) => (
              <article key={item.id}>
                <span>Geprüft</span>
                <h3>{item.standard}{item.level ? ` · ${item.level}` : ""}</h3>
                <p>{item.scope}</p>
                <dl><div><dt>Aussteller</dt><dd>{item.issuer}</dd></div><div><dt>Gültig bis</dt><dd>{item.validUntil ? new Intl.DateTimeFormat("de-DE").format(new Date(item.validUntil)) : "–"}</dd></div></dl>
              </article>
            ))}
          </div>
        )}

        <div className="qualification-grid">
          {qualificationGroups.map((group) => (
            <article className="qualification-card reveal" key={group.category}>
              <div className="qualification-card-top">
                <span>{group.category}</span>
                <small>Projektbezogen geprüft</small>
              </div>
              <h3>{group.title}</h3>
              <p>{group.intro}</p>
              <ul>
                {group.areas.map((area) => <li key={area}><Check aria-hidden="true" />{area}</li>)}
              </ul>
              <p className="qualification-note">{group.note}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
