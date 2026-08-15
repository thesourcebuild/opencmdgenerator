import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Models a real-world CORE SUBSET of awk, not the full awk language — this is
 * a command-line-flag generator, not an awk interpreter. `program` is opaque
 * user-supplied script text passed straight through; this package never
 * parses or validates awk syntax itself. Same scope decision as
 * `@cmdgen/sed`'s `script` field.
 */
export const AwkSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The awk script/expression, e.g. "{print $1}". Opaque text — see the scope note above. */
  program: z.string().default(""),
  files: z.array(z.string()).default([]),

  /**
   * `-v var=value`, repeated. Not a catalogue flag — the flag catalogue has
   * no repeated-flag concept, same reasoning as `@cmdgen/curl`'s `headers`.
   * Each entry is rendered verbatim as its own `-v ENTRY` pair, in order.
   */
  assignments: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/df`'s `shell` field.
   * awk has no cmd.exe or PowerShell single-command form by the same name;
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type AwkSpec = z.infer<typeof AwkSpec>;
