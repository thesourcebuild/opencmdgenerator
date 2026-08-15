import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { flagBool, setFlag } from "../pure";
import type { WhereSpec } from "../spec";

const noPatterns: LintRule<WhereSpec> = {
  code: "WHR001",
  check(spec) {
    if (spec.patterns.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "WHR001",
        level: "error",
        message: "No search patterns given.",
        field: "patterns",
      },
    ];
  },
};

/**
 * /Q suppresses ALL output, so pairing it with /F or /T (both purely
 * output-formatting flags) has no visible effect — not a real error (where
 * doesn't fail), just a redundant combination worth flagging.
 */
const quietWithFormatting: LintRule<WhereSpec> = {
  code: "WHR002",
  check(spec) {
    if (!flagBool(spec, "quiet")) return [];
    const redundant = (["quotedFilenames", "showDetails"] as const).filter((id) => flagBool(spec, id));
    return redundant.map((id): Diagnostic<WhereSpec> => ({
      code: "WHR002",
      level: "info",
      message: `/Q suppresses all output, so ${id === "quotedFilenames" ? "/F" : "/T"} has no visible effect here.`,
      detail: "/Q returns only an exit code — nothing is ever printed, regardless of any formatting flag.",
      flagIds: ["quiet", id],
      fix: { label: `Remove ${id === "quotedFilenames" ? "/F" : "/T"}`, apply: (s) => setFlag(s, id, undefined) },
    }));
  },
};

export const RULES: readonly LintRule<WhereSpec>[] = [noPatterns, quietWithFormatting];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
