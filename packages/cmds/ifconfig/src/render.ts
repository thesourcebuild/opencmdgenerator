import { quoteCmd, quotePosix, quotePowerShell, type RenderedToken } from "@cmdgen/engine";
import type { IfconfigPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * ifconfig's own quoting dispatch, same reasoning as `@cmdgen/grep/render` —
 * its platform axis also gates which flags exist (via `buildArgv`'s `tag`),
 * so it picks its own quote function rather than `@cmdgen/engine`'s
 * `ShellDialect`-keyed one.
 */
function quoteForPlatform(value: string, platform: IfconfigPlatform): string {
  switch (platform) {
    case "windows-cmd":
      return quoteCmd(value);
    case "windows-powershell":
      return quotePowerShell(value);
    case "linux":
    case "mac":
    // Cygwin/MSYS2/WSL are genuine bash environments running the real
    // `ifconfig` — same POSIX quoting as linux/mac, not cmd/PowerShell's.
    case "windows-cygwin":
    case "windows-msys":
    case "windows-wsl":
      return quotePosix(value);
  }
}

/**
 * Role-tagged, quoted tokens. Every "value"-role token is free-form user
 * data (an interface/adapter name, a netmask, an MTU, or one of the bare
 * `up`/`down`/`netmask`/`mtu` keywords) and gets quoted — same reasoning as
 * `@cmdgen/grep`'s pattern and `@cmdgen/echo`'s value. Flag tokens (like
 * "/all" or "/release") never need it.
 */
export function renderTokens(argv: Argv, platform: IfconfigPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  for (const arg of argv.args) {
    if (arg.role !== "value") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      continue;
    }
    tokens.push({ text: quoteForPlatform(arg.text, platform), role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: IfconfigPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
