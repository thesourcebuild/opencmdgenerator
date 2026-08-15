import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/grep`'s `GrepPlatform` — Windows'
 * `tracert.exe` is a real, genuinely different tool under a different name
 * (its own binary, its own flag letters), yet it behaves identically whether
 * invoked from cmd.exe or PowerShell (same "real .exe everywhere" reasoning
 * as `@cmdgen/whoami`, layered onto this enum instead of collapsed into a
 * smaller one — the platform axis still needs distinct cmd/PowerShell values
 * because quoting differs between them even though the flags don't) — plus
 * three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, which invoke the exact same real `traceroute` binary and
 * POSIX flag set as `linux`/`mac` (unlike `windows-cmd`/`windows-powershell`,
 * which both invoke `tracert`), since Cygwin, MSYS2 and WSL are genuine bash
 * environments where a user would expect the real `traceroute` (available
 * there via appropriate packages), not the native Windows `tracert` — see
 * `pure.ts`'s `platformFlagTag`, which maps all three of them to `"posix"`
 * rather than `"windows"`.
 */
export const TraceroutePlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type TraceroutePlatform = z.infer<typeof TraceroutePlatform>;

export const TracerouteSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * The single required positional. Unlike `@cmdgen/ifconfig`'s bare-listing
   * mode, neither traceroute nor tracert has a form that runs without a
   * target — this is never optional.
   */
  host: z.string().default(""),
  platform: TraceroutePlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type TracerouteSpec = z.infer<typeof TracerouteSpec>;
