import {
  renderMultiLine as renderMultiLineGeneric,
  renderOneLine as renderOneLineGeneric,
  renderTokens as renderTokensGeneric,
  type RenderedToken,
} from "@cmdgen/engine";
import type { TailPlatform } from "./spec";
import { toShellDialect } from "./pure";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * `platform` is a superset of `@cmdgen/engine`'s `ShellDialect` (it also
 * distinguishes `linux`/`mac`, which render identically), so it's mapped
 * down via `toShellDialect` before reusing the generic render pipeline — same
 * reuse as `@cmdgen/ls/render`.
 */
export function renderTokens(argv: Argv, platform: TailPlatform): RenderedToken[] {
  return renderTokensGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderOneLine(argv: Argv, platform: TailPlatform): string {
  return renderOneLineGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderMultiLine(argv: Argv, platform: TailPlatform): string {
  return renderMultiLineGeneric(argv, { shell: toShellDialect(platform) });
}
