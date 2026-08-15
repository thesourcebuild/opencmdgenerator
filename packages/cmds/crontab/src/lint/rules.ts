import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { CrontabSpec } from "../spec";

/**
 * crontab's one real footgun: -r wipes the entire crontab in a single step,
 * with zero confirmation prompt and no built-in undo (unlike systemctl
 * stop/disable, which are trivially reversible by starting/enabling again).
 * The fix nudges toward reviewing with -l first rather than blindly removing.
 */
const removeIsDestructive: LintRule<CrontabSpec> = {
  code: "CRN001",
  check(spec) {
    if (spec.action !== "remove") return [];
    const who = spec.user.trim() || "the current user's";
    return [
      {
        code: "CRN001",
        level: "destructive",
        message: `Removes ${who === "the current user's" ? "the current user's" : `${who}'s`} entire crontab, wiping every scheduled job at once.`,
        detail: "There is no confirmation prompt and no built-in undo — once removed, the crontab is gone unless you kept a separate backup.",
        field: "action",
        fix: { label: "Switch to 'list' to review first", apply: (s) => ({ ...s, action: "list" }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<CrontabSpec>[] = [removeIsDestructive];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
