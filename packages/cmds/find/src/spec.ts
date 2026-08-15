import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const FindSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Search roots. Real find defaults to "." when none are given — modeled directly as the default here, and re-applied by buildArgv if the array is ever emptied. */
  paths: z.array(z.string()).default(["."]),

  /**
   * -exec's command to run on every match, without its own trailing "{} \;"
   * grammar attached — that grammar has no single, generically-renderable
   * flag shape (it's the flag, then N free words, then two more fixed
   * literal tokens), so it lives as its own field with custom rendering in
   * `argv/index.ts`, the same way `@cmdgen/ssh`'s `remoteCommand` lives
   * outside `flags` rather than being forced into the shared FlagKind set.
   */
  exec: z.string().default(""),

  flags: FlagValues.default({}),
  /** Always "posix" — same shape as `@cmdgen/mount`'s `shell`. find has no Windows-native equivalent. */
  shell: ShellDialect.default("posix"),
});
export type FindSpec = z.infer<typeof FindSpec>;
