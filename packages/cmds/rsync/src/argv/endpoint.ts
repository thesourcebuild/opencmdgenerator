import type { Endpoint } from "../endpoint";
import type { PathFlavor } from "../spec";
import { normalisePath, toRsyncPath } from "./paths";

export interface EndpointRenderOptions {
  flavor: PathFlavor;
  /** Append a trailing slash — "copy the contents of", not "copy the directory". */
  contentsOnly: boolean;
}

/**
 * Render an endpoint as the single path token rsync expects.
 *   local  -> /home/me/photos
 *   ssh    -> me@host:/srv/photos          (port travels in -e, not here)
 *   daemon -> rsync://me@host:873/module/path
 */
export function renderEndpoint(e: Endpoint, opts: EndpointRenderOptions): string {
  const { flavor, contentsOnly } = opts;

  switch (e.kind) {
    case "local": {
      const path = toRsyncPath(normalisePath(e.path), flavor);
      return withSlash(path, contentsOnly);
    }
    case "ssh": {
      // A remote path is interpreted by the remote rsync, so it is always POSIX.
      const path = withSlash(normalisePath(e.path), contentsOnly);
      const userPart = e.user ? `${e.user}@` : "";
      return `${userPart}${e.host}:${path}`;
    }
    case "daemon": {
      const userPart = e.user ? `${e.user}@` : "";
      const portPart = e.port !== undefined ? `:${e.port}` : "";
      const sub = normalisePath(e.path).replace(/^\/+/, "");
      const tail = sub === "" ? "" : `/${sub}`;
      return withSlash(`rsync://${userPart}${e.host}${portPart}/${e.module}${tail}`, contentsOnly);
    }
  }
}

function withSlash(path: string, contentsOnly: boolean): string {
  if (!contentsOnly) return path;
  if (path === "" || path.endsWith("/")) return path;
  return `${path}/`;
}

/** Short label for the UI, e.g. "me@host:/srv/photos". */
export function endpointLabel(e: Endpoint): string {
  switch (e.kind) {
    case "local":
      return e.path || "(no path)";
    case "ssh":
      return `${e.user ? `${e.user}@` : ""}${e.host || "(no host)"}:${e.path || "(no path)"}`;
    case "daemon":
      return `rsync://${e.host || "(no host)"}/${e.module || "(no module)"}${e.path ? `/${e.path}` : ""}`;
  }
}

export function endpointIsEmpty(e: Endpoint): boolean {
  switch (e.kind) {
    case "local":
      return e.path.trim() === "";
    case "ssh":
      return e.host.trim() === "" || e.path.trim() === "";
    case "daemon":
      return e.host.trim() === "" || e.module.trim() === "";
  }
}
