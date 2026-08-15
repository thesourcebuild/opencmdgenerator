import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { ChmodSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagEnum, flagString, setFlag } from "../pure";

const noFiles: LintRule<ChmodSpec> = {
  code: "CHMOD001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "CHMOD001",
        level: "error",
        message: "No files to change permissions on.",
        field: "files",
      },
    ];
  },
};

const noModeSource: LintRule<ChmodSpec> = {
  code: "CHMOD002",
  check(spec) {
    if (spec.mode.trim() !== "" || flagString(spec, "reference")) return [];
    return [
      {
        code: "CHMOD002",
        level: "error",
        message: "Nothing to change permissions to.",
        detail: "Give a mode (e.g. 644, a+x) or --reference an existing file — chmod needs one or the other.",
        field: "mode",
      },
    ];
  },
};

const modeAndReferenceTogether: LintRule<ChmodSpec> = {
  code: "CHMOD003",
  check(spec) {
    const reference = flagString(spec, "reference");
    if (spec.mode.trim() === "" || !reference) return [];
    return [
      {
        code: "CHMOD003",
        level: "error",
        message: "Mode and --reference are mutually exclusive.",
        detail: `Real chmod accepts a mode or --reference=${reference}, never both — the generated command drops the "${spec.mode.trim()}" mode text so it isn't misread as a file.`,
        flagIds: ["reference"],
        field: "mode",
        fix: { label: "Clear the mode text", apply: (s) => ({ ...s, mode: "" }) },
      },
    ];
  },
};

const recursiveDereferenceRisk: LintRule<ChmodSpec> = {
  code: "CHMOD004",
  check(spec) {
    if (!flagBool(spec, "recursive")) return [];
    const traversal = flagEnum(spec, "traversalMode", ["H", "L", "P"]);
    const risky = flagBool(spec, "dereference") || traversal === "L";
    if (!risky) return [];
    return [
      {
        code: "CHMOD004",
        level: "warning",
        message: "Dereferencing symlinks during a recursive traversal is a real security risk.",
        detail:
          "During the traversal of the directory tree, an attacker may be able to introduce a symlink to an arbitrary target; when chmod reaches that, the operation is performed on the target of that symlink, possibly allowing the attacker to escalate privileges.",
        flagIds: ["dereference", "traversalMode"],
      },
    ];
  },
};

const traversalWithoutRecursive: LintRule<ChmodSpec> = {
  code: "CHMOD005",
  check(spec) {
    const traversal = flagEnum(spec, "traversalMode", ["H", "L", "P"]);
    if (!traversal || flagBool(spec, "recursive")) return [];
    return [
      {
        code: "CHMOD005",
        level: "info",
        message: `-${traversal} only matters together with --recursive.`,
        flagIds: ["traversalMode"],
      },
    ];
  },
};

const preserveRootWithoutRecursive: LintRule<ChmodSpec> = {
  code: "CHMOD006",
  check(spec) {
    if (!flagBool(spec, "preserveRoot") || flagBool(spec, "recursive")) return [];
    return [
      {
        code: "CHMOD006",
        level: "info",
        message: "--preserve-root has no effect without --recursive.",
        flagIds: ["preserveRoot"],
      },
    ];
  },
};

const contradictoryDereference: LintRule<ChmodSpec> = {
  code: "CHMOD007",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<ChmodSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CHMOD007",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<ChmodSpec>[] = [
  noFiles,
  noModeSource,
  modeAndReferenceTogether,
  recursiveDereferenceRisk,
  traversalWithoutRecursive,
  preserveRootWithoutRecursive,
  contradictoryDereference,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
