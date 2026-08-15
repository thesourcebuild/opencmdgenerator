import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Which shell will run the generated command. `echo` itself is spelled the
 * same way on bash/zsh (a shell builtin), but cmd.exe's builtin `echo` has no
 * flags at all, and PowerShell has neither a real `echo` nor its flags —
 * "echo" there is an alias for `Write-Output`, which gains `-NoNewline` only
 * by switching to `Write-Host` instead. Linux and macOS share the same POSIX
 * behavior, so there is no separate "mac" flag set — only the platform tag
 * differs, for defaults and lint.
 *
 * Three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, invoke the exact same real bash builtin `echo` as
 * `linux`/`mac` (unlike `windows-cmd`'s flagless builtin or
 * `windows-powershell`'s `Write-Output`/`Write-Host` alias) since Cygwin,
 * MSYS2 and WSL all run a genuine bash — see `catalogue/flags.ts`'s
 * `availableOn` arrays, which list them alongside `linux`/`mac` for exactly
 * that reason. They stay distinct enum values (not folded into `linux`/`mac`)
 * for consistency with every other multi-platform command in this app, even
 * though echo itself has no path argument for `render.ts` to rewrite between
 * dialects — only the quoting switch needs to know about them.
 */
export const EchoPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type EchoPlatform = z.infer<typeof EchoPlatform>;

export const EchoSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The message text, rendered verbatim (not trimmed — echo can print an intentionally blank line). */
  text: z.string().default(""),
  platform: EchoPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type EchoSpec = z.infer<typeof EchoSpec>;
