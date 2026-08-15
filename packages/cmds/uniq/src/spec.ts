import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const UniqSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Real uniq takes an optional input file and an optional output file — 0, 1, or 2 entries here, in that order. */
  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/df`'s `shell` field.
   * uniq has no cmd.exe or PowerShell single-command form by the same name;
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type UniqSpec = z.infer<typeof UniqSpec>;
