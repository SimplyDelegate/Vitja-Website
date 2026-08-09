// Auf GitHub Pages laeuft die Seite unter /Vitja-Website, lokal unter /.
// Der CI-Build setzt NEXT_PUBLIC_BASE_PATH, `npm run dev` laeuft ohne Praefix.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // Kein Image-Optimizer auf einem statischen Host.
    unoptimized: true
  }
  // Security-Header koennen hier nicht gesetzt werden: der statische Export wird
  // von GitHub Pages ausgeliefert, nicht von einem Next-Server. Was per Dokument
  // moeglich ist, steht als <meta http-equiv> in src/app/layout.tsx.
};

export default nextConfig;
