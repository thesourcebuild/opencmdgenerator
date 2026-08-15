import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape as `@cmdgen/mv`'s `MvPlatform` — cmd.exe's `set` and
 * PowerShell's `$env:` assignment are both genuinely different from bash's
 * `export` builtin, and from each other (PowerShell has no "mark this
 * already-set variable for export" concept at all — every `$env:` variable
 * is already visible to child processes, there's nothing bash's plain
 * `export NAME` — no value — does that PowerShell needs a separate step for)
 * — plus three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, which invoke the exact same real `export NAME=VALUE` syntax
 * as `linux`/`mac` (unlike `windows-cmd`'s `set` or `windows-powershell`'s
 * `$env:`) since Cygwin, MSYS2 and WSL all ship a genuine bash — zero spaces
 * around `=`, same as bash — see `catalogue/flags.ts`'s `availableOn` arrays,
 * which list them alongside `linux`/`mac` for exactly that reason. They stay
 * distinct enum values (not folded into `linux`/`mac`) purely so the UI can
 * still label the generated command "Cygwin"/"MSYS2"/"WSL" instead of a bare
 * "Linux"/"macOS" — see `explain/describe.ts`'s `PLATFORM_LABEL`.
 */
export const ExportPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type ExportPlatform = z.infer<typeof ExportPlatform>;

export const ExportSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The environment variable's name. */
  varName: z.string().default(""),
  /** Empty means "no value" — bash's own "mark an already-set variable for export" form. Only meaningful on POSIX. */
  value: z.string().default(""),
  platform: ExportPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type ExportSpec = z.infer<typeof ExportSpec>;
