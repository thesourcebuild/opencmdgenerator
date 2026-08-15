import { renderTokens as renderTokensGeneric, type RenderedToken, type ShellDialect } from "@cmdgen/engine";
import type { WhoamiPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/** Nothing here is ever quoted (no user text, no paths — just flags), same reasoning as `@cmdgen/clear/render`. */
function toShellDialect(platform: WhoamiPlatform): ShellDialect {
  if (platform === "windows-cmd") return "cmd";
  if (platform === "windows-powershell") return "powershell";
  if (platform === "windows-cygwin") return "cygwin";
  if (platform === "windows-msys") return "msys";
  if (platform === "windows-wsl") return "wsl";
  return "posix";
}

export function renderTokens(argv: Argv, platform: WhoamiPlatform): RenderedToken[] {
  return renderTokensGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderOneLine(argv: Argv, platform: WhoamiPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
