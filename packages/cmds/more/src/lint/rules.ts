import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { MoreSpec } from "../spec";

const noFiles: LintRule<MoreSpec> = {
  code: "MOR001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "MOR001",
        level: "error",
        message: "No files to page through.",
        detail: "Without a file, more reads from standard input instead — usually not what's intended when building a command like this.",
        field: "files",
      },
    ];
  },
};

const invalidStartLine: LintRule<MoreSpec> = {
  code: "MOR002",
  check(spec) {
    if (spec.startLine === undefined || spec.startLine > 0) return [];
    return [
      {
        code: "MOR002",
        level: "warning",
        message: "Line numbers start at 1 — this start line has no effect.",
        field: "startLine",
        fix: { label: "Clear the start line", apply: (s) => ({ ...s, startLine: undefined }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<MoreSpec>[] = [noFiles, invalidStartLine];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
