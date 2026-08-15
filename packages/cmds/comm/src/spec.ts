import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const CommSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** comm takes exactly two operands (both must be sorted) — same shape as `@cmdgen/cmp`'s file1/file2. */
  file1: z.string().default(""),
  file2: z.string().default(""),

  flags: FlagValues.default({}),
  /** Always "posix" — comm has no Windows-native or PowerShell form at all, same shape as `@cmdgen/cmp`'s `shell`. */
  shell: ShellDialect.default("posix"),
});
export type CommSpec = z.infer<typeof CommSpec>;
