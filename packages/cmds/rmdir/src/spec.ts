import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** rmdir's structure mirrors `@cmdgen/mkdir` as its inverse, but single-platform — rmdir has no distinct cmd.exe/PowerShell syntax worth modeling here. */
export const RmdirSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  paths: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /** Always "posix" — same shape as `@cmdgen/mount`'s `shell`. */
  shell: ShellDialect.default("posix"),
});
export type RmdirSpec = z.infer<typeof RmdirSpec>;
