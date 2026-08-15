import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { RpmSpec } from "../spec";
import { flagBool } from "../pure";

const MISSING_TARGET_MESSAGE: Record<"install" | "erase" | "query", string> = {
  install: "rpm -i needs a .rpm file to install.",
  erase: "rpm -e needs a package name to erase.",
  query: "rpm -q needs a package name to query.",
};

const missingTarget: LintRule<RpmSpec> = {
  code: "RPM001",
  check(spec) {
    if (spec.operation === "queryAll") return [];
    if (spec.target.trim() !== "") return [];
    return [
      {
        code: "RPM001",
        level: "error",
        message: MISSING_TARGET_MESSAGE[spec.operation],
        field: "target",
      },
    ];
  },
};

const hashWithoutInstall: LintRule<RpmSpec> = {
  code: "RPM002",
  check(spec) {
    if (!flagBool(spec, "hash")) return [];
    if (spec.operation === "install") return [];
    return [
      {
        code: "RPM002",
        level: "warning",
        message: "-h (hash marks) only has a visible effect during install.",
        flagIds: ["hash"],
      },
    ];
  },
};

export const RULES: readonly LintRule<RpmSpec>[] = [missingTarget, hashWithoutInstall];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
