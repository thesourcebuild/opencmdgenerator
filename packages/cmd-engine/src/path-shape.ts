/**
 * Pure path-*shape* detection — no translation, no command-specific rules.
 * Lives here (not in a command package) because more than one command needs
 * to notice "this looks like a Windows path" for its own lint rules: rsync's
 * path-flavour mismatch warning and cd's platform mismatch warning both use
 * the exact same check.
 */

export const WINDOWS_DRIVE = /^([A-Za-z]):[\\/](.*)$/;
export const UNC = /^\\\\([^\\]+)\\(.*)$/;

export function looksAbsolute(input: string): boolean {
  const p = input.trim();
  return p.startsWith("/") || WINDOWS_DRIVE.test(p) || UNC.test(p);
}

export function looksLikeWindowsPath(input: string): boolean {
  const p = input.trim();
  return WINDOWS_DRIVE.test(p) || UNC.test(p) || (p.includes("\\") && !p.startsWith("/"));
}

/**
 * Rewrite a Windows-style path into the spelling a bash running under
 * Cygwin, MSYS2 or WSL expects — the same translation `@cmdgen/rsync`'s
 * `toRsyncPath` already does for its `cygwin`/`msys`/`wsl` `PathFlavor`
 * values, generalized here so the generic render pipeline can apply it to
 * any command's "path"-role arguments, not just rsync's:
 *
 *   C:\Data\Photos  ->  /cygdrive/c/Data/Photos   (cygwin)
 *                   ->  /c/Data/Photos            (msys)
 *                   ->  /mnt/c/Data/Photos        (wsl)
 */
export function toBashPath(input: string, dialect: "cygwin" | "msys" | "wsl"): string {
  const p = input.trim();
  if (p === "") return p;

  const unc = UNC.exec(p);
  if (unc) {
    // UNC shares are addressed the same way under every dialect.
    const [, server, rest] = unc;
    return `//${server}/${(rest ?? "").replace(/\\/g, "/")}`;
  }

  const m = WINDOWS_DRIVE.exec(p);
  if (!m) return p.replace(/\\/g, "/");

  const drive = (m[1] ?? "").toLowerCase();
  const tail = (m[2] ?? "").replace(/\\/g, "/");
  switch (dialect) {
    case "cygwin":
      return `/cygdrive/${drive}/${tail}`;
    case "msys":
      return `/${drive}/${tail}`;
    case "wsl":
      return `/mnt/${drive}/${tail}`;
  }
}
