import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/mkdir`'s `MkdirPlatform`: mv has a
 * real, commonly-used native cmd.exe builtin (`move`, comma-separated
 * sources) and PowerShell's `Move-Item` (comma-separated `-Path` array),
 * both genuinely different dialects from POSIX `mv` — plus three more
 * Windows sub-choices, `windows-cygwin`/`windows-msys`/`windows-wsl`, which
 * invoke the exact same real `mv` binary/flags as `linux`/`mac` (unlike
 * `windows-cmd`'s `move` or `windows-powershell`'s `Move-Item`) since
 * Cygwin, MSYS2 and WSL all ship (or run) genuine GNU coreutils — see
 * `catalogue/flags.ts`'s `availableOn` arrays, which list them alongside
 * `linux`/`mac` for exactly that reason. They stay distinct enum values (not
 * folded into `linux`/`mac`) purely for `render.ts`'s benefit: it needs to
 * know specifically "cygwin", "msys" or "wsl" to rewrite a "path"/"host"-role
 * token's Windows drive-letter/UNC spelling into that dialect's own bash
 * spelling, and to know NOT to comma-join multiple sources the way
 * `windows-cmd`/`windows-powershell` do — real Cygwin/MSYS2/WSL `mv` takes
 * plain space-separated positional arguments just like `linux`/`mac`.
 */
export const MvPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type MvPlatform = z.infer<typeof MvPlatform>;

export const MvSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  sources: z.array(z.string()).default([]),
  /** Where the sources end up — a directory when there's more than one source, or the new name/location for a single one. */
  destination: z.string().default(""),

  platform: MvPlatform.default("linux"),
  flags: FlagValues.default({}),
});
export type MvSpec = z.infer<typeof MvSpec>;
