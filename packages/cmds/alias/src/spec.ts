import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * 6-way: `linux`/`mac`/`windows-powershell` plus three more Windows
 * sub-choices, `windows-cygwin`/`windows-msys`/`windows-wsl`, which invoke
 * the exact same real POSIX `alias NAME=VALUE` syntax (no spaces around
 * `=`) as `linux`/`mac`'s bash, since Cygwin, MSYS2, and WSL all ship
 * genuine bash — unlike PowerShell's `Set-Alias` cmdlet syntax.
 *
 * Still deliberately no `windows-cmd`, though: cmd.exe's `doskey` really
 * exists, but its macros are process-local to the current console and gone
 * the moment that window closes — running the generated command in a fresh
 * cmd.exe session does nothing durable, unlike bash's `alias` (persists via
 * shell startup files) or PowerShell's `Set-Alias` (persists via a profile
 * script). That gap is unrelated to and unaffected by Cygwin/MSYS2/WSL being
 * genuine bash environments, so it's real enough that this app still
 * doesn't offer cmd.exe as a target for `alias` at all.
 */
export const AliasPlatform = z.enum([
  "linux",
  "mac",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type AliasPlatform = z.infer<typeof AliasPlatform>;

export const AliasSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  aliasName: z.string().default(""),
  /** The command the alias expands to. Empty means "show this one alias" (POSIX only). */
  command: z.string().default(""),
  platform: AliasPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type AliasSpec = z.infer<typeof AliasSpec>;
