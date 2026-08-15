import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const WhichSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Command names to locate on PATH — which accepts one or more, unlike
   * `@cmdgen/whereis`'s single `command` field.
   */
  names: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/whereis`'s `shell`
   * field. which has no Windows-native or PowerShell form by this name
   * (`Get-Command` is a different tool with different output, not modeled
   * here); only ever reached from within a POSIX-capable shell. Kept only so
   * the generic render pipeline has a ShellDialect to quote with; the UI
   * never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type WhichSpec = z.infer<typeof WhichSpec>;
