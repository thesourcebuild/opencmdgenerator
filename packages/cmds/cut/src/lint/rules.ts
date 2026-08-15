import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, unmetRequirements } from "@cmdgen/engine";
import type { CutSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagString, setFlag } from "../pure";

/**
 * Real cut errors out if none of -f/-c/-b is given ("you must specify a list
 * of bytes, characters, or fields") — there is no meaningful default
 * selection the way, say, a bare `sort` or `wc` has one.
 */
const noSelectionMode: LintRule<CutSpec> = {
  code: "CUT001",
  check(spec) {
    if (flagString(spec, "fields") || flagString(spec, "characters") || flagString(spec, "bytes")) return [];
    return [
      {
        code: "CUT001",
        level: "error",
        message: "cut requires exactly one of -f, -c, or -b.",
        detail: "There is no default selection — real cut refuses to run without one of these.",
        field: "flags",
      },
    ];
  },
};

/** Real cut also errors out if more than one of -f/-c/-b is given at once — they're mutually exclusive selection modes. */
const conflictingSelectionModes: LintRule<CutSpec> = {
  code: "CUT002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<CutSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CUT002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive.`,
        detail: "cut accepts at most one of -f, -c, or -b — never more than one at a time.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/** -d only matters together with -f; on its own it's a silent no-op in real cut. */
const delimiterWithoutFields: LintRule<CutSpec> = {
  code: "CUT003",
  check(spec) {
    return unmetRequirements(CATALOGUE, enabledFlagIds(spec)).map(([id, need]): Diagnostic<CutSpec> => {
      const def = CATALOGUE.getFlag(id);
      const needDef = CATALOGUE.getFlag(need);
      return {
        code: "CUT003",
        level: "info",
        message: `${def ? flagLabel(def) : id} has no effect without ${needDef ? flagLabel(needDef) : need}.`,
        detail: "cut's -c and -b work on fixed positions, not delimited fields — -d only changes how -f splits each line.",
        flagIds: [id, need],
        fix: { label: `Remove ${def ? flagLabel(def) : id}`, apply: (s) => setFlag(s, id, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<CutSpec>[] = [
  noSelectionMode,
  conflictingSelectionModes,
  delimiterWithoutFields,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
