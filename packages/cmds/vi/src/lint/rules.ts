import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ViSpec } from "../spec";

const noFiles: LintRule<ViSpec> = {
  code: "VI001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "VI001",
        level: "info",
        message: "No files given — vi will open with an unnamed buffer.",
        field: "files",
      },
    ];
  },
};

const invalidStartLine: LintRule<ViSpec> = {
  code: "VI002",
  check(spec) {
    if (spec.startLine === undefined || spec.startLine > 0) return [];
    return [
      {
        code: "VI002",
        level: "warning",
        message: "Line numbers start at 1 — this start line has no effect.",
        field: "startLine",
        fix: { label: "Clear the start line", apply: (s) => ({ ...s, startLine: undefined }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<ViSpec>[] = [noFiles, invalidStartLine];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
