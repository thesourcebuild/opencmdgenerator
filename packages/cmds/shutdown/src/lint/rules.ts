import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ShutdownSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

const haltAndRebootConflict: LintRule<ShutdownSpec> = {
  code: "SHD001",
  check(spec) {
    if (!flagBool(spec, "halt") || !flagBool(spec, "reboot")) return [];
    return [
      {
        code: "SHD001",
        level: "error",
        message: "-h and -r can't both be set — halt and reboot are mutually exclusive.",
        flagIds: ["halt", "reboot"],
        fix: { label: "Remove -r, keep -h", apply: (s) => setFlag(s, "reboot", undefined) },
      },
    ];
  },
};

/**
 * Same "control token vs. other fields" shape as git's `GIT037`
 * (`@cmdgen/git`'s `lint/mergerebase.ts`) — cancelling ignores every
 * schedule-only field, so set any of them alongside it and flag the
 * contradiction rather than silently dropping it at render time.
 */
const cancelIgnoresScheduleFields: LintRule<ShutdownSpec> = {
  code: "SHD002",
  check(spec) {
    if (spec.action !== "cancel") return [];
    // "now" is `createSpec`'s default time value, not something the user
    // necessarily typed — treating it as "meaningfully set" would flag every
    // freshly-created cancel spec that never touched `time` at all. Any
    // other value (including an explicit "now" re-typed after clearing it)
    // still counts.
    const time = spec.time.trim();
    const scheduleFieldsSet =
      (time !== "" && time !== "now") || flagBool(spec, "halt") || flagBool(spec, "reboot") || flagBool(spec, "dryRun");
    if (!scheduleFieldsSet) return [];
    return [
      {
        code: "SHD002",
        level: "warning",
        message: "-h, -r, -k, and the time are ignored when cancelling a pending shutdown.",
        detail: "Only the message (if any) is sent as the wall broadcast explaining the cancellation.",
        field: "action",
        fix: {
          label: "Clear -h, -r, -k, and time",
          apply: (s) => setFlag(setFlag(setFlag({ ...s, time: "" }, "halt", undefined), "reboot", undefined), "dryRun", undefined),
        },
      },
    ];
  },
};

/**
 * Unconditional advisory, not tied to any specific flag — same idea as git's
 * `rebaseRewritesHistory` (`GIT038`) and `@cmdgen/halt`'s/`@cmdgen/poweroff`'s
 * unconditional rules. A scheduled shutdown always actually halts/powers
 * off/reboots the machine at the given time, ending the current session,
 * UNLESS -k (dry-run/broadcast-only) is set — in that case nothing actually
 * happens (see SHD004 below), so this rule stands down. Cancelling is
 * deliberately exempt — it's the undo action, never destructive. There is no
 * fix: there's no safer flag combination that avoids the machine actually
 * acting at the scheduled time — that IS the point of the command.
 */
const scheduleActsOnTheMachine: LintRule<ShutdownSpec> = {
  code: "SHD003",
  check(spec) {
    if (spec.action !== "schedule" || flagBool(spec, "dryRun")) return [];
    const verb = flagBool(spec, "reboot") ? "reboots" : flagBool(spec, "halt") ? "halts" : "powers off";
    return [
      {
        code: "SHD003",
        level: "destructive",
        message: `This command ${verb} the machine at the scheduled time, ending the current session.`,
        detail:
          "Every process is stopped when the scheduled time arrives. There is no confirmation prompt at that point and no undo.",
      },
    ];
  },
};

/** The exemption above, made visible as its own diagnostic rather than a silent no-op. */
const dryRunDoesNotAct: LintRule<ShutdownSpec> = {
  code: "SHD004",
  check(spec) {
    if (spec.action !== "schedule" || !flagBool(spec, "dryRun")) return [];
    return [
      {
        code: "SHD004",
        level: "info",
        message: "-k only broadcasts the wall message — nothing is actually halted, powered off, or rebooted.",
        detail: "Useful for rehearsing the warning users would see without affecting the running system.",
        flagIds: ["dryRun"],
      },
    ];
  },
};

export const RULES: readonly LintRule<ShutdownSpec>[] = [
  haltAndRebootConflict,
  cancelIgnoresScheduleFields,
  scheduleActsOnTheMachine,
  dryRunDoesNotAct,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
