import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { MvPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * mv's own quoting dispatch, same reasoning as `@cmdgen/mkdir/render` —
 * `windows-cygwin`/`windows-msys`/`windows-wsl` quote exactly like
 * `linux`/`mac`: same real bash, same rules.
 */
function quoteForPlatform(value: string, platform: MvPlatform): string {
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
 * UNC source or destination into that dialect's own bash spelling before
 * quoting. Applies to both "path"-role sources and the "host"-role
 * destination — both are genuine filesystem paths under real bash.
 */
function pathTextForPlatform(text: string, platform: MvPlatform): string {
  switch (platform) {
    case "windows-cmd":
      // Same "/" -> attempted-switch landmine as `@cmdgen/mkdir/render` — cmd.exe's
      // `move` reads an embedded "/" as a switch attempt, not a path separator.
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
 * Only cmd.exe's `move` and PowerShell's `Move-Item -Path` comma-join
 * multiple sources — real Cygwin/MSYS2 `mv` is genuine bash + GNU coreutils
 * and takes plain space-separated positional arguments, same as `linux`/
 * `mac`. Deliberately excludes `windows-cygwin`/`windows-msys` even though
 * they're "Windows" sub-choices in the UI.
 */
const isWindows = (platform: MvPlatform) => platform === "windows-cmd" || platform === "windows-powershell";

/**
 * Role-tagged, quoted tokens. On Windows (cmd.exe/PowerShell only — see
 * `isWindows`), a trailing "," is appended to a source directly onto its own
 * quoted text whenever the NEXT arg is also a source (role "path") — both
 * `move`'s comma-separated `filename1,...` and `Move-Item -Path`'s
 * comma-separated array bind multiple sources this way. The destination
 * (role "host") never gets one, since it's never followed by another
 * source. Cygwin/MSYS2/WSL render space-separated instead, like linux/mac.
 */
export function renderTokens(argv: Argv, platform: MvPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  argv.args.forEach((arg, i) => {
    if (arg.role !== "path" && arg.role !== "host") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      return;
    }
    const normalized = pathTextForPlatform(arg.text, platform);
    const quoted = quoteForPlatform(normalized, platform);
    const next = argv.args[i + 1];
    const suffix = arg.role === "path" && isWindows(platform) && next?.role === "path" ? "," : "";
    tokens.push({ text: `${quoted}${suffix}`, role: arg.role, flagId: arg.flagId });
  });
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: MvPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
