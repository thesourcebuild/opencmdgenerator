import type { RunShellKind } from "@cmdgen/contracts";

/**
 * Every command's own platform/dialect enum spells its Windows sub-shells
 * one of two consistent ways — the generic `ShellDialect` ("cmd", "powershell",
 * "wsl", ...) or a bespoke `<Name>Platform` enum's "windows-"-prefixed values
 * ("windows-cmd", "windows-powershell", "windows-wsl", ...) — established
 * across every command during the WSL rollout. This is the one place that
 * maps either spelling down to `RunShellKind`, so Run's availability check
 * doesn't need a per-command mapping table.
 *
 * This mapping is deliberately host-agnostic — it says "posix quoting means
 * bash", full stop, regardless of whether the current host can actually run
 * bash. Whether a mapped `RunShellKind` is usable on THIS host is a separate
 * check against `PlatformEnvironment.runnableShellKinds`, done by the caller
 * (see `generated-command-panel.tsx`) — that is what keeps a `wsl`-mapped
 * command from showing as runnable on a Linux host, or a `bash`-mapped one
 * from showing as runnable on Windows.
 *
 * Returns undefined for anything else (linux/mac as bare labels, cygwin,
 * msys, in either spelling) — those have no reliably-locatable local shell
 * to spawn on any host this app packages for, so Run is unavailable for
 * them, not mis-mapped.
 */
export function toRunShellKind(dialect: string): RunShellKind | undefined {
  switch (dialect) {
    case "cmd":
    case "windows-cmd":
      return "cmd";
    case "powershell":
    case "windows-powershell":
      return "powershell";
    case "wsl":
    case "windows-wsl":
      return "wsl";
    case "posix":
      return "bash";
    default:
      return undefined;
  }
}
