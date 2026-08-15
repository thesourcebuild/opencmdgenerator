import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PacmanSpec } from "../spec";
import { flagBool } from "../pure";
import { OPERATION_TOKEN } from "../argv";

const OPERATIONS_NEEDING_PACKAGES = ["sync", "remove", "searchSync"] as const;

const missingPackages: LintRule<PacmanSpec> = {
  code: "PACMAN001",
  check(spec) {
    if (!OPERATIONS_NEEDING_PACKAGES.includes(spec.operation as (typeof OPERATIONS_NEEDING_PACKAGES)[number])) {
      return [];
    }
    if (spec.packages.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "PACMAN001",
        level: "error",
        message: `pacman ${OPERATION_TOKEN[spec.operation]} needs at least one package name.`,
        field: "packages",
      },
    ];
  },
};

const neededOutsideSync: LintRule<PacmanSpec> = {
  code: "PACMAN002",
  check(spec) {
    if (!flagBool(spec, "needed")) return [];
    if (spec.operation === "sync") return [];
    return [
      {
        code: "PACMAN002",
        level: "warning",
        message: "--needed only has an effect with the sync (-S) operation.",
        flagIds: ["needed"],
      },
    ];
  },
};

const cascadeOutsideRemove: LintRule<PacmanSpec> = {
  code: "PACMAN003",
  check(spec) {
    if (!flagBool(spec, "cascade")) return [];
    if (spec.operation === "remove") return [];
    return [
      {
        code: "PACMAN003",
        level: "warning",
        message: "--cascade only has an effect with the remove (-R) operation.",
        flagIds: ["cascade"],
      },
    ];
  },
};

export const RULES: readonly LintRule<PacmanSpec>[] = [missingPackages, neededOutsideSync, cascadeOutsideRemove];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
