import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { WhereisSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noCommand: LintRule<WhereisSpec> = {
  code: "WHEREIS001",
  check(spec) {
    if (spec.command.trim() !== "") return [];
    return [
      {
        code: "WHEREIS001",
        level: "error",
        message: "No command name given.",
        field: "command",
      },
    ];
  },
};

/**
 * -b, -m, and -s are already mutually exclusive on the catalogue via
 * `conflictsWith`, which the UI's `FlagsForm` uses to disable the other two
 * once one is set. Same as `@cmdgen/touch`'s TOUCH002, this lint rule
 * double-checks that pairing at the spec level too, in case a spec is
 * constructed directly (e.g. from a preset or persisted state) rather than
 * through the UI.
 */
const conflictingCategories: LintRule<WhereisSpec> = {
  code: "WHEREIS002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<WhereisSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "WHEREIS002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive search categories.`,
        detail: "whereis accepts at most one of -b, -m, or -s — never two at once.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<WhereisSpec>[] = [noCommand, conflictingCategories];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
