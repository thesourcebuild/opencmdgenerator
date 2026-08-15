import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagString } from "../pure";

const dgstVerifyNeedsSignature: LintRule<OpensslSpec> = {
  code: "OSSL006",
  check(spec) {
    if (spec.subcommand !== "dgst") return [];
    if (!flagString(spec, "verify")?.trim()) return [];
    if (flagString(spec, "signature")?.trim()) return [];
    return [
      {
        code: "OSSL006",
        level: "error",
        message: "-verify needs a -signature file to check the digest against.",
        flagIds: ["verify", "signature"],
      },
    ];
  },
};

export const DIGEST_RULES: readonly LintRule<OpensslSpec>[] = [dgstVerifyNeedsSignature];
