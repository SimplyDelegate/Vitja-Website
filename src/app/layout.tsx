import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ReviewOverlay } from "@/components/ReviewOverlay";
import { asset } from "@/lib/assets";
import { contactEndpointOrigin } from "@/lib/contact";
import { siteConfig } from "@/lib/content";
import { homeTitle, pageMetadata } from "@/lib/seo";
import "./globals.css";

// Beim statischen Export setzt kein Server Response-Header. Per <meta http-equiv>
// wirkt nur CSP. Ergänzende HTTP-Sicherheitsheader stehen für Cloudflare Pages
// in public/_headers.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  process.env.NODE_ENV === "development" ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  ["connect-src 'self'", contactEndpointOrigin()].filter(Boolean).join(" ")
].join("; ");

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], display: "swap", weight: ["500", "600", "700"], variable: "--font-barlow-condensed" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#EFEAE1" };

export const metadata: Metadata = {
  ...pageMetadata(homeTitle, siteConfig.description),
  metadataBase: new URL(siteConfig.domain),
  icons: { icon: asset("/brand/mark.svg"), shortcut: asset("/brand/mark.svg"), apple: asset("/brand/mark.svg") }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <head><meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} /></head>
      <body><a className="skip-link" href="#main-content">Zum Inhalt springen</a><Navbar /><div id="main-content">{children}</div><Footer />{process.env.NODE_ENV === "development" && <ReviewOverlay />}</body>
    </html>
  );
}
