import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { AptSpec } from "../spec";
import { flagBool } from "../pure";

/** Actions real apt accepts one or more package names for. */
const PACKAGE_ACTIONS = new Set<AptSpec["action"]>(["install", "remove", "search"]);

const noPackages: LintRule<AptSpec> = {
  code: "APT001",
  check(spec) {
    if (!PACKAGE_ACTIONS.has(spec.action)) return [];
    if (spec.packages.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "APT001",
        level: "error",
        message: `apt ${spec.action} needs at least one package name.`,
        field: "packages",
      },
    ];
  },
};

/** --purge only does anything alongside the remove action — it's a no-op (and easy to mistake for meaningful) on every other action. */
const purgeWithoutRemove: LintRule<AptSpec> = {
  code: "APT002",
  check(spec) {
    if (!flagBool(spec, "purge")) return [];
    if (spec.action === "remove") return [];
    return [
      {
        code: "APT002",
        level: "warning",
        message: "--purge only has an effect when removing a package.",
        flagIds: ["purge"],
      },
    ];
  },
};

export const RULES: readonly LintRule<AptSpec>[] = [noPackages, purgeWithoutRemove];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
