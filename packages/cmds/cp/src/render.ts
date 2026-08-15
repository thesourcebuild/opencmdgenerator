import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { CpPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * cp's own quoting dispatch, same reasoning as `@cmdgen/mkdir/render` — its
 * platform axis also gates which flags exist (via `buildArgv`'s `tag`), so
 * it picks its own quote function rather than `@cmdgen/engine`'s
 * `ShellDialect`-keyed one. `windows-cygwin`/`windows-msys`/`windows-wsl` quote exactly
 * like `linux`/`mac` — same real bash, same rules.
 */
function quoteForPlatform(value: string, platform: CpPlatform): string {
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
 * quoting.
 */
function pathTextForPlatform(text: string, platform: CpPlatform): string {
  switch (platform) {
    case "windows-cmd":
      // cmd.exe's legacy internal-command parser treats an embedded "/" anywhere
      // in an argument as an attempted switch — normalize to backslashes before
      // quoting so `copy` never sees a "/" at all.
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
 * Only `Copy-Item -Path` gets the comma-array treatment — unlike
 * `@cmdgen/mv`'s `render.ts`, cmd.exe is deliberately excluded here.
 * `copy`'s multi-source syntax uses `+` to concatenate files into one
 * destination, a completely different operation from "copy each source
 * into a directory"; rendering commas there would look plausible while
 * quietly meaning something else, so multiple sources on cmd.exe render
 * space-separated instead (still wrong for `copy` specifically, but not
 * disguised as right) and are flagged by lint rule CP004.
 */
const commaJoins = (platform: CpPlatform) => platform === "windows-powershell";

export function renderTokens(argv: Argv, platform: CpPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  argv.args.forEach((arg, i) => {
    if (arg.role !== "path" && arg.role !== "host") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      return;
    }
    const normalized = pathTextForPlatform(arg.text, platform);
    const quoted = quoteForPlatform(normalized, platform);
    const next = argv.args[i + 1];
    const suffix = arg.role === "path" && commaJoins(platform) && next?.role === "path" ? "," : "";
    tokens.push({ text: `${quoted}${suffix}`, role: arg.role, flagId: arg.flagId });
  });
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: CpPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
