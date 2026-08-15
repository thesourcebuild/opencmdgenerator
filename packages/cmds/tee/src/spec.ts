import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const TeeSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Output file targets — tee writes to each of these AND to standard output. */
  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/df`'s `shell` field.
   * tee has no cmd.exe or PowerShell single-command form by the same name
   * (Tee-Object is a different cmdlet, not modeled here); only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type TeeSpec = z.infer<typeof TeeSpec>;
