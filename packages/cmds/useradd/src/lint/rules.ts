import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { UseraddSpec } from "../spec";

const noUsername: LintRule<UseraddSpec> = {
  code: "USERADD001",
  check(spec) {
    if (spec.username.trim() !== "") return [];
    return [
      {
        code: "USERADD001",
        level: "error",
        message: "useradd needs a username for the new account.",
        field: "username",
      },
    ];
  },
};

export const RULES: readonly LintRule<UseraddSpec>[] = [noUsername];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
