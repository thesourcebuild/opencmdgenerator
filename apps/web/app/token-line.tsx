"use client";

import type { RenderedToken } from "@cmdgen/engine";

const TOKEN_CLASS: Record<string, string> = {
  binary: "text-(--color-token-binary) font-semibold",
  flag: "text-(--color-token-flag)",
  value: "text-(--color-token-value)",
  path: "text-(--color-token-path) dark:text-slate-300",
  pattern: "text-(--color-token-pattern)",
  rsh: "text-(--color-token-value)",
  host: "text-(--color-token-path) dark:text-slate-300",
};

/**
 * Colors a row of `RenderedToken`s by role. The one bit of syntax
 * highlighting every command's preview shares, regardless of how each
 * command produces its tokens (rsync via `@cmdgen/engine`'s `renderTokens`,
 * cd via its own platform-aware renderer).
 */
export function TokenLine({ tokens }: { tokens: readonly RenderedToken[] }) {
  return (
    <code>
      {tokens.map((token, i) => (
        <span key={i} className={TOKEN_CLASS[token.role] ?? ""}>
          {i > 0 ? " " : ""}
          {token.text}
        </span>
      ))}
    </code>
  );
}
