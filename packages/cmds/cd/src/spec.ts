import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Which shell will run the generated command. `cd` itself is spelled the same
 * way everywhere (a shell builtin, or aliased to `Set-Location` in
 * PowerShell), but its available flags and quoting rules genuinely differ:
 * bash/zsh `cd` takes -L/-P/-e/-@; cmd.exe needs `/d` to switch drives and
 * has none of those; PowerShell has neither but adds -LiteralPath/-PassThru.
 * Linux and macOS share the same POSIX behavior, so there is no separate
 * "mac" flag set — only the platform tag differs, for defaults and lint.
 *
 * Three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, invoke the exact same real `cd` shell builtin as
 * `linux`/`mac` (unlike `windows-cmd`'s `/d`-flavored builtin or
 * `windows-powershell`'s `Set-Location` alias) since Cygwin, MSYS2 and WSL
 * all run a genuine bash — see `catalogue/flags.ts`'s `availableOn` arrays,
 * which list them alongside `linux`/`mac` for exactly that reason. They stay
 * distinct enum values (not folded into `linux`/`mac`) purely for
 * `render.ts`'s benefit: it needs to know specifically which of the three to
 * rewrite cd's one path argument's Windows drive-letter/UNC spelling into
 * that dialect's own bash spelling.
 */
export const CdPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type CdPlatform = z.infer<typeof CdPlatform>;

export const CdSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Directory to change into. Empty means "home" on POSIX platforms. */
  path: z.string().default(""),
  platform: CdPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type CdSpec = z.infer<typeof CdSpec>;
