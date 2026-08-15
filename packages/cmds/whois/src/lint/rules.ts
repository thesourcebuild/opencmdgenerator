import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WhoisSpec } from "../spec";

const emptyDomain: LintRule<WhoisSpec> = {
  code: "WHO001",
  check(spec) {
    if (spec.domain.trim() !== "") return [];
    return [
      {
        code: "WHO001",
        level: "error",
        message: "whois needs a domain or address to look up.",
        field: "domain",
      },
    ];
  },
};

export const RULES: readonly LintRule<WhoisSpec>[] = [emptyDomain];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
