import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TeeSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

/**
 * Without -a, tee truncates every listed target file before writing —
 * anything already there is silently gone. Same "flag a silent-overwrite
 * default" pattern as `@cmdgen/mv`'s no-clobber-adjacent rules.
 */
const overwritesWithoutAppend: LintRule<TeeSpec> = {
  code: "TEE001",
  check(spec) {
    const files = spec.files.filter((f) => f.trim() !== "");
    if (files.length === 0 || flagBool(spec, "append")) return [];
    return [
      {
        code: "TEE001",
        level: "destructive",
        message: "Without -a, each target file's existing content is overwritten.",
        detail: "tee truncates every listed file before writing anything to it — whatever was already there is gone. Add -a/--append to add to the end instead.",
        field: "files",
        fix: { label: "Add -a to append instead of overwriting", apply: (s) => setFlag(s, "append", true) },
      },
    ];
  },
};

export const RULES: readonly LintRule<TeeSpec>[] = [overwritesWithoutAppend];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
