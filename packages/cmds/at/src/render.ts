import {
  continuationFor,
  layoutMultiLine,
  quotePosix,
  renderOneLine as renderOneLineGeneric,
  renderTokens as renderTokensGeneric,
  type RenderedToken,
} from "@cmdgen/engine";
import type { AtSpec } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * at's own render.ts, needed (per the root CLAUDE.md's guidance) because
 * this command's most useful output genuinely isn't a single-binary Argv.
 *
 * Real `at TIME` is interactive: it drops you into a prompt where you then
 * type the job body and press Ctrl-D. The standard, well-known way to make
 * that a single, non-interactive, copy-pasteable command is to pipe the job
 * in: `echo "command" | at TIME`. That's a genuine two-process shell
 * pipeline — outside what `buildArgv`'s `Argv` (one binary + its args) can
 * represent, and outside what the generic token-quoting renderer can
 * produce (every `Arg` role it emits gets individually shell-quoted; a bare,
 * unquoted `|` has no role for that). So this file hand-assembles the extra
 * `echo <quoted command> |` prefix as literal, already-rendered tokens, then
 * appends the real `at TIME` tokens from the generic renderer unchanged.
 *
 * "list" (atq) and "remove" (atrm JOB) need no such prefix — they render
 * exactly like every other single-binary command.
 */
export function renderTokens(argv: Argv, spec: AtSpec): RenderedToken[] {
  const atTokens = renderTokensGeneric(argv, { shell: "posix" });
  if (spec.action !== "schedule") return atTokens;

  const command = spec.command.trim();
  if (command === "") return atTokens;

  const prefix: RenderedToken[] = [
    { text: "echo", role: "binary" },
    { text: quotePosix(command), role: "value" },
    { text: "|", role: "flag" },
  ];
  return [...prefix, ...atTokens];
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, spec: AtSpec): string {
  const tokens = renderTokens(argv, spec);
  // Reuse the generic joiner's exact behavior (space-joined token text) by
  // handing it the real `at`-only argv when there is no echo prefix to add,
  // and falling back to a plain join once the prefix tokens are involved.
  if (spec.action !== "schedule" || spec.command.trim() === "") {
    return renderOneLineGeneric(argv, { shell: "posix" });
  }
  return tokens.map((t) => t.text).join(" ");
}

/** Multi-line command with continuations, one logical argument per line. */
export function renderMultiLine(argv: Argv, spec: AtSpec): string {
  return layoutMultiLine(renderTokens(argv, spec), continuationFor("posix"));
}
