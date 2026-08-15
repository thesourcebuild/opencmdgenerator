import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const SuSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * su's positional is OPTIONAL, unlike useradd's mandatory `username`: a bare
   * `su` with no username switches to root — a valid, common case, not an
   * error. An empty string means "switch to root."
   */
  username: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — su is a GNU/Linux-specific tool with no
   * Windows-native or PowerShell form; only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SuSpec = z.infer<typeof SuSpec>;
