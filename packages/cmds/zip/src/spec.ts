import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const ZipSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The .zip file to create or update. */
  archiveName: z.string().default(""),

  /** Files and/or directories to add to the archive. */
  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/df`'s/`@cmdgen/touch`'s
   * `shell` field. zip has no Windows-native or PowerShell form by the same
   * name (PowerShell's `Compress-Archive` is a different tool with different
   * syntax, not modeled here); only ever reached from within a POSIX-capable
   * shell. Kept only so the generic render pipeline has a ShellDialect to
   * quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type ZipSpec = z.infer<typeof ZipSpec>;
