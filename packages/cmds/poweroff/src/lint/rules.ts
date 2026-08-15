import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PoweroffSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

/**
 * Unconditional advisory, not tied to any specific flag — same idea as git's
 * `rebaseRewritesHistory` (`GIT038` in `@cmdgen/git`'s `lint/mergerebase.ts`)
 * and rm's `alwaysIrreversible` (`RM005`). poweroff always actually powers
 * off the machine right now, ending the current session, UNLESS
 * -w/--wtmp-only is set — in that case nothing actually happens (see
 * PWO002 below), so this rule stands down. There is no fix: there's no
 * safer flag combination that avoids the machine actually powering off —
 * that IS the point of the command.
 */
const alwaysPowersOffTheMachine: LintRule<PoweroffSpec> = {
  code: "PWO001",
  check(spec) {
    if (flagBool(spec, "wtmpOnly")) return [];
    return [
      {
        code: "PWO001",
        level: "destructive",
        message: "Running this command powers off the machine right now, ending the current session.",
        detail:
          "Every process is stopped and the machine loses power immediately. There is no confirmation prompt and no undo.",
      },
    ];
  },
};

/** The exemption above, made visible as its own diagnostic rather than a silent no-op. */
const wtmpOnlyDoesNotPowerOff: LintRule<PoweroffSpec> = {
  code: "PWO002",
  check(spec) {
    if (!flagBool(spec, "wtmpOnly")) return [];
    return [
      {
        code: "PWO002",
        level: "info",
        message: "-w only records a wtmp shutdown entry — the machine is not actually powered off.",
        detail: "Useful for testing accounting/logging without affecting the running system.",
        flagIds: ["wtmpOnly"],
      },
    ];
  },
};

const noSyncSkipsFlush: LintRule<PoweroffSpec> = {
  code: "PWO003",
  check(spec) {
    // Moot once -w means nothing actually happens.
    if (flagBool(spec, "wtmpOnly") || !flagBool(spec, "noSync")) return [];
    return [
      {
        code: "PWO003",
        level: "warning",
        message: "--no-sync skips flushing filesystem buffers before powering off.",
        detail: "Anything still buffered in memory and not yet written to disk is lost.",
        flagIds: ["noSync"],
        fix: { label: "Remove --no-sync", apply: (s) => setFlag(s, "noSync", undefined) },
      },
    ];
  },
};

const forceSkipsServiceManager: LintRule<PoweroffSpec> = {
  code: "PWO004",
  check(spec) {
    if (flagBool(spec, "wtmpOnly") || !flagBool(spec, "force")) return [];
    return [
      {
        code: "PWO004",
        level: "warning",
        message: "--force powers off immediately without asking systemd/logind first.",
        detail: "Services and sessions don't get the normal graceful chance to stop before the machine powers off.",
        flagIds: ["force"],
        fix: { label: "Remove --force", apply: (s) => setFlag(s, "force", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<PoweroffSpec>[] = [
  alwaysPowersOffTheMachine,
  wtmpOnlyDoesNotPowerOff,
  noSyncSkipsFlush,
  forceSkipsServiceManager,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
