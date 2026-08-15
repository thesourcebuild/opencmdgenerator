import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { WhatisSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noWord: LintRule<WhatisSpec> = {
  code: "WHATIS001",
  check(spec) {
    if (spec.word.trim() !== "") return [];
    return [
      {
        code: "WHATIS001",
        level: "error",
        message: "No command name given.",
        field: "word",
      },
    ];
  },
};

/**
 * -r and -w are mutually exclusive pattern styles, already declared via
 * `conflictsWith` on the catalogue — same `conflictingPairs`-based shape as
 * `@cmdgen/touch`'s `TOUCH002`/`conflictingTimeSource`.
 */
const conflictingPatternStyle: LintRule<WhatisSpec> = {
  code: "WHATIS002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<WhatisSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "WHATIS002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive pattern styles.`,
        detail: "whatis accepts at most one of -r or -w — never both at once.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<WhatisSpec>[] = [noWord, conflictingPatternStyle];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
