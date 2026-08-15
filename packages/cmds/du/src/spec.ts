import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const DuSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  paths: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — same shape as `@cmdgen/df`'s `shell` field. du has no
   * Windows-native or PowerShell form by the same name; only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type DuSpec = z.infer<typeof DuSpec>;
