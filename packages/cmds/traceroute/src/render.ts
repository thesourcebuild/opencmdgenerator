import { quoteCmd, quotePosix, quotePowerShell, type RenderedToken } from "@cmdgen/engine";
import type { TraceroutePlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * windows-cygwin/windows-msys/windows-wsl quote exactly like linux/mac — same
 * real bash, same rules. Unlike `@cmdgen/mkdir`'s render.ts, there's no accompanying
 * `toBashPath` conversion step here: traceroute's only argument is `host`
 * (role "host"), a hostname, not a filesystem path — nothing about it needs
 * Windows drive-letter/UNC rewriting, so quoting alone is enough.
 */
function quoteForPlatform(value: string, platform: TraceroutePlatform): string {
  switch (platform) {
    case "windows-cmd":
      return quoteCmd(value);
    case "windows-powershell":
      return quotePowerShell(value);
    case "linux":
    case "mac":
    case "windows-cygwin":
    case "windows-msys":
    case "windows-wsl":
      return quotePosix(value);
  }
}

/**
 * Role-tagged, quoted tokens. Only the host (role "host") is free-form user
 * data that needs quoting — same reasoning as grep's pattern/path roles.
 */
export function renderTokens(argv: Argv, platform: TraceroutePlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  for (const arg of argv.args) {
    if (arg.role !== "host") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      continue;
    }
    tokens.push({ text: quoteForPlatform(arg.text, platform), role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: TraceroutePlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
