import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const WhereisSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** whereis takes exactly one positional — the command name to locate — never an arbitrary list, same shape as `@cmdgen/killall`'s `processName`. */
  command: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s `shell`
   * field. whereis has no Windows-native or PowerShell form at all; only
   * ever reached from within a POSIX-capable shell. Kept only so the generic
   * render pipeline has a ShellDialect to quote with; the UI never offers a
   * way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type WhereisSpec = z.infer<typeof WhereisSpec>;
