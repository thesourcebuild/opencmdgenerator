import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WgetSpec } from "../spec";

const noUrl: LintRule<WgetSpec> = {
  code: "WGET001",
  check(spec) {
    if (spec.url.trim() !== "") return [];
    return [
      {
        code: "WGET001",
        level: "error",
        message: "wget needs a URL to download.",
        field: "url",
      },
    ];
  },
};

export const RULES: readonly LintRule<WgetSpec>[] = [noUrl];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
