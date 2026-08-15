import { quoteAttached, quoteFor, quotePosix, quotePowerShell, type RenderedToken } from "@cmdgen/engine";
import type { AliasPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

function quoteForPlatform(value: string, platform: AliasPlatform): string {
  switch (platform) {
    case "windows-powershell":
      return quotePowerShell(value);
    case "linux":
    case "mac":
      return quotePosix(value);
    case "windows-cygwin":
      return quoteFor(value, "cygwin");
    case "windows-msys":
      return quoteFor(value, "msys");
    case "windows-wsl":
      return quoteFor(value, "wsl");
  }
}

function quoteAttachedForPlatform(token: string, platform: AliasPlatform): string {
  switch (platform) {
    case "windows-powershell":
      return quoteAttached(token, "powershell");
    case "linux":
    case "mac":
      return quoteAttached(token, "posix");
    case "windows-cygwin":
      return quoteAttached(token, "cygwin");
    case "windows-msys":
      return quoteAttached(token, "msys");
    case "windows-wsl":
      return quoteAttached(token, "wsl");
  }
}

/** Same attached-quoting shape as `@cmdgen/export/render` — see its comment. */
export function renderTokens(argv: Argv, platform: AliasPlatform): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: argv.binary, role: "binary" }];
  for (const arg of argv.args) {
    if (arg.role === "flag") {
      tokens.push({ text: arg.text, role: arg.role, flagId: arg.flagId });
      continue;
    }
    const text = arg.attached ? quoteAttachedForPlatform(arg.text, platform) : quoteForPlatform(arg.text, platform);
    tokens.push({ text, role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, platform: AliasPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
