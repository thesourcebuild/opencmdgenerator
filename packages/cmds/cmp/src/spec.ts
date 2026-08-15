import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const CmpSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** cmp takes exactly two operands, never an arbitrary list — same shape as `@cmdgen/diff`'s file1/file2. */
  file1: z.string().default(""),
  file2: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/chmod`'s `shell`.
   * cmd.exe's `fc /B` does byte-for-byte binary comparison — the closest
   * Windows analog — but it's already `@cmdgen/diff`'s own `binaryCmd` flag
   * on the SAME binary `fc` diff itself models; giving cmp a second,
   * overlapping "fc but different default flags" builder would be more
   * confusing than useful for a command this rarely reached for directly.
   */
  shell: ShellDialect.default("posix"),
});
export type CmpSpec = z.infer<typeof CmpSpec>;
