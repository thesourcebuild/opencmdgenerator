import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const WhatisSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * whatis takes exactly one positional — the command name to look up —
   * never an arbitrary list, same shape as `@cmdgen/killall`'s `processName`.
   * Named `word` (matching real whatis's own terminology for the search
   * term) instead of `name` to avoid colliding with the display-name field
   * every spec already carries above.
   */
  word: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s `shell`
   * field. whatis has no Windows-native or PowerShell equivalent at all;
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type WhatisSpec = z.infer<typeof WhatisSpec>;
