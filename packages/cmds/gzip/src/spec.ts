import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const GzipSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Files to compress (or, with `-d`, to decompress). Empty is valid, real
   * usage — bare `gzip` with no operands reads from stdin and writes the
   * compressed stream to stdout — so unlike `@cmdgen/zip`'s `files`, an empty
   * list is deliberately NOT flagged as an error (same
   * paths-empty-means-something-else precedent as `@cmdgen/df`'s `paths`).
   */
  files: z.array(z.string()).default([]),

  /**
   * Real gzip's compression level is `-1` (fastest) through `-9` (best),
   * where the digit IS the flag — there is no separate `--level=N` form. The
   * generic flag catalogue can only render `--long=value` or `--long value`
   * shapes, neither of which fits a value baked directly into the flag
   * character, so this lives as a plain spec-level field instead and is
   * pushed onto argv by hand in `argv/index.ts` — same
   * doesn't-fit-the-catalogue-shape reasoning as `@cmdgen/dd`'s `KEY=VALUE`
   * operands. `--fast`/`--best` (the -1/-9 aliases mentioned in gzip's own
   * --help) are just the two endpoints of this same field, so they are not
   * modeled as separate flags.
   */
  compressionLevel: z.number().int().min(1).max(9).optional(),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/zip`'s `shell` field.
   * gzip has no Windows-native or PowerShell form by the same name; only ever
   * reached from within a POSIX-capable shell. Kept only so the generic
   * render pipeline has a ShellDialect to quote with; the UI never offers a
   * way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type GzipSpec = z.infer<typeof GzipSpec>;
