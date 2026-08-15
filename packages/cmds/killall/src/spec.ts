import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const KillallSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** killall takes exactly one positional — the process name to match and kill — never an arbitrary list, same shape as `@cmdgen/cmp`'s/`@cmdgen/diff`'s single-string operands. */
  processName: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/touch`'s `shell`
   * field. killall has no Windows-native or PowerShell form (`taskkill /IM`
   * is a different tool with a different name, not modeled here); only ever
   * reached from within a POSIX-capable shell. Kept only so the generic
   * render pipeline has a ShellDialect to quote with; the UI never offers a
   * way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type KillallSpec = z.infer<typeof KillallSpec>;
