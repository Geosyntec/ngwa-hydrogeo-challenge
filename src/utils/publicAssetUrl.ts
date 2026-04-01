/**
 * Prefix root-relative public URLs with Vite `import.meta.env.BASE_URL`
 * so assets work under a subdirectory (e.g. `/ngwa-dev/`).
 *
 * Map backgrounds and other `public/` files use paths like `/assets/img/foo.jpg`.
 */
export function resolvePublicAssetUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  const base = import.meta.env.BASE_URL;
  if (base === "/" || base === "./") return normalized;
  const baseTrim = base.replace(/\/$/, "");
  return `${baseTrim}${normalized}`;
}
