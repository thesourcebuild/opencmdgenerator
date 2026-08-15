import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const WgetSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** wget takes exactly one positional — the URL to download — never an arbitrary list, same shape as `@cmdgen/killall`'s `processName`. */
  url: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s/
   * `@cmdgen/touch`'s `shell` field. wget has no native Windows equivalent by
   * this name (`Invoke-WebRequest` is a different tool with entirely
   * different syntax, not modeled here); only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type WgetSpec = z.infer<typeof WgetSpec>;
