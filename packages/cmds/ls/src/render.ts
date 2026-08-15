import {
  renderMultiLine as renderMultiLineGeneric,
  renderOneLine as renderOneLineGeneric,
  renderTokens as renderTokensGeneric,
  type RenderedToken,
} from "@cmdgen/engine";
import type { LsPlatform } from "./spec";
import { toShellDialect } from "./pure";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * `platform` is a superset of `@cmdgen/engine`'s `ShellDialect` (it also
 * distinguishes `linux`/`mac`, which render identically), so it's mapped
 * down via `toShellDialect` before reusing the generic render pipeline (no
 * cd-style custom dispatch needed — ls has no tilde-shorthand carve-out,
 * matching ssh's precedent of quoting `~` paths like any other value).
 */
export function renderTokens(argv: Argv, platform: LsPlatform): RenderedToken[] {
  return renderTokensGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderOneLine(argv: Argv, platform: LsPlatform): string {
  return renderOneLineGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderMultiLine(argv: Argv, platform: LsPlatform): string {
  return renderMultiLineGeneric(argv, { shell: toShellDialect(platform) });
}
