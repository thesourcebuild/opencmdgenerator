import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { UniqSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const contradictoryFlags: LintRule<UniqSpec> = {
  code: "UNQ001",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<UniqSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "UNQ001",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/**
 * The single most common real-world uniq mistake: it only removes ADJACENT
 * duplicate lines, so unsorted input silently leaves separated duplicates in
 * place. This generator has no visibility into what produced the input file
 * (or whatever feeds standard input), so it can't know whether it's already
 * sorted — this fires unconditionally as a standing reminder, same spirit as
 * a permanent caveat rather than a mistake to correct, hence no fix.
 */
const adjacentOnlyReminder: LintRule<UniqSpec> = {
  code: "UNQ002",
  check() {
    return [
      {
        code: "UNQ002",
        level: "info",
        message: "uniq only removes ADJACENT duplicate lines.",
        detail: "Duplicates that aren't next to each other pass through untouched. Pipe through sort first if the input isn't already sorted, e.g. sort file.txt | uniq.",
      },
    ];
  },
};

export const RULES: readonly LintRule<UniqSpec>[] = [contradictoryFlags, adjacentOnlyReminder];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
