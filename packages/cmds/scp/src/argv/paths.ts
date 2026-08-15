import type { PathFlavor } from "../spec";
import { looksAbsolute, looksLikeWindowsPath, UNC, WINDOWS_DRIVE } from "@cmdgen/engine";

export { looksAbsolute, looksLikeWindowsPath };

/**
 * Translate a LOCAL path into the spelling the target scp build understands.
 * Windows has no native scp, so a drive-letter path has to be rewritten —
 * identical rule to rsync's `toRsyncPath` (see @cmdgen/rsync/argv/paths.ts):
 *
 *   C:\Data\Photos  ->  /cygdrive/c/Data/Photos   (cwRsync-style / Cygwin OpenSSH)
 *                   ->  /c/Data/Photos            (MSYS2)
 *                   ->  /mnt/c/Data/Photos        (WSL)
 */
export function toScpPath(input: string, flavor: PathFlavor): string {
  const p = input.trim();
  if (p === "") return p;
  if (flavor === "unix") return p;

  const unc = UNC.exec(p);
  if (unc) {
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

/**
 * Just trims whitespace — unlike rsync, scp has no trailing-slash-changes-meaning
 * special case (no `contentsOnly` concept), so a trailing slash the user typed
 * is preserved exactly, not stripped.
 */
export function normalisePath(input: string): string {
  return input.trim();
}
