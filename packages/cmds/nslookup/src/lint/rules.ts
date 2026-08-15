import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { NslookupSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const emptyLookupName: LintRule<NslookupSpec> = {
  code: "NSL001",
  check(spec) {
    if (spec.lookupName.trim() !== "") return [];
    return [
      {
        code: "NSL001",
        level: "error",
        message: "nslookup needs a name (or address) to look up.",
        field: "lookupName",
      },
    ];
  },
};

const bothQuerySpellingsSet: LintRule<NslookupSpec> = {
  code: "NSL002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<NslookupSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "NSL002",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are two spellings of the same option — pick one.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<NslookupSpec>[] = [emptyLookupName, bothQuerySpellingsSet];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
