import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ChgrpSpec } from "../spec";
import { flagString } from "../pure";

const noPaths: LintRule<ChgrpSpec> = {
  code: "CGP001",
  check(spec) {
    if (spec.paths.some((p) => p.trim() !== "")) return [];
    return [{ code: "CGP001", level: "error", message: "No files to change the group of.", field: "paths" }];
  },
};

const noGroupSource: LintRule<ChgrpSpec> = {
  code: "CGP002",
  check(spec) {
    if (spec.group.trim() !== "" || flagString(spec, "reference")) return [];
    return [
      {
        code: "CGP002",
        level: "error",
        message: "Nothing to change the group to.",
        detail: "Give a group (e.g. staff) or --reference an existing file — chgrp needs one or the other.",
        field: "group",
      },
    ];
  },
};

const groupAndReferenceTogether: LintRule<ChgrpSpec> = {
  code: "CGP003",
  check(spec) {
    const reference = flagString(spec, "reference");
    if (spec.group.trim() === "" || !reference) return [];
    return [
      {
        code: "CGP003",
        level: "error",
        message: "Group and --reference are mutually exclusive.",
        detail: `Real chgrp accepts a group or --reference=${reference}, never both — the generated command drops the "${spec.group.trim()}" group text so it isn't misread as a file.`,
        flagIds: ["reference"],
        field: "group",
        fix: { label: "Clear the group text", apply: (s) => ({ ...s, group: "" }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<ChgrpSpec>[] = [noPaths, noGroupSource, groupAndReferenceTogether];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
