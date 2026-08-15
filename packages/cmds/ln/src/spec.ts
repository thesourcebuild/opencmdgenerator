import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/mkdir`'s `MkdirPlatform`: ln has real,
 * commonly-used native cmd.exe (`mklink`) and PowerShell (`New-Item`)
 * syntaxes that genuinely differ from POSIX `ln` — plus three more Windows
 * sub-choices, `windows-cygwin`/`windows-msys`/`windows-wsl`, which invoke
 * the exact same real `ln` binary/flags as `linux`/`mac` (unlike
 * `windows-cmd`'s `mklink` or `windows-powershell`'s `New-Item`) since
 * Cygwin, MSYS2 and WSL all ship (or run) genuine GNU coreutils — see
 * `catalogue/flags.ts`'s `availableOn` arrays, which list them alongside
 * `linux`/`mac` for exactly that reason. `winKind` below is ignored on
 * `windows-cygwin`/`windows-msys`/`windows-wsl` exactly as it already is on
 * `linux`/`mac` — the POSIX `symbolic` catalogue flag is the only axis there
 * too. They stay distinct enum values (not folded into `linux`/`mac`) purely
 * for `render.ts`'s benefit: it needs to know specifically "cygwin", "msys"
 * or "wsl" to rewrite a "path"-role target/link-name's Windows drive-letter/
 * UNC spelling into that dialect's own bash spelling.
 */
export const LnPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type LnPlatform = z.infer<typeof LnPlatform>;

/**
 * Which kind of link to create on Windows — a mode axis, not a catalogue
 * flag, same reasoning as `@cmdgen/chmod`'s `modeAuthoring` and
 * `@cmdgen/kill`'s `mode`: it fundamentally changes which fixed token
 * (`/D`/`/H`/`/J` for `mklink`, or the `-ItemType` value for `New-Item`) gets
 * emitted, not just an independent on/off switch. Ignored entirely on
 * `linux`/`mac`/`windows-cygwin`/`windows-msys`, where the POSIX `symbolic`
 * catalogue flag is the only axis (POSIX `ln` has no junction concept, and
 * file vs. directory symlinks are not a separate mode there — the OS handles
 * both the same way `-s` does — and Cygwin/MSYS2 run that same real `ln`).
 */
export const LnWinKind = z.enum(["file-symlink", "dir-symlink", "hard-link", "junction"]);
export type LnWinKind = z.infer<typeof LnWinKind>;

export const LnSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The existing file/directory being linked to. */
  target: z.string().default(""),
  /** The new link's name. */
  linkName: z.string().default(""),

  platform: LnPlatform.default("linux"),
  winKind: LnWinKind.default("file-symlink"),

  flags: FlagValues.default({}),
});
export type LnSpec = z.infer<typeof LnSpec>;
