import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/mv`'s `MvPlatform` — cmd.exe's
 * `findstr` is a real, genuinely different builtin (its own regex dialect,
 * its own flags), and PowerShell's `Select-String` is a different cmdlet
 * entirely (case-INsensitive by default, the opposite of grep's own default).
 *
 * Three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, invoke the exact same real GNU `grep` binary as
 * `linux`/`mac` (unlike `windows-cmd`'s `findstr` or `windows-powershell`'s
 * `Select-String`) since Cygwin, MSYS2 and WSL all run a genuine bash with a
 * genuine GNU grep — see `catalogue/flags.ts`'s `availableOn` arrays, which
 * list them alongside `linux`/`mac` for exactly that reason. They stay
 * distinct enum values (not folded into `linux`/`mac`) purely for
 * `render.ts`'s benefit: it needs to know specifically which of the three to
 * rewrite a file-path argument's Windows drive-letter/UNC spelling into that
 * dialect's own bash spelling. The search pattern is never touched by that
 * rewrite — it's free-form user data, not a path.
 */
export const GrepPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type GrepPlatform = z.infer<typeof GrepPlatform>;

export const GrepSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  pattern: z.string().default(""),
  files: z.array(z.string()).default([]),
  platform: GrepPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type GrepSpec = z.infer<typeof GrepSpec>;
