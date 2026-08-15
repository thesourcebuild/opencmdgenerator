import { quoteCmd, quotePosix, quotePowerShell, toBashPath, type RenderedToken } from "@cmdgen/engine";
import type { CdPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * `~`, `~/rest`, `~user` or `~user/rest` — every shape POSIX (and PowerShell's
 * filesystem provider) expand as a home-directory shorthand. Deliberately
 * excludes anything after the first `/` from the check — only the leading
 * `~word` part is expansion syntax, the rest is an ordinary path.
 */
const TILDE_SHORTHAND = /^~[^/]*(\/.*)?$/;

/**
 * cd's own quoting dispatch. Not `@cmdgen/engine`'s `quoteFor`/`renderTokens` —
 * those are keyed on `ShellDialect` (posix/powershell only), which is rsync's
 * rendering concept. cd's platform axis is richer (it also gates which flags
 * exist at all, via `buildArgv`'s `tag`), so it picks its own quote function.
 * `windows-cygwin`/`windows-msys` quote exactly like `linux`/`mac` — same
 * real bash, same rules.
 */
function quoteForPlatform(value: string, platform: CdPlatform): string {
  // Tilde shorthand is the one place this app deliberately emits shell-
  // expansion syntax on purpose (the "Home directory" and "Another user's
  // home" presets on POSIX, PowerShell, Cygwin, MSYS2 and WSL — cmd.exe has no
  // equivalent at all). Quoting it the way an ordinary value would be quoted
  // defeats the expansion entirely — single-quoted strings are literal in
  // every one of those shells — so this shape is left bare rather than run
  // through the generic, safety-first quoting rules that (rightly) protect
  // every other value. Unlike rsync's paths, where an incidental leading `~`
  // is far more likely to be an accidental filename than an intentional
  // shortcut, cd's whole domain is directory shortcuts, so preserving the
  // expansion is the correct default here, not just for these two specific
  // presets.
  if (platform !== "windows-cmd" && TILDE_SHORTHAND.test(value)) return value;

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
 * UNC path into that dialect's own bash spelling before quoting. Applied
 * before the tilde check too — a tilde-shorthand value has no drive letter
 * to rewrite, so `toBashPath` leaves it untouched either way.
 */
function pathTextForPlatform(text: string, platform: CdPlatform): string {
  switch (platform) {
    case "windows-cmd":
      // Same "/" -> attempted-switch landmine as `@cmdgen/mkdir/render` — cmd.exe's
      // `cd` reads an embedded "/" as a switch attempt, not a path separator.
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
export function renderTokens(argv: Argv, platform: CdPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  for (const arg of argv.args) {
    // Gated on role "path" so a flag token (e.g. cmd.exe's "/d") is untouched.
    const normalized = arg.role === "path" ? pathTextForPlatform(arg.text, platform) : arg.text;
    tokens.push({ text: quoteForPlatform(normalized, platform), role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. cd's output is always short enough that no multi-line form is needed. */
export function renderOneLine(argv: Argv, platform: CdPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
