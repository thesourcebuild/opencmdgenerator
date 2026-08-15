import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { LnPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * ln's own quoting dispatch, same reasoning as `@cmdgen/cd/render` and
 * `@cmdgen/mkdir/render` — its platform axis also gates which flags exist
 * (via `buildArgv`'s `tag`), so it picks its own quote function rather than
 * `@cmdgen/engine`'s `ShellDialect`-keyed one. `windows-cygwin`/
 * `windows-msys`/`windows-wsl` quote exactly like `linux`/`mac` — same real
 * bash, same rules.
 */
function quoteForPlatform(value: string, platform: LnPlatform): string {
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
 * `windows-cmd` needs its own backslash normalization (see the comment
 * inline below); `windows-cygwin`/`windows-msys`/`windows-wsl` instead reuse
 * `@cmdgen/engine`'s shared `toBashPath` to rewrite a Windows drive-letter/
 * UNC target or link name into that dialect's own bash spelling before
 * quoting — same treatment as `@cmdgen/mkdir/render`'s `pathTextForPlatform`.
 */
function pathTextForPlatform(text: string, platform: LnPlatform): string {
  switch (platform) {
    case "windows-cmd":
      // cmd.exe's legacy internal-command parser treats an embedded "/" anywhere
      // in an argument as an attempted switch, not a path separator — `mklink`
      // reads it as a switch attempt. Normalize to backslashes before quoting.
      return text.replace(/\//g, "\\");
    case "windows-cygwin":
      return toBashPath(text, "cygwin");
    case "windows-msys":
      return toBashPath(text, "msys");
    case "windows-wsl":
      return toBashPath(text, "wsl");
    case "linux":
    case "mac":
    case "windows-powershell":
      return text;
  }
}

/** Role-tagged, quoted tokens for the shared command preview. */
export function renderTokens(argv: Argv, platform: LnPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  for (const arg of argv.args) {
    if (arg.role !== "path") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      continue;
    }
    const normalized = pathTextForPlatform(arg.text, platform);
    const text = quoteForPlatform(normalized, platform);
    tokens.push({ text, role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: LnPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
