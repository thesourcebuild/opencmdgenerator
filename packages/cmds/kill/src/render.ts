import {
  renderMultiLine as renderMultiLineGeneric,
  renderOneLine as renderOneLineGeneric,
  renderTokens as renderTokensGeneric,
  type RenderedToken,
} from "@cmdgen/engine";
import type { KillPlatform } from "./spec";
import { toShellDialect } from "./pure";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * `platform` is a superset of `@cmdgen/engine`'s `ShellDialect` (it also
 * distinguishes `linux`/`mac`, which render identically), so it's mapped down
 * via `toShellDialect` before reusing the generic render pipeline — see the
 * identical note in @cmdgen/ls/render.ts.
 */
export function renderTokens(argv: Argv, platform: KillPlatform): RenderedToken[] {
  return renderTokensGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderOneLine(argv: Argv, platform: KillPlatform): string {
  return renderOneLineGeneric(argv, { shell: toShellDialect(platform) });
}

export function renderMultiLine(argv: Argv, platform: KillPlatform): string {
  return renderMultiLineGeneric(argv, { shell: toShellDialect(platform) });
}
