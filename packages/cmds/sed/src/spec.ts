import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const SedSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The first sed expression, e.g. "s/foo/bar/". Opaque text, not parsed. */
  script: z.string().default(""),
  /** Additional `-e` expressions, applied in order after `script`. */
  extraExpressions: z.array(z.string()).default([]),
  files: z.array(z.string()).default([]),

  /**
   * `-i`'s optional backup-suffix argument is a spec field, not a catalogue
   * flag: GNU sed's real syntax attaches the suffix directly with no
   * separator at all (`-i.bak`, never `-i .bak` or `-i=.bak`), a shape the
   * generic flag renderer (which only knows "=" or " " between a flag and
   * its value) cannot produce. `inPlace` tracks whether `-i` is set at all;
   * `backupSuffix` only matters when it is — empty means no backup file
   * (irreversible), matching real sed's own bare `-i`.
   */
  inPlace: z.boolean().default(false),
  backupSuffix: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/df`'s `shell` field.
   * sed has no cmd.exe or PowerShell single-command form by the same name;
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SedSpec = z.infer<typeof SedSpec>;
