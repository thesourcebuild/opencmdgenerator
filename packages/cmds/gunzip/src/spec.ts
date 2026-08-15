import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const GunzipSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Files to decompress. Empty is valid, real usage — bare `gunzip` with no
   * operands reads a compressed stream from stdin and writes the
   * decompressed data to stdout — so, same paths-empty-means-something-else
   * precedent as `@cmdgen/df`'s `paths`, an empty list is deliberately NOT
   * flagged as an error.
   */
  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/gzip`'s `shell`
   * field. gunzip has no Windows-native or PowerShell form by the same name;
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type GunzipSpec = z.infer<typeof GunzipSpec>;
