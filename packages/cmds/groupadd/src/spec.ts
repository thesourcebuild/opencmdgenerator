import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const GroupaddSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** groupadd takes exactly one positional — the new group's name — same shape as `@cmdgen/useradd`'s `username`. */
  groupname: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — groupadd is a GNU/Linux-specific tool with
   * no Windows-native or PowerShell form; only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type GroupaddSpec = z.infer<typeof GroupaddSpec>;
