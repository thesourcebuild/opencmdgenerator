import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { UptimeSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

/** -p and -s each replace the entire output with a different single format — only one can actually win. */
const conflictingOutputFormat: LintRule<UptimeSpec> = {
  code: "UPT001",
  check(spec) {
    const enabled = CATALOGUE.flagsInArgvOrder()
      .filter((f) => spec.flags[f.id] === true)
      .map((f) => f.id);

    return conflictingPairs(CATALOGUE, enabled).map(([a, b]): Diagnostic<UptimeSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "UPT001",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} both replace the default output — pick one.`,
        detail: "uptime prints a single line in one of these formats; asking for both is redundant.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<UptimeSpec>[] = [conflictingOutputFormat];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
