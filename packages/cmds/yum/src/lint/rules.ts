import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { YumSpec } from "../spec";

/**
 * install/remove/search all need at least one package name; update does not
 * (a bare `yum update` with no packages updates everything — a valid, common
 * form), so update is deliberately exempt.
 */
const noPackages: LintRule<YumSpec> = {
  code: "YUM001",
  check(spec) {
    if (spec.action === "update") return [];
    if (spec.packages.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "YUM001",
        level: "error",
        message: `yum ${spec.action} needs at least one package name.`,
        field: "packages",
      },
    ];
  },
};

export const RULES: readonly LintRule<YumSpec>[] = [noPackages];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
