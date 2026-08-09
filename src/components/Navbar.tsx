"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";
import { asset } from "@/lib/assets";
import { navItems, siteConfig } from "@/lib/content";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-link" aria-label="Triumph Technical Services – Startseite">
          <Image className="brand-desktop" src={asset("/brand/logo.svg")} alt="Triumph Technical Services" width={252} height={144} loading="eager" />
          <Image className="brand-mobile" src={asset("/brand/mark.svg")} alt="" width={42} height={42} loading="eager" />
          <span className="brand-mobile-name" aria-hidden="true">
            <span>Triumph</span>
            <span>Technical</span>
            <span>Services</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>

        <div className="header-actions">
          <a className="button button-small header-call" href={`tel:${siteConfig.phoneHref}`} aria-label={`Triumph Technical Services anrufen: ${siteConfig.phone}`}>
            <PhoneCall aria-hidden="true" /><span>Anrufen</span>
          </a>
          <Link className="button button-small header-primary" href="/#kontakt">Leistung besprechen</Link>
        </div>

        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Menü schließen" : "Menü öffnen"} onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Mobile Navigation">
        <div className="shell mobile-nav-inner">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <Link className="button" href="/#kontakt" onClick={() => setOpen(false)}>Leistung besprechen</Link>
        </div>
      </nav>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
