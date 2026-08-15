import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { KillallSpec } from "../spec";

const noProcessName: LintRule<KillallSpec> = {
  code: "KILLALL001",
  check(spec) {
    if (spec.processName.trim() !== "") return [];
    return [
      {
        code: "KILLALL001",
        level: "error",
        message: "No process name given.",
        field: "processName",
      },
    ];
  },
};

export const RULES: readonly LintRule<KillallSpec>[] = [noProcessName];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
