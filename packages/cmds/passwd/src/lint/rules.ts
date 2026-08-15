import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { PasswdSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

/**
 * An empty username is deliberately NOT an error here, unlike killall's
 * mandatory `processName` — a bare `passwd` is valid, common usage that
 * changes the current user's own password.
 */
const conflictingLockDirection: LintRule<PasswdSpec> = {
  code: "PASSWD001",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<PasswdSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "PASSWD001",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive.`,
        detail: "passwd accepts at most one of -l or -u — pick one direction, not both.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<PasswdSpec>[] = [conflictingLockDirection];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
