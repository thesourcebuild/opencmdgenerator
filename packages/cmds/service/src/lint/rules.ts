import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { ServiceSpec } from "../spec";

const noServiceName: LintRule<ServiceSpec> = {
  code: "SERVICE001",
  check(spec) {
    if (spec.serviceName.trim() !== "") return [];
    const diagnostic: Diagnostic<ServiceSpec> = {
      code: "SERVICE001",
      level: "error",
      message: "service needs a name to act on.",
      field: "serviceName",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<ServiceSpec>[] = [noServiceName];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
