import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { flagBool } from "../pure";

// ── Tags ─────────────────────────────────────────────────────────────────

const tagForceDestructive: LintRule<GitSpec> = {
  code: "GIT043",
  check(spec) {
    if (spec.subcommand !== "tag" || spec.action !== "create" || !flagBool(spec, "force")) return [];
    return [
      {
        code: "GIT043",
        level: "destructive",
        message: "-f silently overwrites an existing tag's target.",
        detail: "Tags are meant to be immutable — anyone who already fetched the old target now has a tag that means something different.",
        flagIds: ["force"],
      },
    ];
  },
};

/** Deleting a LOCAL tag is a lesser risk than most destructive actions here: the commit itself stays reachable via the reflog, and no remote is touched. Modeled as a warning, not `destructive`. */
const tagDeleteLocalOnly: LintRule<GitSpec> = {
  code: "GIT044",
  check(spec) {
    if (spec.subcommand !== "tag" || spec.action !== "delete") return [];
    return [
      {
        code: "GIT044",
        level: "warning",
        message: "This only removes the local tag ref.",
        detail: "The commit it pointed to stays reachable — via the reflog if nothing else references it. This is a lesser risk than most destructive actions in this app.",
        field: "action",
      },
    ];
  },
};

const tagDeleteRemoteInfo: LintRule<GitSpec> = {
  code: "GIT045",
  check(spec) {
    if (spec.subcommand !== "tag" || spec.action !== "delete") return [];
    return [
      {
        code: "GIT045",
        level: "info",
        message: "This does not touch any remote tag.",
        detail: "A common misconception — deleting a tag someone else already fetched needs its own step: git push --delete <remote> <name>.",
        field: "action",
      },
    ];
  },
};

const tagCommitSetOnDeleteOrVerify: LintRule<GitSpec> = {
  code: "GIT046",
  check(spec) {
    if (spec.subcommand !== "tag") return [];
    if (spec.action !== "delete" && spec.action !== "verify") return [];
    if (spec.commit.trim() === "") return [];
    return [
      {
        code: "GIT046",
        level: "warning",
        message: `A commit is set, but ${spec.action} never takes one.`,
        detail: "Neither delete nor verify accepts a target commit — this looks like a leftover from switching from create rather than something meaningful.",
        field: "commit",
        fix: { label: "Clear commit", apply: (s) => (s.subcommand === "tag" ? { ...s, commit: "" } : s) },
      },
    ];
  },
};

export const TAGS_RULES: readonly LintRule<GitSpec>[] = [
  tagForceDestructive,
  tagDeleteLocalOnly,
  tagDeleteRemoteInfo,
  tagCommitSetOnDeleteOrVerify,
];
