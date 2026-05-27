# Implementation Plan: Next.js Rebuild for Vitja-Website

Rebuild the `SimplyDelegate/Vitja-Website` project from scratch using Next.js 14 (App Router) and Tailwind CSS, replacing the temporary vanilla HTML/CSS/JS site.

## User Review Required

> [!IMPORTANT]
> This is a complete architecture transition. All existing vanilla HTML/CSS/JS files will be replaced with a structured Next.js codebase. We will preserve the German language, design variables, and legal requirements.

## Open Questions

> [!IMPORTANT]
> **1. Truncated Plan Details (Services & Clients)**
> Due to a system-level compaction of the conversation history, the details of your original implementation plan (specifically the **9 leistungen** and **6 kunden** lists) were truncated. Could you please paste the text of those 9 services and 6 clients, or specify their names and descriptions?
> 
> **2. Resend API Key / Email Integration**
> The tech stack specifies Resend for emails. Do you have a Resend API Key ready, or should we use Nodemailer (or a mock handler) as a fallback for local development?

## Proposed Changes

### Next.js Project Foundation

We will initialize a Next.js 14 project in the root of `/Users/sascha/Documents/Geschäftlich/Antigravity/Vitja Website`.

#### [DELETE] [index.html](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/index.html)
Remove the old vanilla landing page.

#### [DELETE] [style.css](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/style.css)
Remove the old vanilla stylesheet.

#### [DELETE] [main.js](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/main.js)
Remove the old vanilla script.

#### [DELETE] [imprint.html](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/imprint.html)
Remove the old vanilla imprint.

#### [DELETE] [privacy.html](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/privacy.html)
Remove the old vanilla privacy policy.

#### [NEW] [package.json](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/package.json)
Next.js dependencies and script entries.

#### [NEW] [tailwind.config.ts](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/tailwind.config.ts)
Tailwind configurations using the requested color tokens:
- Primary: `#1a2332`
- Accent: `#f97316`
- BG Light: `#f8f7f4`
- BG Dark: `#0f1621`
- Text Primary: `#1a2332`
- Text Secondary: `#6b7280`

#### [NEW] [src/app/layout.tsx](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/layout.tsx)
Root layout using `next/font` for `Barlow Condensed` (headlines) and `Inter` (body).

#### [NEW] [src/app/globals.css](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/globals.css)
Tailwind directives and global custom variables.

---

### Components & Layout

#### [NEW] [src/components/Navbar.tsx](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/components/Navbar.tsx)
Sticky and responsive navigation header with desktop navigation, mobile hamburger dropdown, and active section highlights.

#### [NEW] [src/components/Footer.tsx](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/components/Footer.tsx)
3-column dark layout footer with branding, services links, address, and links to legal subpages.

---

### Pages & Sections

#### [NEW] [src/app/page.tsx](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/page.tsx)
Main landing page aggregating:
- **Hero Section**: Responsive fullscreen header with Barlow Condensed headlines, description, CTAs, and staggered entrance animations.
- **Kunden Section**: Infinite horizontal marquee displaying the 6 customer/partner logos.
- **Leistungen Section**: Carousel displaying the 9 industrial services with navigation buttons.
- **Über uns Section**: 2-column layout with company description and count-up stats.
- **Kontakt Section**: Contact form placeholder (dashed border mockup in this phase) or dynamic form.

#### [NEW] [src/app/impressum/page.tsx](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/impressum/page.tsx)
German TMG-compliant Impressum page.

#### [NEW] [src/app/datenschutz/page.tsx](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/datenschutz/page.tsx)
German GDPR-compliant Datenschutzerklärung.

---

### Optimization, SEO, & Deployment

#### [NEW] [src/app/sitemap.ts](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/sitemap.ts)
Dynamically generated sitemap for search engine crawlers.

#### [NEW] [src/app/robots.txt](file:///Users/sascha/Documents/Geschäftlich/Antigravity/Vitja%20Website/src/app/robots.txt)
Crawler directives.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify production compilation and TypeScript safety.
- Run accessibility checks on navigation, buttons, and form labels.

### Manual Verification
- Test interactive mobile menu overlay, carousel navigation, and active link transitions.
- Validate that the sitemap and robots.txt serve correctly.
- Commit and push changes to GitHub `SimplyDelegate/Vitja-Website`.
