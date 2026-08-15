import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const UnzipSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The .zip archive to extract. Required — see lint rule UNZIP001. */
  archiveName: z.string().default(""),

  /**
   * Specific entries to extract. Empty means "extract everything" — a valid,
   * common case, NOT an error — same paths-empty-means-everything precedent
   * as `@cmdgen/df`'s `paths`.
   */
  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/df`'s `shell` field.
   * unzip has no Windows-native or PowerShell form by the same name
   * (PowerShell's `Expand-Archive` is a different tool, not modeled here);
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type UnzipSpec = z.infer<typeof UnzipSpec>;
