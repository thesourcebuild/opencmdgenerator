import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const PatchSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The patch file, given as the final positional operand. Empty means "read from stdin" — real patch's own default. */
  patchFile: z.string().default(""),
  /** The file to apply the patch to. Empty lets patch guess from the diff headers, same as real usage. */
  targetFile: z.string().default(""),

  flags: FlagValues.default({}),
  /** Always "posix" — same shape as `@cmdgen/mount`'s `shell`. patch has no Windows-native equivalent. */
  shell: ShellDialect.default("posix"),
});
export type PatchSpec = z.infer<typeof PatchSpec>;
