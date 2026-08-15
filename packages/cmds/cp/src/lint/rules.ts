import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { CpSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

const noSources: LintRule<CpSpec> = {
  code: "CP001",
  check(spec) {
    if (spec.sources.some((s) => s.trim() !== "")) return [];
    return [{ code: "CP001", level: "error", message: "No sources to copy.", field: "sources" }];
  },
};

const noDestination: LintRule<CpSpec> = {
  code: "CP002",
  check(spec) {
    if (spec.destination.trim() !== "") return [];
    return [{ code: "CP002", level: "error", message: "No destination given.", field: "destination" }];
  },
};

const contradictoryFlags: LintRule<CpSpec> = {
  code: "CP003",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<CpSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CP003",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/**
 * The one real trap in this whole package: cmd.exe's `copy` treats multiple
 * sources as a request to CONCATENATE them into one destination file
 * (`copy a.txt+b.txt dest.txt`), not to copy each into a directory the way
 * every other platform here does. Silently rendering that as multiple bare
 * arguments would look plausible and do something the user almost certainly
 * doesn't want, so this is an error, not a warning.
 */
const multipleSourcesOnCmd: LintRule<CpSpec> = {
  code: "CP004",
  check(spec) {
    const sourceCount = spec.sources.filter((s) => s.trim() !== "").length;
    if (spec.platform !== "windows-cmd" || sourceCount < 2) return [];
    return [
      {
        code: "CP004",
        level: "error",
        message: "cmd.exe's copy cannot copy multiple sources into a directory the way cp/Copy-Item do.",
        detail:
          "copy's own multi-source syntax (a.txt+b.txt) concatenates the files into ONE destination file instead — almost certainly not what's intended here. Switch to PowerShell (Copy-Item handles multiple sources correctly), or generate one copy command per file.",
        field: "sources",
      },
    ];
  },
};

const forceIgnoredWithNoClobber: LintRule<CpSpec> = {
  code: "CP006",
  check(spec) {
    if (!flagBool(spec, "force") || !flagBool(spec, "noClobber")) return [];
    return [
      {
        code: "CP006",
        level: "info",
        message: "--force has no effect combined with --no-clobber — cp ignores it in that case.",
        flagIds: ["force", "noClobber"],
        fix: { label: "Remove --force", apply: (s) => setFlag(s, "force", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<CpSpec>[] = [
  noSources,
  noDestination,
  contradictoryFlags,
  multipleSourcesOnCmd,
  forceIgnoredWithNoClobber,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
