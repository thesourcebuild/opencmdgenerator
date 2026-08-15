import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Windows-only, and only ever these two real targets — `where.exe` has no
 * Linux/Mac equivalent by this name (`which`/`whereis` already cover POSIX).
 *
 * The two values matter for more than quoting: PowerShell ships a built-in
 * alias `where -> Where-Object` that silently shadows the real `where.exe`.
 * Verified against a real PowerShell session: a bare `where notepad.exe`
 * invokes `Where-Object` instead (which silently does nothing useful with a
 * plain string argument — no error, no output, nothing), while
 * `where.exe notepad.exe` correctly lists every match on PATH. So the
 * `powershell` branch must render the binary as `where.exe` (the explicit
 * extension bypasses the alias); the `cmd` branch has no such alias and
 * renders plain `where`. See `argv/index.ts`.
 *
 * Both values are also valid `ShellDialect` members already, so no bespoke
 * quoting dispatch (unlike `@cmdgen/alias`'s `AliasPlatform`) is needed —
 * `spec.platform` is passed straight through to the generic renderer.
 */
export const WherePlatform = z.enum(["cmd", "powershell"]);
export type WherePlatform = z.infer<typeof WherePlatform>;

export const WhereSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Patterns to search for — where accepts one or more, same shape as
   * `@cmdgen/which`'s `names`. May include wildcards (`*`/`?`) or the
   * `$env_var:pattern` form real `where.exe` also supports (searches the
   * directories listed in a specific environment variable instead of PATH).
   */
  patterns: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  platform: WherePlatform.default("cmd"),
});
export type WhereSpec = z.infer<typeof WhereSpec>;
