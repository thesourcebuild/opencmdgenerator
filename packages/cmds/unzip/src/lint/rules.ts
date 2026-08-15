import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { UnzipSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noArchive: LintRule<UnzipSpec> = {
  code: "UNZIP001",
  check(spec) {
    if (spec.archiveName.trim() !== "") return [];
    return [
      {
        code: "UNZIP001",
        level: "error",
        message: "unzip needs an archive to extract.",
        field: "archiveName",
      },
    ];
  },
};

/**
 * Empty `files` (extract everything) is deliberately NOT flagged here — same
 * paths-empty-means-everything precedent as `@cmdgen/df`'s empty `paths`.
 *
 * Covers every `conflictsWith` pair generically: the seven mutually exclusive
 * modes (-l/-t/-v/-p/-f/-u/-z, at most one at a time), -o vs -n (overwrite
 * vs never-overwrite), and -q vs -qq (quiet vs quieter).
 */
const conflictingFlags: LintRule<UnzipSpec> = {
  code: "UNZIP002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<UnzipSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "UNZIP002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive.`,
        detail: "unzip accepts at most one of these at a time — never both together.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<UnzipSpec>[] = [noArchive, conflictingFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
