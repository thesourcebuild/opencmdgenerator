import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { flagBool } from "../pure";

/** --no-index compares two arbitrary files outside any repository — real git rejects combining it with a revision range. */
const diffNoIndexWithRange: LintRule<GitSpec> = {
  code: "GIT033",
  check(spec) {
    if (spec.subcommand !== "diff" || !flagBool(spec, "noIndex")) return [];
    if (spec.revisionRange.trim() === "") return [];
    return [
      {
        code: "GIT033",
        level: "error",
        message: "--no-index cannot be combined with a revision range — real git rejects this.",
        detail: "--no-index compares two arbitrary files outside any repository; a revision range only makes sense inside one.",
        flagIds: ["noIndex"],
        field: "revisionRange",
        fix: {
          label: "Clear the revision range",
          apply: (s) => (s.subcommand === "diff" ? { ...s, revisionRange: "" } : s),
        },
      },
    ];
  },
};

/** --staged always diffs the index against HEAD — real git rejects combining it with a revision range too. */
const diffStagedWithRange: LintRule<GitSpec> = {
  code: "GIT034",
  check(spec) {
    if (spec.subcommand !== "diff" || !flagBool(spec, "staged")) return [];
    if (spec.revisionRange.trim() === "") return [];
    return [
      {
        code: "GIT034",
        level: "error",
        message: "--staged cannot be combined with a revision range — real git rejects this.",
        detail: "--staged always diffs the index against HEAD; a range specifies something else to diff against instead.",
        flagIds: ["staged"],
        field: "revisionRange",
        fix: {
          label: "Clear the revision range",
          apply: (s) => (s.subcommand === "diff" ? { ...s, revisionRange: "" } : s),
        },
      },
    ];
  },
};

/** Two-dot (`A..B`, direct tip diff) vs. three-dot (`A...B`, merge-base diff) notation differ by one character but produce materially different results — worth naming which is active. */
const diffRangeNotation: LintRule<GitSpec> = {
  code: "GIT035",
  check(spec) {
    if (spec.subcommand !== "diff") return [];
    const range = spec.revisionRange.trim();
    if (range === "") return [];
    if (range.includes("...")) {
      return [
        {
          code: "GIT035",
          level: "info",
          message: `"${range}" uses three-dot notation — diffs against the merge base, not the two tips directly.`,
          field: "revisionRange",
        },
      ];
    }
    if (range.includes("..")) {
      return [
        {
          code: "GIT035",
          level: "info",
          message: `"${range}" uses two-dot notation — diffs the two tips directly, not via a merge base.`,
          field: "revisionRange",
        },
      ];
    }
    return [];
  },
};

/** -E/-F/-P are mutually exclusive regex modes — real git rejects combining any two. */
const grepRegexModeExclusivity: LintRule<GitSpec> = {
  code: "GIT036",
  check(spec) {
    if (spec.subcommand !== "grep") return [];
    const modes = (["extendedRegexp", "fixedStrings", "perlRegexp"] as const).filter((id) => flagBool(spec, id));
    if (modes.length < 2) return [];
    return [
      {
        code: "GIT036",
        level: "error",
        message: "-E, -F, and -P are mutually exclusive — real git rejects combining any two.",
        flagIds: [...modes],
      },
    ];
  },
};

export const DIFFGREP_RULES: readonly LintRule<GitSpec>[] = [
  diffNoIndexWithRange,
  diffStagedWithRange,
  diffRangeNotation,
  grepRegexModeExclusivity,
];
