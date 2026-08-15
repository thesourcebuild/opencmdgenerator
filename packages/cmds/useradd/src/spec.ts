import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const UseraddSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** useradd takes exactly one positional — the new account's username — never an arbitrary list, same shape as `@cmdgen/killall`'s `processName`. */
  username: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — useradd is a GNU/Linux-specific tool with
   * no Windows-native or PowerShell form (macOS uses `dscl`/`sysadminctl`, a
   * different tool with different syntax, not modeled here); only ever
   * reached from within a POSIX-capable shell. Kept only so the generic
   * render pipeline has a ShellDialect to quote with; the UI never offers a
   * way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type UseraddSpec = z.infer<typeof UseraddSpec>;
