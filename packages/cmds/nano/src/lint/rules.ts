import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NanoSpec } from "../spec";

const noFiles: LintRule<NanoSpec> = {
  code: "NAN001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "NAN001",
        level: "info",
        message: "No files given — nano will open with an empty, unnamed buffer.",
        field: "files",
      },
    ];
  },
};

const multipleFilesOpenSeparateBuffers: LintRule<NanoSpec> = {
  code: "NAN002",
  check(spec) {
    const files = spec.files.filter((f) => f.trim() !== "");
    if (files.length <= 1) return [];
    return [
      {
        code: "NAN002",
        level: "info",
        message: "Multiple files open in separate buffers, switchable with M-,/M-. (Prev/Next Buffer).",
        field: "files",
      },
    ];
  },
};

export const RULES: readonly LintRule<NanoSpec>[] = [noFiles, multipleFilesOpenSeparateBuffers];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
