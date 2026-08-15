import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/cd`'s `CdPlatform`: mkdir has a real,
 * commonly-used native cmd.exe builtin (`md`, always creates intermediate
 * directories, no flags at all) whose syntax genuinely differs from both
 * POSIX `mkdir -p` and PowerShell's `New-Item -ItemType Directory` — plus
 * three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, which invoke the exact same real `mkdir` binary/flags as
 * `linux`/`mac` (unlike `windows-cmd`'s `md` or `windows-powershell`'s
 * `New-Item`) since Cygwin, MSYS2 and WSL all ship genuine GNU coreutils —
 * see `catalogue/flags.ts`'s `availableOn` arrays, which list them alongside
 * `linux`/`mac` for exactly that reason. They stay distinct enum values (not
 * folded into `linux`/`mac`) purely for `render.ts`'s benefit: it needs to
 * know specifically "cygwin", "msys" or "wsl" to rewrite a "path"-role
 * directory's Windows drive-letter/UNC spelling into that dialect's own bash
 * spelling.
 */
export const MkdirPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type MkdirPlatform = z.infer<typeof MkdirPlatform>;

export const MkdirSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  directories: z.array(z.string()).default([]),
  platform: MkdirPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type MkdirSpec = z.infer<typeof MkdirSpec>;
