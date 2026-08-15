import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const TouchSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/chmod`'s `shell`
   * field. touch has no Windows-native or PowerShell form (`New-Item` plus
   * separately setting `.LastWriteTime` is a composite operation, not one
   * command); only ever reached from within a POSIX-capable shell. Kept only
   * so the generic render pipeline has a ShellDialect to quote with; the UI
   * never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type TouchSpec = z.infer<typeof TouchSpec>;
