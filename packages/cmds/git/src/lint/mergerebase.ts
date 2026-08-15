import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { controlToken, flagBool, flagString } from "../pure";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * The `GIT015`-style control-vs-other-fields rule (see `lint/rules.ts`), applied
 * to merge/rebase/cherry-pick instead of revert. Each branch checks its OWN
 * "other fields" (merge: branches/message; rebase: upstream/branch/onto;
 * cherry-pick: commits) since the three subcommands don't share a field shape.
 */
const controlWithOtherFields: LintRule<GitSpec> = {
  code: "GIT037",
  check(spec) {
    if (spec.subcommand === "merge") {
      if (!controlToken(spec.control)) return [];
      if (nonEmpty(spec.branches).length === 0 && spec.message.trim() === "") return [];
      return [
        {
          code: "GIT037",
          level: "error",
          message: `--${spec.control} takes no branches or message — real git rejects combining it with anything else.`,
          field: "control",
          fix: {
            label: "Clear branches and message",
            apply: (s) => (s.subcommand === "merge" ? { ...s, branches: [], message: "" } : s),
          },
        },
      ];
    }

    if (spec.subcommand === "rebase") {
      if (!controlToken(spec.control)) return [];
      if (spec.upstream.trim() === "" && spec.branch.trim() === "" && spec.onto.trim() === "") return [];
      return [
        {
          code: "GIT037",
          level: "error",
          message: `--${spec.control} takes no upstream, branch, or onto — real git rejects combining it with anything else.`,
          field: "control",
          fix: {
            label: "Clear upstream, branch, and onto",
            apply: (s) => (s.subcommand === "rebase" ? { ...s, upstream: "", branch: "", onto: "" } : s),
          },
        },
      ];
    }

    if (spec.subcommand === "cherry-pick") {
      if (!controlToken(spec.control)) return [];
      if (nonEmpty(spec.commits).length === 0) return [];
      return [
        {
          code: "GIT037",
          level: "error",
          message: `--${spec.control} takes no commits — real git rejects combining it with anything else.`,
          field: "control",
          fix: {
            label: "Clear commits",
            apply: (s) => (s.subcommand === "cherry-pick" ? { ...s, commits: [] } : s),
          },
        },
      ];
    }

    return [];
  },
};

/**
 * Unconditional advisory, not tied to any specific flag — same idea as rm's
 * inherent-danger rule (`RM005` in `@cmdgen/rm`'s `lint/rules.ts`). Whether a
 * given rebase is actually dangerous (rewriting commits nobody else has vs.
 * ones already pushed/shared) can't be told from the spec alone, so this
 * fires any time a rebase would actually run at all.
 */
const rebaseRewritesHistory: LintRule<GitSpec> = {
  code: "GIT038",
  check(spec) {
    if (spec.subcommand !== "rebase" || spec.control !== "none") return [];
    return [
      {
        code: "GIT038",
        level: "warning",
        message: "Rebasing rewrites the SHA of every commit it replays.",
        detail: "Anyone who already has the old commits — most commonly because they were already pushed and shared — will diverge from the rewritten history. Coordinate before rebasing anything already shared.",
      },
    ];
  },
};

const rebaseRootWithUpstream: LintRule<GitSpec> = {
  code: "GIT039",
  check(spec) {
    if (spec.subcommand !== "rebase" || !flagBool(spec, "root")) return [];
    if (spec.upstream.trim() === "") return [];
    return [
      {
        code: "GIT039",
        level: "warning",
        message: "--root already replays every reachable commit — combining it with an explicit upstream is contradictory.",
        detail: "--root ignores the given upstream in practice; clear one of the two to make the intent unambiguous.",
        flagIds: ["root"],
        field: "upstream",
        fix: {
          label: "Clear upstream",
          apply: (s) => (s.subcommand === "rebase" ? { ...s, upstream: "" } : s),
        },
      },
    ];
  },
};

const mergeSquashInfo: LintRule<GitSpec> = {
  code: "GIT040",
  check(spec) {
    if (spec.subcommand !== "merge" || !flagBool(spec, "squash")) return [];
    return [
      {
        code: "GIT040",
        level: "info",
        message: "--squash produces no merge commit and does not record the merged branch as a parent.",
        detail: "The result looks like a single ordinary commit — git keeps no record afterward that a merge ever happened, which surprises people expecting normal merge history.",
        flagIds: ["squash"],
      },
    ];
  },
};

const mergeStrategyOptionOursOrTheirs: LintRule<GitSpec> = {
  code: "GIT041",
  check(spec) {
    if (spec.subcommand !== "merge") return [];
    const value = flagString(spec, "strategyOption")?.trim();
    if (value !== "ours" && value !== "theirs") return [];
    return [
      {
        code: "GIT041",
        level: "warning",
        message: `-X ${value} silently drops the losing side's conflicting hunks instead of merging them.`,
        detail: "This only affects hunks that actually conflict, but those are dropped outright, with no markers and nothing left to review.",
        flagIds: ["strategyOption"],
      },
    ];
  },
};

const cherryPickSkipCaution: LintRule<GitSpec> = {
  code: "GIT042",
  check(spec) {
    if (spec.subcommand !== "cherry-pick" || spec.control !== "skip") return [];
    return [
      {
        code: "GIT042",
        level: "warning",
        message: "--skip permanently drops this pick's changes from the cherry-pick sequence.",
        field: "control",
      },
    ];
  },
};

export const MERGE_REBASE_RULES: readonly LintRule<GitSpec>[] = [
  controlWithOtherFields,
  rebaseRewritesHistory,
  rebaseRootWithUpstream,
  mergeSquashInfo,
  mergeStrategyOptionOursOrTheirs,
  cherryPickSkipCaution,
];

export const MERGE_REBASE_RULE_CODES: readonly string[] = MERGE_REBASE_RULES.map((r) => r.code);
