import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { ZipSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noArchiveName: LintRule<ZipSpec> = {
  code: "ZIP001",
  check(spec) {
    if (spec.archiveName.trim() !== "") return [];
    return [
      {
        code: "ZIP001",
        level: "error",
        message: "zip needs an archive name to create or update.",
        field: "archiveName",
      },
    ];
  },
};

const noFiles: LintRule<ZipSpec> = {
  code: "ZIP002",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "ZIP002",
        level: "error",
        message: "zip needs at least one file or directory to add.",
        field: "files",
      },
    ];
  },
};

/**
 * -9 (maximum compression) and -0 (no compression) are opposite ends of the
 * same knob — same shape as touch's TOUCH002 mutually-exclusive time-source
 * check.
 */
const conflictingCompression: LintRule<ZipSpec> = {
  code: "ZIP003",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<ZipSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "ZIP003",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are conflicting compression extremes.`,
        detail: "zip accepts at most one of -9 or -0 — pick maximum compression or no compression, never both.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<ZipSpec>[] = [noArchiveName, noFiles, conflictingCompression];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
