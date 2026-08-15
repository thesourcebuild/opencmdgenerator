import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * netstat has zero real positionals — every real invocation is pure flags
 * (`netstat -tulnp`, `netstat -r`, a bare `netstat`, ...), unlike traceroute
 * or ping which always need a target. Same shape as `@cmdgen/df` when called
 * with no paths, except here there's no positional field at all to omit.
 */
export const NetstatSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — this models the net-tools `netstat` found on
   * Linux (and, in a slightly different flavor, macOS). Windows' own
   * `netstat.exe` shares the name but has a different flag set (`-ano`
   * instead of `-tulnp`), a genuinely different tool this app does not model
   * here — same single-platform shape as `@cmdgen/service`'s `shell` field.
   * Kept only so the generic render pipeline has a ShellDialect to quote
   * with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type NetstatSpec = z.infer<typeof NetstatSpec>;
