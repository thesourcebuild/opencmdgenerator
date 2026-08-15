import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const LocateSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The one search pattern — a shell glob by default, or a regular expression when -r/--regexp is on. */
  pattern: z.string().default(""),

  flags: FlagValues.default({}),
  /** Always "posix" — same shape as `@cmdgen/mount`'s `shell`. locate has no Windows-native equivalent. */
  shell: ShellDialect.default("posix"),
});
export type LocateSpec = z.infer<typeof LocateSpec>;
