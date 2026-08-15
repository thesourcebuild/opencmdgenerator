import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * Same shape and rationale as `@cmdgen/grep`'s `GrepPlatform` — Windows has
 * a real, differently-named equivalent (`ipconfig.exe`) with its own flag
 * set, so this is a 4-way platform axis rather than the simpler 2-way
 * `posix`/`windows` split `@cmdgen/whoami` uses. Unlike grep's findstr vs.
 * Select-String split, though, `ipconfig.exe` behaves identically whether
 * invoked from cmd.exe or PowerShell — same real-.exe-everywhere reasoning
 * as whoami — so `platformFlagTag` in `pure.ts` collapses this type's 4
 * values down to the 2-value axis flag availability actually depends on.
 *
 * Plus three more Windows sub-choices, `windows-cygwin`/`windows-msys`/
 * `windows-wsl`, which invoke the exact same real `ifconfig` binary and the
 * exact same POSIX flags/bare-keyword operands as `linux`/`mac` (unlike
 * `windows-cmd`/`windows-powershell`, which both invoke `ipconfig`) — Cygwin,
 * MSYS2 and WSL are genuine bash environments where the real `ifconfig`
 * (available there via net-tools packages) is what a user would expect, not
 * the native Windows `ipconfig`. `platformFlagTag` maps all three of them to
 * `"posix"` right alongside `linux`/`mac`, same shape as `@cmdgen/whoami`'s
 * `windowsFlagTag`. They stay distinct enum values (not folded into
 * `linux`/`mac`) purely so `platform` still lines up with every other
 * command's `ShellDialect` mapping for quoting purposes.
 */
export const IfconfigPlatform = z.enum([
  "linux",
  "mac",
  "windows-cmd",
  "windows-powershell",
  "windows-cygwin",
  "windows-msys",
  "windows-wsl",
]);
export type IfconfigPlatform = z.infer<typeof IfconfigPlatform>;

export const IfconfigSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Optional — a bare `ifconfig`/`ipconfig` with no interface name lists every interface/adapter. */
  interfaceName: z.string().default(""),

  /**
   * ifconfig's up/down/netmask/mtu are bare keyword (and keyword+value)
   * tokens with no leading dash — nothing like an ordinary catalogue flag —
   * so, same shape as `@cmdgen/dd`'s `inputFile`/`outputFile`/etc, they live
   * here as plain spec-level fields and are pushed manually as bare `Arg`s
   * in `argv/index.ts` rather than going through the catalogue machinery at
   * all. Windows' ipconfig has no equivalent for any of these; they're
   * simply ignored when the target platform is Windows.
   */
  state: z.enum(["", "up", "down"]).default(""),
  netmask: z.string().default(""),
  mtu: z.string().default(""),

  platform: IfconfigPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type IfconfigSpec = z.infer<typeof IfconfigSpec>;
