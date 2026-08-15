import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/mkdir`'s `MkdirPlatform`: cmd.exe's
 * `copy` and PowerShell's `Copy-Item` are both genuinely different dialects
 * from POSIX `cp` — plus three more Windows sub-choices, `windows-cygwin`/
 * `windows-msys`/`windows-wsl`, which invoke the exact same real `cp`
 * binary/flags as `linux`/`mac` (unlike `windows-cmd`'s `copy` or
 * `windows-powershell`'s `Copy-Item`) since Cygwin, MSYS2 and WSL all ship
 * genuine GNU coreutils — see `catalogue/flags.ts`'s `availableOn` arrays,
 * which list them alongside `linux`/`mac` for exactly that reason. They
 * render multiple sources space-separated with no comma-join, same as
 * `linux`/`mac`, and carry none of `windows-cmd`'s `copy`-concatenation trap
 * (see `render.ts`'s `commaJoins` and `lint/rules.ts`'s CP004, both of which
 * stay narrowly scoped to the one literal platform value that actually needs
 * them). They stay distinct enum values (not folded into `linux`/`mac`)
 * purely for `render.ts`'s benefit: it needs to know specifically "cygwin",
 * "msys" or "wsl" to rewrite a "path"/"host"-role token's Windows
 * drive-letter/UNC spelling into that dialect's own bash spelling.
 */
export const CpPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type CpPlatform = z.infer<typeof CpPlatform>;

export const CpSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  sources: z.array(z.string()).default([]),
  /** Where the copies end up — a directory when there's more than one source, or the new name/location for a single one. */
  destination: z.string().default(""),

  platform: CpPlatform.default("linux"),
  flags: FlagValues.default({}),
});
export type CpSpec = z.infer<typeof CpSpec>;
