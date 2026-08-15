import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { MkdirPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * mkdir's own quoting dispatch, same reasoning as `@cmdgen/cd/render` — its
 * platform axis also gates which flags exist (via `buildArgv`'s `tag`), so
 * it picks its own quote function rather than `@cmdgen/engine`'s
 * `ShellDialect`-keyed one. `windows-cygwin`/`windows-msys`/`windows-wsl`
 * quote exactly like `linux`/`mac` — same real bash, same rules.
 */
function quoteForPlatform(value: string, platform: MkdirPlatform): string {
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
 * UNC directory into that dialect's own bash spelling before quoting.
 */
function pathTextForPlatform(text: string, platform: MkdirPlatform): string {
  switch (platform) {
    case "windows-cmd":
      // cmd.exe's legacy internal-command parser treats an embedded "/" anywhere
      // in an argument as an attempted switch (e.g. "mydir/subdir" gets read as
      // "mydir" + an unrecognized "/s" switch), producing "The syntax of the
      // command is incorrect." — not a quoting problem, a separator problem.
      // Normalize to backslashes before quoting so `md` never sees a "/" at all.
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
 * Role-tagged, quoted tokens. On `windows-powershell`, every "path"-role
 * token except the last gets a trailing "," appended directly onto its own
 * quoted text — `New-Item -Path`'s array parameter binds multiple values as
 * `"dir1", "dir2"`, not space-separated bare words like every other
 * platform. Appending the comma here (rather than joining tokens with ","
 * downstream) means the shared `GeneratedCommandPanel`, which always joins
 * token text with a plain space, produces exactly that syntax for free.
 */
export function renderTokens(argv: Argv, platform: MkdirPlatform): RenderedToken[] {
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
export function renderOneLine(argv: Argv, platform: MkdirPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
