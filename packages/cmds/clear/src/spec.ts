import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape as `@cmdgen/mv`'s `MvPlatform` — cmd.exe's `cls` and
 * PowerShell's `Clear-Host` are each their own binary/cmdlet name — plus
 * three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, which invoke the exact same real `clear` binary as
 * `linux`/`mac` (unlike `windows-cmd`'s `cls` or `windows-powershell`'s
 * `Clear-Host`) since Cygwin, MSYS2 and WSL all ship genuine
 * coreutils/ncurses `clear` — see `catalogue/flags.ts`'s `availableOn`
 * array, which lists them alongside `linux`/`mac` for exactly that reason.
 */
export const ClearPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type ClearPlatform = z.infer<typeof ClearPlatform>;

export const ClearSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  platform: ClearPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type ClearSpec = z.infer<typeof ClearSpec>;
