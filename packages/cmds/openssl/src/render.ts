import {
  continuationFor,
  layoutMultiLine,
  quoteFor,
  renderOneLine as renderOneLineGeneric,
  renderTokens as renderTokensGeneric,
  type RenderedToken,
} from "@cmdgen/engine";
import type { OpensslSpec, ShellDialect } from "./spec";
import type { Argv } from "./argv";

export type { RenderedToken };

/**
 * openssl's own render.ts, needed only for `dgst`/`enc`'s "text" input mode.
 * Real `openssl dgst` hashes a file argument, or stdin when none is given, and
 * real `openssl enc` encrypts/decrypts a file argument, or stdin when none is
 * given — there is no positional way to feed either literal typed text, so
 * this pipes it in as a genuine two-process shell pipeline: outside what
 * `buildArgv`'s `Argv` (one binary + its args) can represent, and outside what
 * the generic token-quoting renderer can produce (every `Arg` role it emits
 * gets individually shell-quoted; a bare, unquoted `|` has no role for that).
 * So this file hand-assembles the extra prefix as literal, already-rendered
 * tokens, then appends the real `openssl dgst ...` / `openssl enc ...` tokens
 * from the generic renderer unchanged — the identical technique
 * `@cmdgen/at`'s `render.ts` already uses for piping a scheduled job's body in.
 *
 * The prefix is NOT a plain `echo`, deliberately — verified empirically
 * (real openssl on both Linux and Windows) that `echo` always appends a
 * trailing line ending, which changes the resulting hash:
 *   - bash `echo hello | openssl dgst -sha256` hashes "hello\n"
 *   - PowerShell `'hello' | openssl dgst -sha256` hashes "hello\r\n"
 *   - cmd.exe `echo hello | openssl dgst -sha256` hashes "hello \r\n"
 *     (cmd's `echo` is unusually literal — it also keeps the space before
 *     the pipe as part of its own argument)
 * — none of which match hashing just "hello" (confirmed against a real
 * independent SHA-256 tool). `printf '%s'` (POSIX-family shells) and cmd's
 * `<nul set /p=` trick both write the exact bytes with nothing appended,
 * verified to reproduce the correct byte-exact hash.
 *
 * PowerShell has no native one-liner equivalent — every pipeline-to-native-
 * process path appends a trailing CRLF, confirmed empirically across
 * `Out-String -NoNewline`, `[Console]::Out.Write`, `Write-Host -NoNewline`,
 * and plain string piping. So PowerShell instead delegates the entire pipe
 * to a nested `cmd /c '<nul set /p ="text"| openssl ...>'` — the exact cmd
 * construct above, wrapped in a single PowerShell-quoted string and handed
 * to `cmd.exe` as its `/c` argument. Verified against a real PowerShell
 * session (`cmd /c '<nul set /p ="say "hi" now" | openssl dgst -sha256'`,
 * including with an embedded `"` and, separately, an embedded `'`) that this
 * reproduces the byte-exact hash — PowerShell's own single-quoted strings
 * don't need any escaping for an embedded `"` (only its own quote character,
 * `'`, needs the standard PowerShell doubling), and that doubled `''`
 * correctly collapses back to one literal `'` by the time cmd.exe sees it.
 *
 * Every other subcommand (and `dgst`/`enc` themselves in "files" mode)
 * renders exactly like every other single-binary command — this function is
 * a passthrough for all of them. Accepts either a full `OpensslSpec` (to get
 * the text-pipe behavior) or a bare `{ shell }` (every per-category
 * build/test module that only ever needs shell-based quoting, matching the
 * generic renderer's own `{ shell }` options shape) — the pipe prefix only
 * ever applies with a real `dgst`/`enc` spec in hand.
 */
type RenderInput = OpensslSpec | { shell: ShellDialect };

function textPipe(input: RenderInput): string | undefined {
  if (!("subcommand" in input)) return undefined;
  if (input.subcommand !== "dgst" && input.subcommand !== "enc") return undefined;
  if (input.inputMode !== "text") return undefined;
  const text = input.text.trim();
  return text === "" ? undefined : text;
}

function pipePrefix(text: string, shell: ShellDialect): RenderedToken[] {
  if (shell === "cmd") {
    // `<nul set /p =` reads no real input (redirected from `nul`) and so just
    // prints its literal argument with nothing appended — no newline, no
    // trailing space, unlike cmd's own `echo`.
    //
    // Always wrap in quotes, even when the text itself contains a `"`.
    // Verified against real cmd.exe: `set /p ="..."` strips exactly the
    // FIRST and LAST character of its argument when they're a matching quote
    // pair — it doesn't matter what quote characters appear in between, so
    // `set /p ="say "hi" now"` correctly outputs the literal `say "hi" now`
    // (12 bytes), no doubling needed. Quoting also turns out to be required
    // for a second, unrelated reason: piping `set /p=`'s output through a
    // real `|` (not `>` file redirection) silently appends one stray
    // trailing space to an UNQUOTED argument — verified via a raw-byte
    // capture on the receiving end of the pipe (11 bytes out for a 10-byte
    // input) — but does not do this when the argument is quoted. So the
    // unquoted fallback this file used to have was doubly wrong: it neither
    // matched cmd's real quote-stripping rule nor avoided the pipe's
    // trailing-space quirk. Quoting unconditionally fixes both and also
    // protects real metacharacters (`&|<>^%`), verified.
    return [
      { text: "<nul", role: "flag" },
      { text: "set", role: "flag" },
      { text: `/p ="${text}"`, role: "value" },
      { text: "|", role: "flag" },
    ];
  }

  // posix, cygwin, msys, wsl — all real bash-compatible shells with a real printf.
  return [
    { text: "printf", role: "binary" },
    { text: "%s", role: "value" },
    { text: quoteFor(text, shell), role: "value" },
    { text: "|", role: "flag" },
  ];
}

export function renderTokens(argv: Argv, input: RenderInput): RenderedToken[] {
  const text = textPipe(input);
  if (text === undefined) return renderTokensGeneric(argv, { shell: input.shell });

  if (input.shell === "powershell") {
    // Delegates to a nested `cmd /c '...'` rather than piping directly —
    // see this file's header comment. The inner command is cmd's own
    // always-quoted `<nul set /p=` pipeline, rendered exactly as the `cmd`
    // dialect would render it, then wrapped as a single PowerShell string.
    const innerLine = [...pipePrefix(text, "cmd"), ...renderTokensGeneric(argv, { shell: "cmd" })]
      .map((t) => t.text)
      .join(" ");
    return [
      { text: "cmd", role: "binary" },
      { text: "/c", role: "flag" },
      { text: `'${innerLine.replace(/'/g, "''")}'`, role: "value" },
    ];
  }

  return [...pipePrefix(text, input.shell), ...renderTokensGeneric(argv, { shell: input.shell })];
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, input: RenderInput): string {
  if (textPipe(input) === undefined) return renderOneLineGeneric(argv, { shell: input.shell });
  return renderTokens(argv, input)
    .map((t) => t.text)
    .join(" ");
}

/** Multi-line command with continuations, one logical argument per line. */
export function renderMultiLine(argv: Argv, input: RenderInput): string {
  return layoutMultiLine(renderTokens(argv, input), continuationFor(input.shell));
}
