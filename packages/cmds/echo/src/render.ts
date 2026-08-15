import { quoteCmd, quotePosix, quotePowerShell, type RenderedToken } from "@cmdgen/engine";
import type { EchoPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

function quoteForPlatform(value: string, platform: EchoPlatform): string {
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
 * Role-tagged, quoted tokens. Unlike `@cmdgen/cd`/`@cmdgen/mkdir`/`@cmdgen/mv`
 * (whose "value"-role tokens are always fixed, safe literals like "Directory"
 * or a signal name from a small known set), echo's "value"-role token IS the
 * free-form user message, so it must be quoted like any other user data —
 * only the fixed "flag" tokens (-n, -e, -NoNewline, ...) are left bare.
 */
export function renderTokens(argv: Argv, platform: EchoPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  for (const arg of argv.args) {
    const text = arg.role === "flag" ? arg.text : quoteForPlatform(arg.text, platform);
    tokens.push({ text, role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: EchoPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
