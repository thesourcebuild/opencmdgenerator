import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const PkillSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * The pattern pkill matches against process names (or full command lines,
   * with --full) — a substring/regex fragment, not one exact name like
   * `@cmdgen/killall`'s `processName`. This is exactly why pkill is riskier
   * than killall: the match is inherently fuzzier (see lint/rules.ts).
   */
  pattern: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s `shell`
   * field. pkill has no Windows-native or PowerShell form by this name;
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type PkillSpec = z.infer<typeof PkillSpec>;
