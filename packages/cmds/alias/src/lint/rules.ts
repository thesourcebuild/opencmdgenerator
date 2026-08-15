import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { AliasSpec } from "../spec";

const commandWithoutName: LintRule<AliasSpec> = {
  code: "ALIAS001",
  check(spec) {
    if (spec.aliasName.trim() !== "" || spec.command.trim() === "") return [];
    return [
      {
        code: "ALIAS001",
        level: "warning",
        message: "A command is set but there's no alias name — it has no effect without one.",
        field: "aliasName",
      },
    ];
  },
};

export const RULES: readonly LintRule<AliasSpec>[] = [commandWithoutName];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
