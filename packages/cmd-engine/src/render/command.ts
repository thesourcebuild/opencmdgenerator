import type { Arg, Argv } from "../argv";
import { toBashPath } from "../path-shape";
import { quoteAttached, quoteFor, type ShellDialect } from "./quote";

/**
 * "path"-role arguments get their Windows drive-letter/UNC spelling rewritten
 * before quoting when the target shell is a bash running under Cygwin, MSYS2
 * or WSL — see `ShellDialect`'s own doc comment for why this lives at the
 * generic level rather than per-command. Every other role (and every other
 * shell) passes through untouched.
 */
function pathAwareText(arg: Arg, shell: ShellDialect): string {
  if (arg.role !== "path") return arg.text;
  if (shell !== "cygwin" && shell !== "msys" && shell !== "wsl") return arg.text;
  return toBashPath(arg.text, shell);
}

export interface RenderOptions {
  shell: ShellDialect;
  /** Coalesce adjacent value-less short flags: -a -v -z becomes -avz. */
  combineShortFlags?: boolean;
}

export interface RenderedToken {
  text: string;
  role: Arg["role"] | "binary";
  flagId?: string;
}

const SHORT_BOOLEAN = /^-[A-Za-z]$/;

function combineShorts(args: readonly Arg[]): Arg[] {
  const out: Arg[] = [];
  let run: Arg[] = [];

  const flush = () => {
    if (run.length === 0) return;
    if (run.length === 1) {
      out.push(run[0]!);
    } else {
      out.push({
        text: `-${run.map((a) => a.text.slice(1)).join("")}`,
        role: "flag",
        flagId: run[0]!.flagId,
      });
    }
    run = [];
  };

  for (const arg of args) {
    if (arg.role === "flag" && SHORT_BOOLEAN.test(arg.text)) {
      run.push(arg);
      continue;
    }
    flush();
    out.push(arg);
  }
  flush();
  return out;
}

/** Quote each token, preserving role information for syntax highlighting. */
export function renderTokens(argv: Argv, options: RenderOptions): RenderedToken[] {
  const args = options.combineShortFlags ? combineShorts(argv.args) : [...argv.args];

  const tokens: RenderedToken[] = [
    { text: quoteFor(argv.binary, options.shell), role: "binary" },
  ];

  for (const arg of args) {
    const raw = pathAwareText(arg, options.shell);
    const text = arg.attached ? quoteAttached(raw, options.shell) : quoteFor(raw, options.shell);
    tokens.push({ text, role: arg.role, flagId: arg.flagId });
  }

  return tokens;
}

/** Single-line command, ready to paste. */
export function renderOneLine(argv: Argv, options: RenderOptions): string {
  return renderTokens(argv, options)
    .map((t) => t.text)
    .join(" ");
}

const PAIRED_ROLES: ReadonlySet<RenderedToken["role"]> = new Set(["value", "pattern", "rsh"]);

/**
 * Lay out already-quoted tokens as a multi-line command with continuations,
 * one logical argument per line. A flag and its detached value stay on the
 * same line so the output reads the way the man page does.
 *
 * Generic over any command's tokens — it has no idea what shell produced
 * them, only the continuation string to join lines with (` \` for POSIX,
 * `` ` `` for PowerShell, `^` for cmd.exe, ...), so every command gets
 * multi-line rendering for free rather than reimplementing this layout.
 */
export function layoutMultiLine(tokens: readonly RenderedToken[], continuation: string): string {
  const lines: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;

    if (token.role === "binary") {
      lines.push(token.text);
      continue;
    }

    // A bare flag plus its detached value is one logical unit: `--filter '- *.tmp'`.
    const next = tokens[i + 1];
    if (
      token.role === "flag" &&
      !token.text.includes("=") &&
      next !== undefined &&
      PAIRED_ROLES.has(next.role)
    ) {
      lines.push(`  ${token.text} ${next.text}`);
      i++;
      continue;
    }

    lines.push(`  ${token.text}`);
  }

  return lines.map((l, i) => (i === lines.length - 1 ? l : l + continuation)).join("\n");
}

/** The line-continuation token each shell expects at the end of a wrapped line. */
export function continuationFor(shell: ShellDialect): string {
  switch (shell) {
    case "posix":
    case "cygwin":
    case "msys":
    case "wsl":
      return " \\";
    case "cmd":
      return " ^";
    case "powershell":
      return " `";
  }
}

/**
 * Multi-line command with continuations, one logical argument per line.
 * A flag and its detached value stay on the same line so the output reads
 * the way the man page does.
 */
export function renderMultiLine(argv: Argv, options: RenderOptions): string {
  return layoutMultiLine(renderTokens(argv, options), continuationFor(options.shell));
}
