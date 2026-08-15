import { quoteAttached, quotePosix, type RenderedToken } from "@cmdgen/engine";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * dd-specific renderer, needed because every dd operand is a manually-built
 * `attached: true` `Arg` (see `argv/index.ts`) rather than an ordinary
 * catalogue flag — the generic engine's `renderTokens`/`renderOneLine` still
 * quote `attached` tokens correctly via `quoteAttached`, but they take a
 * `RenderOptions` with a `ShellDialect` for commands that render differently
 * per shell. dd only ever targets POSIX (see `spec.ts`'s `shell` field), so
 * that dispatch is collapsed here to a single hardcoded `"posix"` branch —
 * much simpler than `@cmdgen/export`'s three-way platform switch, which this
 * mirrors in shape (a small command-owned `render.ts`, re-exported by name
 * from `index.ts` instead of the generic engine's).
 */
export function renderTokens(argv: Argv): RenderedToken[] {
  const tokens: RenderedToken[] = [{ text: quotePosix(argv.binary), role: "binary" }];
  for (const arg of argv.args) {
    const text = arg.attached ? quoteAttached(arg.text, "posix") : quotePosix(arg.text);
    tokens.push({ text, role: arg.role, flagId: arg.flagId });
  }
  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv): string {
  return renderTokens(argv)
    .map((t) => t.text)
    .join(" ");
}
