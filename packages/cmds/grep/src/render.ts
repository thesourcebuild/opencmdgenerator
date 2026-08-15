import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { GrepPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * `windows-cygwin`/`windows-msys`/`windows-wsl` quote exactly like
 * `linux`/`mac` — same real bash, same rules.
 */
function quoteForPlatform(value: string, platform: GrepPlatform): string {
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
 * Rewrites a Windows drive-letter/UNC file-path argument into the dialect's
 * own bash spelling before quoting — same idea as `@cmdgen/cd/render`'s
 * `pathTextForPlatform`. Only ever called on role "path" arguments (actual
 * file paths); the search pattern (role "pattern") never goes through this,
 * since it's free-form user data, not a path.
 */
function pathTextForPlatform(text: string, platform: GrepPlatform): string {
  switch (platform) {
    case "windows-cygwin":
      return toBashPath(text, "cygwin");
    case "windows-msys":
      return toBashPath(text, "msys");
    case "windows-wsl":
      return toBashPath(text, "wsl");
    case "linux":
    case "mac":
    case "windows-cmd":
    case "windows-powershell":
      return text;
  }
}

/**
 * Role-tagged, quoted tokens. Both "pattern" and "path" roles are quoted
 * (unlike `@cmdgen/mkdir`'s tokens, grep's pattern is free-form user data,
 * same reasoning as `@cmdgen/echo`'s "value"-role text). Only files
 * (role "path") get the Windows comma-join treatment — the pattern never
 * needs it, there's only ever one of it. Only files also get the Windows
 * drive-letter/UNC rewrite for Cygwin/MSYS2/WSL — the pattern is left as-is.
 */
export function renderTokens(argv: Argv, platform: GrepPlatform): RenderedToken[] {
  const lastPathIndex = argv.args.reduce((last, a, i) => (a.role === "path" ? i : last), -1);

  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  argv.args.forEach((arg, i) => {
    if (arg.role !== "path" && arg.role !== "pattern") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      return;
    }
    const normalized = arg.role === "path" ? pathTextForPlatform(arg.text, platform) : arg.text;
    const quoted = quoteForPlatform(normalized, platform);
    const suffix = arg.role === "path" && platform === "windows-powershell" && i !== lastPathIndex ? "," : "";
    tokens.push({ text: `${quoted}${suffix}`, role: arg.role, flagId: arg.flagId });
  });
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: GrepPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
