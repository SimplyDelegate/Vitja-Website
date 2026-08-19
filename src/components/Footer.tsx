import Image from "next/image";
import Link from "next/link";
import { navItems, siteConfig } from "@/lib/content";
import { asset } from "@/lib/assets";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-plate">
            <Image src={asset("/brand/logo-tagline.svg")} alt="Triumph Technical Services – Ihr Partner für Industrielösungen" width={390} height={130} />
          </div>
          <p>Technische Ausführungskompetenz für Industrie, Anlagenbau und maritime Einsatzbereiche.</p>
        </div>
        <div>
          <p className="footer-label">Navigation</p>
          <div className="footer-links">
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
        <div>
          <p className="footer-label">Direkter Kontakt</p>
          <div className="footer-links">
            <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phone}</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <span>{siteConfig.address}</span>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Triumph Technical Services</span>
        <div><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
      </div>
    </footer>
  );
}
