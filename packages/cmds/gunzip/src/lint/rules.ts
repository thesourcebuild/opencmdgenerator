import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { GunzipSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

function validFiles(spec: GunzipSpec): string[] {
  return spec.files.map((f) => f.trim()).filter((f) => f !== "");
}

/**
 * gunzip's single most surprising default: decompressing a .gz file REPLACES
 * it on disk with the decompressed file — the .gz is deleted the moment the
 * operation finishes. -k is the only thing that stops that. -l only inspects
 * the archive and never decompresses anything, so nothing is at risk then —
 * same shape as `@cmdgen/gzip`'s GZP001, mirrored in the other direction.
 */
const keepFootgun: LintRule<GunzipSpec> = {
  code: "GUZ001",
  check(spec) {
    if (validFiles(spec).length === 0) return [];
    if (flagBool(spec, "list") || flagBool(spec, "keep")) return [];
    return [
      {
        code: "GUZ001",
        level: "destructive",
        message: "Without -k, each .gz file is deleted once it's decompressed.",
        detail:
          "gunzip replaces file.gz with the decompressed file and removes file.gz — there is no prompt and no way back short of recompressing.",
        flagIds: ["keep"],
        field: "files",
        fix: { label: "Add -k / --keep", apply: (s) => setFlag(s, "keep", true) },
      },
    ];
  },
};

/** -l only lists — nothing is decompressed, so -k has nothing to keep. */
const keepWithList: LintRule<GunzipSpec> = {
  code: "GUZ002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<GunzipSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "GUZ002",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} has no effect together with ${defB ? flagLabel(defB) : b}.`,
        detail: "-l only inspects the archive and never decompresses anything, so there is nothing for -k to keep.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<GunzipSpec>[] = [keepFootgun, keepWithList];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
