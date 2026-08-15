import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool } from "../pure";

const verifyNoCheckTimeRisk: LintRule<OpensslSpec> = {
  code: "OSSL001",
  check(spec) {
    if (spec.subcommand !== "verify" || !flagBool(spec, "noCheckTime")) return [];
    return [
      {
        code: "OSSL001",
        level: "warning",
        message: "-no_check_time makes an expired or not-yet-valid certificate verify successfully anyway.",
        detail: "Only useful for testing against a fixed historical/future date — never appropriate for verifying a certificate meant to be trusted right now.",
        flagIds: ["noCheckTime"],
      },
    ];
  },
};

export const VERIFY_RULES: readonly LintRule<OpensslSpec>[] = [verifyNoCheckTimeRisk];
