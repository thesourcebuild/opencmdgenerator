import {
  continuationFor,
  layoutMultiLine,
  renderTokens as renderTokensGeneric,
  type Argv,
  type RenderedToken,
  type RenderOptions,
} from "@cmdgen/engine";

export type { RenderedToken };

function preferBackslashFindExecTerminator(token: RenderedToken): RenderedToken {
  if (token.flagId === "findExec" && token.text === "'{}'") return { ...token, text: "{}" };
  if (token.flagId === "findExec" && token.text === "';'") return { ...token, text: "\\;" };
  return token;
}

export function renderTokens(argv: Argv, options: RenderOptions): RenderedToken[] {
  return renderTokensGeneric(argv, options).map(preferBackslashFindExecTerminator);
}

export function renderOneLine(argv: Argv, options: RenderOptions): string {
  return renderTokens(argv, options)
    .map((token) => token.text)
    .join(" ");
}

export function renderMultiLine(argv: Argv, options: RenderOptions): string {
  return layoutMultiLine(renderTokens(argv, options), continuationFor(options.shell));
}
