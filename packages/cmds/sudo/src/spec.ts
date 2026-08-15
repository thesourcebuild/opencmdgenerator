import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const SudoSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * The trailing command line to run as root/another user, as free text
   * (e.g. "apt update"). Rendered by splitting on whitespace and pushing
   * each word as its own separate `value` Arg — see `argv/index.ts` — since
   * this represents multiple shell tokens, not a single operand like
   * `@cmdgen/killall`'s `processName`.
   */
  command: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s `shell`
   * field. sudo has no Windows-native or PowerShell form (`runas`/UAC
   * elevation is a fundamentally different mechanism, not modeled here);
   * only ever reached from within a POSIX-capable shell. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SudoSpec = z.infer<typeof SudoSpec>;
