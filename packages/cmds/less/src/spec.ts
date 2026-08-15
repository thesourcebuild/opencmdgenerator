import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const LessSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/chmod`'s `shell`.
   * less has no native Windows install at all (it ships with no Windows
   * version of the OS or PowerShell); `more` exists on both cmd.exe and
   * PowerShell but is too limited a tool (no search, no backward scrolling)
   * to count as "the same command on another platform" the way
   * Get-Content genuinely is for head/tail.
   */
  shell: ShellDialect.default("posix"),
});
export type LessSpec = z.infer<typeof LessSpec>;
