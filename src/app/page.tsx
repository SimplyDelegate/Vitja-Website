import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CountUpStats } from "@/components/CountUpStats";
import { CustomerMarquee } from "@/components/CustomerMarquee";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { contactItems } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-bgDark pb-16 pt-28 text-white">
        <Image
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1800&q=82"
          alt="Industrieanlage mit technischer Ausruestung"
          fill
          priority
          className="-z-20 object-cover"
          sizes="100vw"
        />
        <div className="hero-mask absolute inset-0 -z-10" />

        <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-5 animate-fadeUp text-sm font-bold uppercase tracking-[0.28em] text-orange-200 opacity-0">
              Industrielle Dienstleistungen
            </p>
            <h1 className="animate-fadeUp font-headline text-6xl font-semibold uppercase leading-[0.88] opacity-0 [animation-delay:120ms] sm:text-7xl lg:text-8xl">
              Industrie. Instandhaltung. Präzision.
            </h1>
            <p className="mt-7 max-w-2xl animate-fadeUp text-lg leading-8 text-white/78 opacity-0 [animation-delay:220ms]">
              Ihr Partner für Rohrbau, Stahlbau, GFK und Anlagentechnik.
            </p>
            <div className="mt-9 flex animate-fadeUp flex-col gap-3 opacity-0 [animation-delay:320ms] sm:flex-row">
              <Link
                href="#kontakt"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-6 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Projekt anfragen
                <ArrowRight aria-hidden size={18} />
              </Link>
              <Link
                href="#leistungen"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-white/28 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-primary"
              >
                Leistungen ansehen
                <ArrowDown aria-hidden size={18} />
              </Link>
            </div>
          </div>

          <div className="hidden border-l border-white/18 pl-7 text-sm leading-7 text-white/72 lg:block">
            <div className="mb-4 flex items-center gap-2 font-bold text-white">
              <CheckCircle2 aria-hidden className="h-5 w-5 text-accent" />
              Bereit fuer Stillstand, Umbau und laufenden Betrieb
            </div>
            <p>
              Schlanke Abstimmung, klare Ansprechpartner und technische Umsetzung mit Blick auf
              Sicherheit, Termine und dokumentierbare Ergebnisse.
            </p>
          </div>
        </div>
      </section>

      <section id="kunden" className="scroll-mt-24 bg-bgLight py-18">
        <div className="section-shell py-16">
          <SectionHeader
            eyebrow="Kunden & Partner"
            title={[
              "Bestehende Kunden und Partnern aus",
              "Industrie, Schiffsbau und technischer Infrastruktur"
            ]}
            align="center"
            eyebrowSize="large"
            width="wide"
          />
        </div>
        <CustomerMarquee />
      </section>

      <section id="leistungen" className="scroll-mt-24 bg-bgLight py-20">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Leistungen"
            title="Neun Leistungsfelder fuer industrielle Projekte."
            description="Von Montage und Instandhaltung bis Projektkoordination: Die Karten sind modular aufgebaut und koennen direkt mit den finalen Leistungstexten befuellt werden."
          />
          <ServicesCarousel />
        </div>
      </section>

      <section id="ueber-uns" className="scroll-mt-24 bg-white py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow="Ueber uns"
            title="Direkt, technisch, verlaesslich."
            description="Vitja steht fuer pragmatische Unterstuetzung in anspruchsvollen Industrieumgebungen. Wir verbinden operative Erfahrung mit sauberer Koordination und bleiben nah an den Menschen, die vor Ort Verantwortung tragen."
          />
          <div className="grid gap-6">
            <p className="text-base leading-8 text-textSecondary">
              Unser Anspruch ist nicht, Prozesse aufzublasen, sondern technische Arbeit planbar zu
              machen: mit klarer Vorbereitung, belastbaren Absprachen und Teams, die wissen, wie
              Industriebaustellen funktionieren.
            </p>
            <CountUpStats />
          </div>
        </div>
      </section>

      <section id="kontakt" className="scroll-mt-24 bg-bgLight py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader
              eyebrow="Kontakt"
              title="Sprechen wir ueber Ihr naechstes Projekt."
              description="Das Formular ist lokal sofort nutzbar. Ohne Resend API-Key wird die Anfrage als Mock verarbeitet; mit API-Key versendet der Endpunkt echte E-Mails."
            />
            <div className="mt-8 grid gap-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex gap-4 border border-primary/10 bg-white p-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center bg-primary text-white">
                    <item.icon aria-hidden size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{item.label}</p>
                    <p className="mt-1 text-sm text-textSecondary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
