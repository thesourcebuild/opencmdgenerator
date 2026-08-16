const DEFAULT_ORIGIN = "https://thesourcebuild.github.io";
const DEFAULT_BASE_PATH = "/opencmdgenerator";

/**
 * Absolute site URL for canonical/OG/sitemap/robots metadata. Honors
 * `NEXT_PUBLIC_SITE_URL` (full override, e.g. a custom domain) and
 * `NEXT_PUBLIC_BASE_PATH` (the GitHub Pages subpath the export is served
 * under). Falls back to the project's real GitHub Pages location so local
 * and CI builds emit identical URLs; the deploy workflow sets the env vars
 * explicitly for repos deployed elsewhere.
 */
export function siteUrl(path = ""): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_ORIGIN).replace(/\/+$/, "");
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH?.trim() || DEFAULT_BASE_PATH).replace(/\/+$/, "");
  const suffix = path.replace(/^\/+/, "");
  const url = `${base}${basePath}${suffix ? `/${suffix}` : ""}`;
  if (url.endsWith("/")) return url;
  // The export uses trailingSlash, so page routes get a trailing slash but
  // static files (sitemap.xml, og.png) do not.
  return /\.\w+$/.test(url) ? url : `${url}/`;
}