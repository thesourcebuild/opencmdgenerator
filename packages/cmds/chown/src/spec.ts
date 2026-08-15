import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const ChownSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),

  /** The whole OWNER[:GROUP] expression, rendered verbatim — "user", "user:group", ":group", "user:". Empty means "no owner given" (only --reference may supply one instead). */
  owner: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/chmod`'s `shell`.
   * chown has no Windows-native or PowerShell form at all: Windows has no
   * owner:group model to change in the first place (ACLs are a completely
   * different permission system — `icacls`/`Set-Acl` don't map to this).
   */
  shell: ShellDialect.default("posix"),
});
export type ChownSpec = z.infer<typeof ChownSpec>;
