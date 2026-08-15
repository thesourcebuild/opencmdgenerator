import { renderTokens as renderTokensGeneric, type RenderedToken, type ShellDialect } from "@cmdgen/engine";
import type { ClearPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * Nothing here is ever quoted (no user text, no paths — just a bare binary
 * name and one flag), so this maps straight to the generic engine renderer
 * rather than writing bespoke quoting logic like `@cmdgen/export`'s.
 */
function toShellDialect(platform: ClearPlatform): ShellDialect {
  if (platform === "windows-cmd") return "cmd";
  if (platform === "windows-powershell") return "powershell";
  if (platform === "windows-cygwin") return "cygwin";
  if (platform === "windows-msys") return "msys";
  if (platform === "windows-wsl") return "wsl";
  return "posix";
}

export function renderTokens(argv: Argv, platform: ClearPlatform): RenderedToken[] {
  return renderTokensGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderOneLine(argv: Argv, platform: ClearPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
