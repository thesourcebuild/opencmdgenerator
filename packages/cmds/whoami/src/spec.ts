import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Unlike every other 3/4/5-way platform type this session (`@cmdgen/cd`,
 * `@cmdgen/mv`, `@cmdgen/mkdir`, ...), `whoami` is the SAME binary
 * everywhere — Windows has shipped its own real `whoami.exe` since
 * Vista/Server 2003 R2, invocable identically from cmd.exe or PowerShell,
 * the same way `ssh`/`scp`/`tar` are plain argv .exe files. `windows-cygwin`,
 * `windows-msys`, and `windows-wsl` are no exception: a Cygwin, MSYS2, or WSL
 * bash session on Windows still runs that same literal `whoami` binary
 * (Cygwin/MSYS2/WSL don't ship their own coreutils whoami the way they do
 * for `mkdir` et al.) — but
 * a user typing `whoami` in that kind of bash session expects the bare
 * POSIX-style invocation, not the Windows-native `/ALL`/`/GROUPS`/`/PRIV`
 * flags they'd never think to reach for. So `windows-cygwin`/`windows-msys`/`windows-wsl`
 * render with NO extra flags, same as the plain `posix` value — see
 * `windowsFlagTag` below, which maps all three of them to `"posix"` rather
 * than `"windows"`.
 *
 * They stay distinct enum values (not folded into `posix`) purely because
 * `platform` also drives the generic render pipeline's `ShellDialect` for
 * quoting/path-conversion purposes — moot in practice for `whoami` itself
 * (it takes no arguments to quote or paths to convert), but needed so the
 * type lines up with every other command's `ShellDialect` mapping.
 */
export const WhoamiPlatform = z.enum([
  "posix",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type WhoamiPlatform = z.infer<typeof WhoamiPlatform>;

export const WhoamiSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  platform: WhoamiPlatform.default("posix"),

  flags: FlagValues.default({}),
});
export type WhoamiSpec = z.infer<typeof WhoamiSpec>;
