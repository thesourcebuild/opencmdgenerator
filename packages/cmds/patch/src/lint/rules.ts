import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PatchSpec } from "../spec";
import { flagBool, flagString } from "../pure";

/** -i and the positional patch file are alternatives for the same thing — giving both is ambiguous, same precedent as `@cmdgen/chgrp`'s group/--reference conflict. */
const inputAndPatchFileTogether: LintRule<PatchSpec> = {
  code: "PAT001",
  check(spec) {
    const input = flagString(spec, "input");
    const patchFile = spec.patchFile.trim();
    if (!input || patchFile === "") return [];
    return [
      {
        code: "PAT001",
        level: "warning",
        message: "The patch file is given two ways at once — as -i and as the positional patch file.",
        detail: `Real patch would try to read both — the generated command drops "${patchFile}" from the patch file field so -i=${input} is unambiguously the one used.`,
        flagIds: ["input"],
        field: "patchFile",
        fix: { label: "Clear the patch file field", apply: (s) => ({ ...s, patchFile: "" }) },
      },
    ];
  },
};

/** The one caution-level rule this command needs: applying for real with no safety net at all. */
const noSafetyNet: LintRule<PatchSpec> = {
  code: "PAT002",
  check(spec) {
    if (flagBool(spec, "dryRun") || flagBool(spec, "backup")) return [];
    return [
      {
        code: "PAT002",
        level: "warning",
        message: "Applying a patch with neither --dry-run nor --backup set can corrupt the target file if it doesn't apply cleanly.",
        detail: "Try --dry-run first to check the patch applies cleanly, or --backup to keep an .orig copy in case it doesn't.",
        flagIds: ["dryRun", "backup"],
        fix: { label: "Add --dry-run first", apply: (s) => ({ ...s, flags: { ...s.flags, dryRun: true } }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<PatchSpec>[] = [inputAndPatchFileTogether, noSafetyNet];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
