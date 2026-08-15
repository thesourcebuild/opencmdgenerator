import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { CatPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * cat's own quoting dispatch, same reasoning as `@cmdgen/mkdir/render`'s
 * `quoteForPlatform` — `windows-cygwin`/`windows-msys` quote exactly like
 * `linux`/`mac`: same real bash, same rules.
 */
function quoteForPlatform(value: string, platform: CatPlatform): string {
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
 * inline below); `windows-cygwin`/`windows-msys` instead reuse
 * `@cmdgen/engine`'s shared `toBashPath` to rewrite a Windows drive-letter/
 * UNC file path into that dialect's own bash spelling before quoting.
 */
function pathTextForPlatform(text: string, platform: CatPlatform): string {
  switch (platform) {
    case "windows-cmd":
      // Same "/" -> attempted-switch landmine as `@cmdgen/mkdir/render` — cmd.exe's
      // `type` reads an embedded "/" as a switch attempt, not a path separator.
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

/**
 * Same "comma-join all but the last path token, Windows-PowerShell only"
 * trick as `@cmdgen/mkdir/render` — `windows-cygwin`/`windows-msys` render
 * space-separated files, like `linux`/`mac`, since their real `cat` has no
 * `-Path` array binding to imitate.
 */
export function renderTokens(argv: Argv, platform: CatPlatform): RenderedToken[] {
  const lastPathIndex = argv.args.reduce((last, a, i) => (a.role === "path" ? i : last), -1);

  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  argv.args.forEach((arg, i) => {
    if (arg.role !== "path") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      return;
    }
    const normalized = pathTextForPlatform(arg.text, platform);
    const quoted = quoteForPlatform(normalized, platform);
    const suffix = platform === "windows-powershell" && i !== lastPathIndex ? "," : "";
    tokens.push({ text: `${quoted}${suffix}`, role: arg.role, flagId: arg.flagId });
  });
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: CatPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
