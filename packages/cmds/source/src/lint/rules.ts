import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SourceSpec } from "../spec";

const noFile: LintRule<SourceSpec> = {
  code: "SRC001",
  check(spec) {
    if (spec.file.trim() !== "") return [];
    return [
      {
        code: "SRC001",
        level: "error",
        message: "No script to source.",
        detail: "source with nothing to load does nothing — give it a script to run in the current shell.",
        field: "file",
      },
    ];
  },
};

const argsScopeNote: LintRule<SourceSpec> = {
  code: "SRC002",
  check(spec) {
    if (!spec.args.some((a) => a.trim() !== "")) return [];
    return [
      {
        code: "SRC002",
        level: "info",
        message: "Arguments after the script are exposed inside it as $1, $2, ... — they are not added to the current shell's own argument list.",
        field: "args",
      },
    ];
  },
};

export const RULES: readonly LintRule<SourceSpec>[] = [noFile, argsScopeNote];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
