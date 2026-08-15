import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { AptGetSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

/** Actions real apt-get accepts one or more package names for. */
const PACKAGE_ACTIONS = new Set<AptGetSpec["action"]>(["install", "remove", "purge"]);

const noPackages: LintRule<AptGetSpec> = {
  code: "APG001",
  check(spec) {
    if (!PACKAGE_ACTIONS.has(spec.action)) return [];
    if (spec.packages.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "APG001",
        level: "error",
        message: `apt-get ${spec.action} needs at least one package name.`,
        field: "packages",
      },
    ];
  },
};

/** --purge only does anything alongside the remove action — the purge action already removes config files by itself. */
const purgeWithoutRemove: LintRule<AptGetSpec> = {
  code: "APG002",
  check(spec) {
    if (!flagBool(spec, "purge")) return [];
    if (spec.action === "remove") return [];
    return [
      {
        code: "APG002",
        level: "warning",
        message: "--purge only has an effect alongside the remove action.",
        flagIds: ["purge"],
      },
    ];
  },
};

const allowUnauthenticatedRisk: LintRule<AptGetSpec> = {
  code: "APG003",
  check(spec) {
    if (!flagBool(spec, "allowUnauthenticated")) return [];
    return [
      {
        code: "APG003",
        level: "warning",
        message: "--allow-unauthenticated disables package signature verification.",
        detail: "Any package from the configured repositories is installed without checking it was signed by a trusted key — vulnerable to a tampered or spoofed repository.",
        flagIds: ["allowUnauthenticated"],
      },
    ];
  },
};

const redundantPurgeWithPurgeAction: LintRule<AptGetSpec> = {
  code: "APG004",
  check(spec) {
    if (spec.action !== "purge" || !flagBool(spec, "purge")) return [];
    return [
      {
        code: "APG004",
        level: "info",
        message: "The purge action already removes configuration files — --purge has no additional effect here.",
        flagIds: ["purge"],
        fix: { label: "Remove --purge", apply: (s) => setFlag(s, "purge", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<AptGetSpec>[] = [
  noPackages,
  purgeWithoutRemove,
  allowUnauthenticatedRisk,
  redundantPurgeWithPurgeAction,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
