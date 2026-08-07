import Link from "next/link";
import { contactItems, navItems, siteConfig } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-bgDark py-14 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-accent font-headline text-2xl font-bold">
              V
            </span>
            <span className="font-headline text-3xl font-semibold uppercase leading-none">
              {siteConfig.name}
            </span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/68">{siteConfig.description}</p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/58">
            Navigation
          </h2>
          <div className="grid gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={`/${item.href}`} className="text-sm text-white/78 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/58">
            Kontakt
          </h2>
          <div className="grid gap-3">
            {contactItems.map((item) => (
              <div key={item.label} className="flex gap-3 text-sm text-white/78">
                <item.icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-5 text-sm text-white/78">
            <Link href="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
