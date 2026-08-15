import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const MountSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Both optional at the schema level — a bare `mount` with neither is valid
   * real-world usage (it lists every currently mounted filesystem). Same
   * two-independent-operand shape as `@cmdgen/diff`'s `file1`/`file2`.
   */
  device: z.string().default(""),
  mountPoint: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/touch`'s `shell`
   * field. mount has no Windows-native equivalent by the same name ("net
   * use"/drive letters are a fundamentally different concept, not modeled
   * here); only ever reached from within a POSIX-capable shell. Kept only so
   * the generic render pipeline has a ShellDialect to quote with; the UI
   * never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type MountSpec = z.infer<typeof MountSpec>;
