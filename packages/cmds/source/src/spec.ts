import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const SourceSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The script to load and run in the current shell. */
  file: z.string().default(""),
  /** Positional arguments passed to the sourced script — exposed inside it as $1, $2, ... */
  args: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — source (bash's `.`/`source` builtin) has no cmd.exe or
   * PowerShell equivalent by this name. Kept only so the shared render
   * pipeline has a `ShellDialect` to quote with. The UI never offers a way
   * to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SourceSpec = z.infer<typeof SourceSpec>;
