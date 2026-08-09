import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { asset } from "@/lib/assets";
import { contactEndpointOrigin } from "@/lib/contact";
import { siteConfig } from "@/lib/content";
import "./globals.css";

// Beim statischen Export setzt kein Server Response-Header. Per <meta http-equiv>
// wirkt nur CSP -- frame-ancestors, X-Content-Type-Options, Referrer-Policy und
// Permissions-Policy lassen sich so nicht abbilden und entfallen bewusst.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  ["connect-src 'self'", contactEndpointOrigin()].filter(Boolean).join(" ")
].join("; ");

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], display: "swap", weight: ["500", "600", "700"], variable: "--font-barlow-condensed" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0D0F12" };

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: { default: "Triumph Technical Services | Technische Lösungen für Industrie & Schiffbau", template: "%s | Triumph Technical Services" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  icons: { icon: asset("/brand/mark.svg"), shortcut: asset("/brand/mark.svg"), apple: asset("/brand/mark.svg") },
  openGraph: {
    title: "Technische Lösungen, die im Betrieb bestehen.",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "de_DE",
    type: "website",
    images: [{ url: "/brand/social-preview.jpg", width: 1200, height: 630, alt: "Triumph Technical Services – Technische Lösungen, die im Betrieb bestehen" }]
  },
  twitter: { card: "summary_large_image", title: "Triumph Technical Services", description: siteConfig.description, images: ["/brand/social-preview.jpg"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <head><meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} /></head>
      <body><a className="skip-link" href="#main-content">Zum Inhalt springen</a><Navbar /><div id="main-content">{children}</div><Footer /></body>
    </html>
  );
}
