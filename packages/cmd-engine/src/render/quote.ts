import type { ShellDialect } from "@cmdgen/contracts";

export type { ShellDialect };

/**
 * Quoting matters here even though this app never executes anything: the output
 * is text a human pastes into a shell. A path that loses its quotes silently
 * runs the wrong command, so the default is to quote unless a token is
 * provably safe to leave bare.
 */

/** Characters no POSIX shell treats specially. */
const POSIX_SAFE = /^[A-Za-z0-9_@%+=:,./-]+$/;

/** Conservative for PowerShell: it also swallows @ { } ( ) ; and more. */
const POWERSHELL_SAFE = /^[A-Za-z0-9_+=:,./\\-]+$/;

export function quotePosix(value: string): string {
  if (value === "") return "''";
  if (POSIX_SAFE.test(value)) return value;
  // Single quotes protect everything except a single quote itself, which is
  // closed, escaped, and reopened: it's  ->  'it'\''s'
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function quotePowerShell(value: string): string {
  if (value === "") return "''";
  if (POWERSHELL_SAFE.test(value)) return value;
  // PowerShell single-quoted strings are literal; ' is escaped by doubling.
  return `'${value.replace(/'/g, "''")}'`;
}

/** Conservative for cmd.exe: safe bare characters only, quote everything else. */
const CMD_SAFE = /^[A-Za-z0-9_+=:,./\\-]+$/;

/**
 * cmd.exe quoting, deliberately conservative. Unlike POSIX single-quotes or
 * PowerShell single-quotes, cmd.exe has no context-independent escaping rule —
 * `^`, `%`, `&`, `|` and friends are re-interpreted differently depending on
 * what parses the line next (cmd itself vs. the child process's own argv
 * splitting). This handles the common case — spaces and otherwise-safe
 * punctuation, wrapped in `"..."` with embedded `"` doubled, which is what
 * most Windows programs' argv parsing expects — and does not attempt to
 * produce a provably-correct result for pathological input containing cmd
 * metacharacters. Prefer avoiding those in generated commands rather than
 * relying on this to escape them.
 */
export function quoteCmd(value: string): string {
  if (value === "") return '""';
  if (CMD_SAFE.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

export function quoteFor(value: string, shell: ShellDialect): string {
  switch (shell) {
    case "posix":
    case "cygwin":
    case "msys":
    case "wsl":
      // Cygwin, MSYS2 and WSL are all real bash shells — identical POSIX quoting rules.
      return quotePosix(value);
    case "cmd":
      return quoteCmd(value);
    case "powershell":
      return quotePowerShell(value);
  }
}

export function needsQuoting(value: string, shell: ShellDialect): boolean {
  return quoteFor(value, shell) !== value;
}

/**
 * `--flag=value` must stay one token, but only the value half may need quoting.
 * Quoting the whole thing (`'--exclude=*.tmp'`) is valid but reads badly, so the
 * flag name is kept bare and the value quoted in place.
 */
export function quoteAttached(token: string, shell: ShellDialect): string {
  const eq = token.indexOf("=");
  if (eq <= 0) return quoteFor(token, shell);
  const name = token.slice(0, eq);
  const value = token.slice(eq + 1);
  const quoted = quoteFor(value, shell);
  return quoted === value ? token : `${name}=${quoted}`;
}
