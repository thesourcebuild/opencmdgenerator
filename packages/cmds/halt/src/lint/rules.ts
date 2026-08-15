import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HaltSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

/**
 * Unconditional advisory, not tied to any specific flag — same idea as git's
 * `rebaseRewritesHistory` (`GIT038` in `@cmdgen/git`'s `lint/mergerebase.ts`)
 * and rm's `alwaysIrreversible` (`RM005`). halt always actually halts the
 * machine right now, ending the current session, UNLESS -w/--wtmp-only is
 * set — in that case nothing actually happens (see HLT002 below), so this
 * rule stands down. There is no fix: there's no safer flag combination that
 * avoids the machine actually halting — that IS the point of the command.
 */
const alwaysHaltsTheMachine: LintRule<HaltSpec> = {
  code: "HLT001",
  check(spec) {
    if (flagBool(spec, "wtmpOnly")) return [];
    return [
      {
        code: "HLT001",
        level: "destructive",
        message: "Running this command halts the machine right now, ending the current session.",
        detail:
          "Every process is stopped and the system leaves its running state immediately. There is no confirmation prompt and no undo.",
      },
    ];
  },
};

/** The exemption above, made visible as its own diagnostic rather than a silent no-op. */
const wtmpOnlyDoesNotHalt: LintRule<HaltSpec> = {
  code: "HLT002",
  check(spec) {
    if (!flagBool(spec, "wtmpOnly")) return [];
    return [
      {
        code: "HLT002",
        level: "info",
        message: "-w only records a wtmp shutdown entry — the machine is not actually halted.",
        detail: "Useful for testing accounting/logging without affecting the running system.",
        flagIds: ["wtmpOnly"],
      },
    ];
  },
};

const noSyncSkipsFlush: LintRule<HaltSpec> = {
  code: "HLT003",
  check(spec) {
    // Moot once -w means nothing actually happens.
    if (flagBool(spec, "wtmpOnly") || !flagBool(spec, "noSync")) return [];
    return [
      {
        code: "HLT003",
        level: "warning",
        message: "--no-sync skips flushing filesystem buffers before halting.",
        detail: "Anything still buffered in memory and not yet written to disk is lost.",
        flagIds: ["noSync"],
        fix: { label: "Remove --no-sync", apply: (s) => setFlag(s, "noSync", undefined) },
      },
    ];
  },
};

const forceSkipsServiceManager: LintRule<HaltSpec> = {
  code: "HLT004",
  check(spec) {
    if (flagBool(spec, "wtmpOnly") || !flagBool(spec, "force")) return [];
    return [
      {
        code: "HLT004",
        level: "warning",
        message: "--force halts immediately without asking systemd/logind first.",
        detail: "Services and sessions don't get the normal graceful chance to stop before the machine halts.",
        flagIds: ["force"],
        fix: { label: "Remove --force", apply: (s) => setFlag(s, "force", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<HaltSpec>[] = [
  alwaysHaltsTheMachine,
  wtmpOnlyDoesNotHalt,
  noSyncSkipsFlush,
  forceSkipsServiceManager,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
