import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SedSpec } from "../spec";
import { expressions } from "../pure";

const noScript: LintRule<SedSpec> = {
  code: "SED001",
  check(spec) {
    if (expressions(spec).length > 0) return [];
    return [{ code: "SED001", level: "error", message: "No sed script/expression to run.", field: "script" }];
  },
};

/**
 * -i with an empty backup suffix edits every file in place with no copy of
 * the original left behind — irreversible. Real GNU sed's own default
 * (bare -i, no argument) is exactly this, so the fix nudges toward the
 * safer alternative (a default ".bak" suffix) rather than merely warning,
 * mirroring `@cmdgen/curl`'s insecure→fix and `@cmdgen/git`'s
 * push --force→--force-with-lease pattern.
 */
const inPlaceWithNoBackup: LintRule<SedSpec> = {
  code: "SED002",
  check(spec) {
    if (!spec.inPlace || spec.backupSuffix.trim() !== "") return [];
    return [
      {
        code: "SED002",
        level: "destructive",
        message: "-i with no backup suffix overwrites each file in place with no way back.",
        detail: "Unlike a plain sed invocation (which only prints to stdout), -i with an empty suffix replaces the original file's content permanently. Setting a suffix keeps a copy of the original alongside it.",
        field: "backupSuffix",
        fix: { label: "Back up originals with a .bak suffix", apply: (s) => ({ ...s, backupSuffix: ".bak" }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<SedSpec>[] = [noScript, inPlaceWithNoBackup];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
