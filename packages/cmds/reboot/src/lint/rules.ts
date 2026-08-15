import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { RebootSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

/**
 * Unconditional advisory, not tied to any specific flag — same idea as git's
 * `rebaseRewritesHistory` (`GIT038` in `@cmdgen/git`'s `lint/mergerebase.ts`)
 * and rm's `alwaysIrreversible` (`RM005`). Unlike `@cmdgen/halt`'s/
 * `@cmdgen/poweroff`'s equivalent, reboot has no -w/--wtmp-only exemption —
 * real reboot has no "just log it" mode — so this fires unconditionally.
 * There is no fix: there's no safer flag combination that avoids the
 * machine actually rebooting — that IS the point of the command.
 */
const alwaysRebootsTheMachine: LintRule<RebootSpec> = {
  code: "RBT001",
  check() {
    return [
      {
        code: "RBT001",
        level: "destructive",
        message: "Running this command reboots the machine right now, ending the current session.",
        detail:
          "Every process is stopped and the system restarts immediately. There is no confirmation prompt and no undo.",
      },
    ];
  },
};

const noSyncSkipsFlush: LintRule<RebootSpec> = {
  code: "RBT002",
  check(spec) {
    if (!flagBool(spec, "noSync")) return [];
    return [
      {
        code: "RBT002",
        level: "warning",
        message: "--no-sync skips flushing filesystem buffers before rebooting.",
        detail: "Anything still buffered in memory and not yet written to disk is lost.",
        flagIds: ["noSync"],
        fix: { label: "Remove --no-sync", apply: (s) => setFlag(s, "noSync", undefined) },
      },
    ];
  },
};

const forceSkipsServiceManager: LintRule<RebootSpec> = {
  code: "RBT003",
  check(spec) {
    if (!flagBool(spec, "force")) return [];
    return [
      {
        code: "RBT003",
        level: "warning",
        message: "--force reboots immediately without asking systemd/logind first.",
        detail: "Services and sessions don't get the normal graceful chance to stop before the machine reboots.",
        flagIds: ["force"],
        fix: { label: "Remove --force", apply: (s) => setFlag(s, "force", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<RebootSpec>[] = [
  alwaysRebootsTheMachine,
  noSyncSkipsFlush,
  forceSkipsServiceManager,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
