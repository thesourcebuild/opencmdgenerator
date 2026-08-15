import type { PathFlavor } from "../spec";
import { looksAbsolute, looksLikeWindowsPath, UNC, WINDOWS_DRIVE } from "@cmdgen/engine";

export { looksAbsolute, looksLikeWindowsPath };

/**
 * Translate a path into the spelling the target rsync build understands.
 * Windows has no native rsync, so a drive-letter path has to be rewritten:
 *
 *   C:\Data\Photos  ->  /cygdrive/c/Data/Photos   (cwRsync)
 *                   ->  /c/Data/Photos            (MSYS2)
 *                   ->  /mnt/c/Data/Photos        (WSL)
 */
export function toRsyncPath(input: string, flavor: PathFlavor): string {
  const p = input.trim();
  if (p === "") return p;
  if (flavor === "unix") return p;

  const unc = UNC.exec(p);
  if (unc) {
    // UNC shares are addressed the same way in all three Windows flavours.
    const [, server, rest] = unc;
    return `//${server}/${(rest ?? "").replace(/\\/g, "/")}`;
  }

  const m = WINDOWS_DRIVE.exec(p);
  if (!m) return p.replace(/\\/g, "/");

  const drive = (m[1] ?? "").toLowerCase();
  const tail = (m[2] ?? "").replace(/\\/g, "/");

  switch (flavor) {
    case "cygwin":
      return `/cygdrive/${drive}/${tail}`;
    case "msys":
      return `/${drive}/${tail}`;
    case "wsl":
      return `/mnt/${drive}/${tail}`;
    default:
      return p;
  }
}

/** Strip trailing slashes so trailing-slash semantics stay in `contentsOnly`. */
export function normalisePath(input: string): string {
  const p = input.trim();
  if (p === "" || p === "/") return p;
  return p.replace(/[\\/]+$/, "");
}

/**
 * True when `child` is at or below `parent`, comparing translated forms so a
 * Windows path and its cygwin spelling are recognised as the same location.
 */
export function isWithin(parent: string, child: string, flavor: PathFlavor): boolean {
  const a = toRsyncPath(normalisePath(parent), flavor);
  const b = toRsyncPath(normalisePath(child), flavor);
  if (a === "" || b === "") return false;
  const norm = (s: string) => (flavor === "unix" ? s : s.toLowerCase());
  const pa = norm(a);
  const pb = norm(b);
  return pb === pa || pb.startsWith(pa.endsWith("/") ? pa : `${pa}/`);
}
