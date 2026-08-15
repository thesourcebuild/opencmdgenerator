import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { ChownSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagEnum, flagString, setFlag } from "../pure";

const noFiles: LintRule<ChownSpec> = {
  code: "CHOWN001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [{ code: "CHOWN001", level: "error", message: "No files to change ownership of.", field: "files" }];
  },
};

const noOwnerSource: LintRule<ChownSpec> = {
  code: "CHOWN002",
  check(spec) {
    if (spec.owner.trim() !== "" || flagString(spec, "reference")) return [];
    return [
      {
        code: "CHOWN002",
        level: "error",
        message: "Nothing to change ownership to.",
        detail: "Give an owner (e.g. alice, alice:staff, :staff) or --reference an existing file — chown needs one or the other.",
        field: "owner",
      },
    ];
  },
};

const ownerAndReferenceTogether: LintRule<ChownSpec> = {
  code: "CHOWN003",
  check(spec) {
    const reference = flagString(spec, "reference");
    if (spec.owner.trim() === "" || !reference) return [];
    return [
      {
        code: "CHOWN003",
        level: "error",
        message: "Owner and --reference are mutually exclusive.",
        detail: `Real chown accepts an owner or --reference=${reference}, never both — the generated command drops the "${spec.owner.trim()}" owner text so it isn't misread as a file.`,
        flagIds: ["reference"],
        field: "owner",
        fix: { label: "Clear the owner text", apply: (s) => ({ ...s, owner: "" }) },
      },
    ];
  },
};

const recursiveDereferenceRisk: LintRule<ChownSpec> = {
  code: "CHOWN004",
  check(spec) {
    if (!flagBool(spec, "recursive")) return [];
    const traversal = flagEnum(spec, "traversalMode", ["H", "L", "P"]);
    const risky = flagBool(spec, "dereference") || traversal === "L";
    if (!risky) return [];
    return [
      {
        code: "CHOWN004",
        level: "warning",
        message: "Dereferencing symlinks during a recursive traversal is a real security risk.",
        detail:
          "An attacker who can introduce a symlink into the tree being traversed could redirect the ownership change onto an arbitrary target file.",
        flagIds: ["dereference", "traversalMode"],
      },
    ];
  },
};

const traversalWithoutRecursive: LintRule<ChownSpec> = {
  code: "CHOWN005",
  check(spec) {
    const traversal = flagEnum(spec, "traversalMode", ["H", "L", "P"]);
    if (!traversal || flagBool(spec, "recursive")) return [];
    return [{ code: "CHOWN005", level: "info", message: `-${traversal} only matters together with --recursive.`, flagIds: ["traversalMode"] }];
  },
};

const preserveRootWithoutRecursive: LintRule<ChownSpec> = {
  code: "CHOWN006",
  check(spec) {
    if (!flagBool(spec, "preserveRoot") || flagBool(spec, "recursive")) return [];
    return [{ code: "CHOWN006", level: "info", message: "--preserve-root has no effect without --recursive.", flagIds: ["preserveRoot"] }];
  },
};

const contradictoryDereference: LintRule<ChownSpec> = {
  code: "CHOWN007",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<ChownSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CHOWN007",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<ChownSpec>[] = [
  noFiles,
  noOwnerSource,
  ownerAndReferenceTogether,
  recursiveDereferenceRisk,
  traversalWithoutRecursive,
  preserveRootWithoutRecursive,
  contradictoryDereference,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
