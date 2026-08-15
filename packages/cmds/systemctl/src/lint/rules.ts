import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { SystemctlSpec } from "../spec";

const NO_UNIT_ACTIONS = new Set<SystemctlSpec["action"]>(["daemon-reload"]);
const RISKY_ACTIONS = new Set<SystemctlSpec["action"]>(["stop", "disable"]);

const noUnit: LintRule<SystemctlSpec> = {
  code: "SCT001",
  check(spec) {
    if (NO_UNIT_ACTIONS.has(spec.action) || spec.unit.trim() !== "") return [];
    const diagnostic: Diagnostic<SystemctlSpec> = {
      code: "SCT001",
      level: "error",
      message: `systemctl ${spec.action} needs a unit to act on.`,
      field: "unit",
    };
    return [diagnostic];
  },
};

/**
 * A generic, always-applicable caution: this app has no way to know whether
 * any given unit name is safe to stop/disable — it could be a throwaway test
 * service or something the whole host depends on. Same kind of advisory as
 * `@cmdgen/crontab`'s remove-action warning, just non-destructive here since
 * stopping/disabling is reversible (start/enable again undoes it).
 */
const stopOrDisableCaution: LintRule<SystemctlSpec> = {
  code: "SCT002",
  check(spec) {
    if (!RISKY_ACTIONS.has(spec.action)) return [];
    const unit = spec.unit.trim() || "this unit";
    return [
      {
        code: "SCT002",
        level: "warning",
        message: `${spec.action === "stop" ? "Stopping" : "Disabling"} ${unit} can affect anything that depends on it.`,
        detail:
          "This app has no way to know whether a given unit is safe to stop or disable — verify it isn't a critical system service before running this.",
        field: "unit",
      },
    ];
  },
};

export const RULES: readonly LintRule<SystemctlSpec>[] = [noUnit, stopOrDisableCaution];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
