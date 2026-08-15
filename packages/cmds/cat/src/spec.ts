import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/mkdir`'s `MkdirPlatform`: cat has real,
 * commonly-used native cmd.exe (`type`) and PowerShell (`Get-Content`)
 * alternatives whose syntax genuinely differs from POSIX `cat` — plus three
 * more Windows sub-choices, `windows-cygwin`/`windows-msys`/`windows-wsl`,
 * which invoke the exact same real `cat` binary/flags as `linux`/`mac`
 * (unlike `windows-cmd`'s `type` or `windows-powershell`'s `Get-Content`)
 * since Cygwin, MSYS2 and WSL all ship genuine GNU coreutils — see
 * `catalogue/flags.ts`'s `availableOn` arrays, which list them alongside
 * `linux`/`mac` for exactly that reason. They stay distinct enum values (not
 * folded into `linux`/`mac`) purely for `render.ts`'s benefit: it needs to
 * know specifically "cygwin", "msys" or "wsl" to rewrite a "path"-role file's
 * Windows drive-letter/UNC spelling into that dialect's own bash spelling.
 */
export const CatPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type CatPlatform = z.infer<typeof CatPlatform>;

export const CatSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),
  platform: CatPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type CatSpec = z.infer<typeof CatSpec>;
