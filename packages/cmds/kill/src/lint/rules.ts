import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { KillSpec } from "../spec";

const isPowerShell = (spec: KillSpec) => spec.platform === "windows-powershell";

/** POSIX: PID (optionally negative, for process groups) or a %job spec. PowerShell: a plain positive PID only — Stop-Process -Id takes no job specs or negative/broadcast values. */
const VALID_TARGET_POSIX = /^-?\d+$|^%\d+$/;
const VALID_TARGET_POWERSHELL = /^\d+$/;

function validTargets(spec: KillSpec): string[] {
  return spec.targets.map((t) => t.trim()).filter((t) => t !== "");
}

function isKillSignal(signal: string): boolean {
  const s = signal.trim().toUpperCase().replace(/^SIG/, "");
  return s === "KILL" || s === "9";
}

const noTargets: LintRule<KillSpec> = {
  code: "KILL001",
  check(spec) {
    // "list"/"table" mode has no targets at all — an empty listSignals is
    // its own valid, meaningful choice ("every supported signal name"), not
    // an error the way an empty target list would be for "signal" mode.
    if (spec.mode !== "signal" || validTargets(spec).length > 0) return [];
    return [
      {
        code: "KILL001",
        level: "error",
        message: "No process IDs or job specs to signal.",
        field: "targets",
      },
    ];
  },
};

const sigkillWarning: LintRule<KillSpec> = {
  code: "KILL002",
  check(spec) {
    // Stop-Process has no signal concept at all, so there is nothing to warn about here.
    if (isPowerShell(spec) || spec.mode !== "signal" || !isKillSignal(spec.signal)) return [];
    return [
      {
        code: "KILL002",
        level: "destructive",
        message: "SIGKILL cannot be caught, blocked, or ignored by the target process.",
        detail:
          "The process is terminated immediately with no chance to close files, flush buffers, or clean up — the OS just discards it. Try SIGTERM first and reach for SIGKILL only if the process doesn't respond.",
        field: "signal",
        fix: { label: "Use SIGTERM instead", apply: (s) => ({ ...s, signal: "TERM" }) },
      },
    ];
  },
};

const initProcessTarget: LintRule<KillSpec> = {
  code: "KILL003",
  check(spec) {
    // "PID 1 is init" is a POSIX/container framing — on native Windows the
    // critical low PIDs are different (System is typically PID 4), so this
    // specific warning would be misleading for Stop-Process targets.
    if (isPowerShell(spec) || spec.mode !== "signal" || !validTargets(spec).includes("1")) return [];
    return [
      {
        code: "KILL003",
        level: "destructive",
        message: "PID 1 is the init process (or the container's own entrypoint).",
        detail:
          "Signaling PID 1 can crash the whole system (or immediately exit a container). This is essentially never the process you meant to target.",
        field: "targets",
      },
    ];
  },
};

const broadcastTarget: LintRule<KillSpec> = {
  code: "KILL004",
  check(spec) {
    // Stop-Process -Id has no broadcast/group concept — every target there is
    // just a (possibly invalid) literal ID, already covered by KILL005.
    if (isPowerShell(spec) || spec.mode !== "signal") return [];
    const targets = validTargets(spec);
    const diagnostics: Diagnostic<KillSpec>[] = [];

    if (targets.includes("0")) {
      diagnostics.push({
        code: "KILL004",
        level: "destructive",
        message: '"0" signals every process in your own process group, not one specific process.',
        detail: "Not a literal PID — 0 is documented shorthand for \"every process in the caller's own process group\". Can take down far more than intended.",
        field: "targets",
      });
    }
    if (targets.includes("-1")) {
      diagnostics.push({
        code: "KILL004",
        level: "destructive",
        message: '"-1" signals every process you have permission to signal, not one specific process.',
        detail: "Not a literal PID — -1 is documented shorthand for \"every process the caller may signal\", system processes aside. About as broad a target as kill has.",
        field: "targets",
      });
    }
    const processGroups = targets.filter((t) => /^-\d+$/.test(t) && t !== "-1" && t !== "-0");
    if (processGroups.length > 0) {
      diagnostics.push({
        code: "KILL004",
        level: "warning",
        message: `"${processGroups.join('", "')}" targets an entire process group, not one specific process.`,
        detail: `A PID less than -1 signals every process in the process group whose ID is its absolute value — e.g. "${processGroups[0]}" means every process in group ${processGroups[0]!.slice(1)}.`,
        field: "targets",
      });
    }

    return diagnostics;
  },
};

const signalZeroIsAPermissionTest: LintRule<KillSpec> = {
  code: "KILL006",
  check(spec) {
    if (isPowerShell(spec) || spec.mode !== "signal") return [];
    const signal = spec.signal.trim().replace(/^SIG/i, "");
    if (signal !== "0") return [];
    return [
      {
        code: "KILL006",
        level: "info",
        message: "Signal 0 doesn't deliver anything.",
        detail: "0 isn't a real signal — it's the documented way to test whether you have permission to signal these processes, without actually sending one.",
        field: "signal",
      },
    ];
  },
};

const malformedTarget: LintRule<KillSpec> = {
  code: "KILL005",
  check(spec) {
    if (!isPowerShell(spec) && spec.mode !== "signal") return [];
    const pattern = isPowerShell(spec) ? VALID_TARGET_POWERSHELL : VALID_TARGET_POSIX;
    const malformed = validTargets(spec).filter((t) => !pattern.test(t));
    if (malformed.length === 0) return [];
    return [
      {
        code: "KILL005",
        level: "warning",
        message: isPowerShell(spec)
          ? `"${malformed.join('", "')}" doesn't look like a process ID.`
          : `"${malformed.join('", "')}" doesn't look like a PID or job spec (%1).`,
        detail: isPowerShell(spec)
          ? "Stop-Process -Id only accepts plain positive process IDs — not process names, and not negative or %job values (use -Name to target by process name instead)."
          : "kill only accepts numeric process IDs (optionally negative, for process groups) or %job specs — not process names. Use pkill/killall for names.",
        field: "targets",
      },
    ];
  },
};

export const RULES: readonly LintRule<KillSpec>[] = [
  noTargets,
  sigkillWarning,
  initProcessTarget,
  broadcastTarget,
  signalZeroIsAPermissionTest,
  malformedTarget,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
