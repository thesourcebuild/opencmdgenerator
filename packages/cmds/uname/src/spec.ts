import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const UnameSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — same shape as `@cmdgen/chmod`'s `shell`. Windows has no
   * uname at all, native or otherwise; `systeminfo`, `ver`, and PowerShell's
   * `$PSVersionTable`/`Get-ComputerInfo` cover similar ground but with
   * different output shapes entirely, not the same command elsewhere.
   */
  shell: ShellDialect.default("posix"),
});
export type UnameSpec = z.infer<typeof UnameSpec>;
