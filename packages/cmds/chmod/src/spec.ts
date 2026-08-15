import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** Which editor the user last used to build `mode` — a UI concern only, never affects argv. */
export const ModeAuthoring = z.enum(["octal", "symbolic"]);
export type ModeAuthoring = z.infer<typeof ModeAuthoring>;

export const ChmodSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),

  modeAuthoring: ModeAuthoring.default("octal"),
  /** The actual mode text rendered verbatim — "644", "a+x", "u=rwx,go=rx", "+110", ... Empty means "no mode given" (only --reference may supply one instead). */
  mode: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — chmod has no Windows-native or PowerShell
   * form, it's only ever reached from within a POSIX-capable shell (bash,
   * WSL, Git Bash, Cygwin). Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type ChmodSpec = z.infer<typeof ChmodSpec>;
