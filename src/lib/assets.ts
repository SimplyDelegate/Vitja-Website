// Auf GitHub Pages liegt die Seite unter /Vitja-Website. Next stellt basePath
// zwar Links und _next-Assets voran, aber nicht den src-Attributen von
// next/image (mit `images.unoptimized` laeuft kein Loader) oder von <video>,
// <source> und den Favicon-Eintraegen in der Metadata. Diese Pfade muessen
// deshalb hier durchlaufen, sonst laufen sie im Deploy in einen 404.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
