import { quoteAttached, quoteCmd, quoteFor, quotePosix, quotePowerShell, type RenderedToken } from "@cmdgen/engine";
import type { ExportPlatform } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * export's own quoting dispatch, same reasoning as `@cmdgen/mkdir/render` —
 * its platform axis also gates which flags exist (via `buildArgv`'s `tag`),
 * so it picks its own quote function rather than `@cmdgen/engine`'s
 * `ShellDialect`-keyed one directly. `windows-cygwin`/`windows-msys`/
 * `windows-wsl` quote exactly like `linux`/`mac` — same real bash, same
 * rules — so they're passed straight through to the engine's
 * `quoteFor`/`quoteAttached` as `"cygwin"`/`"msys"`/`"wsl"`, which already
 * know to treat those identically to `"posix"`.
 */
function quoteForPlatform(value: string, platform: ExportPlatform): string {
  switch (platform) {
    case "windows-cmd":
      return quoteCmd(value);
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

function quoteAttachedForPlatform(token: string, platform: ExportPlatform): string {
  switch (platform) {
    case "windows-cmd":
      return quoteAttached(token, "cmd");
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

/**
 * Role-tagged, quoted tokens. `arg.attached` tokens (the composed
 * `NAME=VALUE` positional — see `argv/index.ts`) are split-and-quoted the
 * same way the generic engine already quotes `--flag=value`: only the part
 * after the first `=` gets quoted, the name stays bare.
 */
export function renderTokens(argv: Argv, platform: ExportPlatform): RenderedToken[] {
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
export function renderOneLine(argv: Argv, platform: ExportPlatform): string {
  return renderTokens(argv, platform)
    .map((t) => t.text)
    .join(" ");
}
