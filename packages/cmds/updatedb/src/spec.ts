import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Near-bare — updatedb takes no operands at all, only flags. Same shape as
 * `@cmdgen/clear`'s spec minus the platform axis (updatedb is Linux-only,
 * same reasoning as `@cmdgen/mount`'s single "posix" shell).
 */
export const UpdatedbSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  flags: FlagValues.default({}),
  shell: ShellDialect.default("posix"),
});
export type UpdatedbSpec = z.infer<typeof UpdatedbSpec>;
