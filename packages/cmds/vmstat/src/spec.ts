import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const VmstatSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * vmstat's own positional operands — `vmstat [options] [delay [count]]` —
   * not catalogue flags at all, same reasoning `@cmdgen/cal`'s `month`/`year`
   * gives for its own bare positionals. `delay` is seconds between updates;
   * `count` is how many updates to print before stopping (only meaningful
   * once `interval` is set — see VMS002 in lint/rules.ts).
   */
  interval: z.number().int().positive().optional(),
  count: z.number().int().positive().optional(),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/top`'s `shell` field.
   * vmstat has no Windows-native or PowerShell form; only ever reached from
   * within a POSIX-capable shell. Kept only so the generic render pipeline
   * has a ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type VmstatSpec = z.infer<typeof VmstatSpec>;
