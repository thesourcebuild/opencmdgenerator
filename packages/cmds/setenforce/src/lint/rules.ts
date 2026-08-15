import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { SetenforceSpec } from "../spec";

/**
 * Setting SELinux to Permissive disables enforcement system-wide — every
 * policy violation is still logged, but nothing is actually blocked. A real,
 * common action (troubleshooting a denial), not a mistake by itself, so this
 * is a warning rather than an error — but it's significant enough that it
 * should never render silently. `fix` flips back to the safe default rather
 * than removing anything, since there's no catalogue flag to clear here.
 */
const permissiveModeRisk: LintRule<SetenforceSpec> = {
  code: "SEF001",
  check(spec) {
    if (spec.mode !== "Permissive") return [];
    const diagnostic: Diagnostic<SetenforceSpec> = {
      code: "SEF001",
      level: "warning",
      message: "Permissive mode disables SELinux enforcement system-wide — nothing is blocked, only logged.",
      detail:
        "Useful for troubleshooting a denial, but leaving a system in Permissive mode removes SELinux's real protection until it's set back to Enforcing.",
      field: "mode",
      fix: { label: "Set mode to Enforcing", apply: (s) => ({ ...s, mode: "Enforcing" }) },
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<SetenforceSpec>[] = [permissiveModeRisk];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
