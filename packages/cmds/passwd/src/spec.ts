import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const PasswdSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * passwd's positional is OPTIONAL, unlike killall's mandatory
   * `processName`: a bare `passwd` with no username changes the CURRENT
   * user's own password — a valid, common case, not an error. An empty
   * string means "change my own password."
   */
  username: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s/
   * `@cmdgen/touch`'s `shell` field. passwd has no Windows-native form
   * (`net user` is a different tool, not modeled here); only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type PasswdSpec = z.infer<typeof PasswdSpec>;
