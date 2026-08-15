import {
  continuationFor,
  renderMultiLine as renderMultiLineGeneric,
  renderOneLine as renderOneLineGeneric,
  renderTokens as renderTokensGeneric,
  type RenderOptions,
  type RenderedToken,
} from "@cmdgen/engine";
import type { Argv } from "./argv";

export type { RenderOptions, RenderedToken };
export { continuationFor };

/**
 * tar needs no bespoke quoting dispatch of its own (unlike cd, which changes
 * *binary semantics* per platform). It is a real executable, invoked with the
 * same argv from bash, cmd.exe and PowerShell alike — so the only thing the
 * shell affects is quoting, which is exactly what the engine's `ShellDialect`
 * pipeline already handles. The implementation axis (`variant`) is orthogonal
 * and is applied earlier, in `buildArgv`'s `tag`.
 */
export function renderTokens(argv: Argv, options: RenderOptions): RenderedToken[] {
  return renderTokensGeneric(argv, options);
}

export function renderOneLine(argv: Argv, options: RenderOptions): string {
  return renderOneLineGeneric(argv, options);
}

export function renderMultiLine(argv: Argv, options: RenderOptions): string {
  return renderMultiLineGeneric(argv, options);
}
