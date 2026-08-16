import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { flagBool, flagString } from "../pure";
import type { SystemctlSpec } from "../spec";
import { actionNeedsTarget, positionalArgs } from "../argv";

const RISKY_ACTIONS = new Set<SystemctlSpec["action"]>([
  "stop",
  "disable",
  "restart",
  "try-restart",
  "reload-or-restart",
  "try-reload-or-restart",
  "isolate",
  "kill",
  "clean",
  "freeze",
  "mask",
  "poweroff",
  "reboot",
  "halt",
  "kexec",
  "suspend",
  "hibernate",
  "hybrid-sleep",
  "suspend-then-hibernate",
]);

const noUnit: LintRule<SystemctlSpec> = {
  code: "SCT001",
  check(spec) {
    if (!actionNeedsTarget(spec.action) || positionalArgs(spec).length > 0) return [];
    const diagnostic: Diagnostic<SystemctlSpec> = {
      code: "SCT001",
      level: "error",
      message: `systemctl ${spec.action} needs at least one argument.`,
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
    const unit = positionalArgs(spec)[0] ?? "this target";
    return [
      {
        code: "SCT002",
        level: "warning",
        message: `systemctl ${spec.action} ${unit} can affect running services or system state.`,
        detail:
          "This app has no way to know whether a given unit is safe to stop or disable — verify it isn't a critical system service before running this.",
        field: "unit",
      },
    ];
  },
};

const dangerousOptions: LintRule<SystemctlSpec> = {
  code: "SCT003",
  check(spec) {
    const details: string[] = [];
    if (flagString(spec, "what") === "all") details.push("--what=all removes every cleanable resource type for the selected units.");
    if (flagBool(spec, "force")) details.push("--force changes normal safety semantics for the selected operation.");
    if (flagBool(spec, "firmwareSetup")) details.push("--firmware-setup changes the next reboot target.");
    if (details.length === 0) return [];
    return [
      {
        code: "SCT003",
        level: "warning",
        message: "One or more selected systemctl options are potentially disruptive.",
        detail: details.join(" "),
      },
    ];
  },
};

export const RULES: readonly LintRule<SystemctlSpec>[] = [noUnit, stopOrDisableCaution, dangerousOptions];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
