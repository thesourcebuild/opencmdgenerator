import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { DdSpec } from "../spec";

const noInputFile: LintRule<DdSpec> = {
  code: "DD001",
  check(spec) {
    if (spec.inputFile.trim() !== "") return [];
    const diagnostic: Diagnostic<DdSpec> = {
      code: "DD001",
      level: "error",
      message: "dd needs an input source (if=).",
      field: "inputFile",
    };
    return [diagnostic];
  },
};

const noOutputFile: LintRule<DdSpec> = {
  code: "DD002",
  check(spec) {
    if (spec.outputFile.trim() !== "") return [];
    const diagnostic: Diagnostic<DdSpec> = {
      code: "DD002",
      level: "error",
      message: "dd needs an output destination (of=).",
      field: "outputFile",
    };
    return [diagnostic];
  },
};

/**
 * Reading and writing the same file with dd is legal syntax and a classic
 * real-world footgun — at best a no-op, at worst a corrupted or truncated
 * file, depending on block size, conv options, and what if=/of= actually
 * are. A warning, not an error, since it's not always wrong (some conv
 * options are specifically meant to be applied in place). No mechanical
 * `fix`: clearing either field is an equally plausible correction, so none
 * is offered — same reasoning as `@cmdgen/mount`'s MOUNT001.
 */
const sameInputAndOutput: LintRule<DdSpec> = {
  code: "DD003",
  check(spec) {
    const inputFile = spec.inputFile.trim();
    const outputFile = spec.outputFile.trim();
    if (inputFile === "" || outputFile === "" || inputFile !== outputFile) return [];
    const diagnostic: Diagnostic<DdSpec> = {
      code: "DD003",
      level: "warning",
      message: "Reading and writing the same file with dd will likely corrupt it.",
      field: "outputFile",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<DdSpec>[] = [noInputFile, noOutputFile, sameInputAndOutput];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
