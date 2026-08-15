import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { flagBool, flagString, setFlags } from "../pure";

// ── fetch ───────────────────────────────────────────────────────────────────

const fetchAllWithRemote: LintRule<GitSpec> = {
  code: "GIT025",
  check(spec) {
    if (spec.subcommand !== "fetch" || !flagBool(spec, "all")) return [];
    if (spec.remote.trim() === "") return [];
    return [
      {
        code: "GIT025",
        level: "error",
        message: "--all cannot be combined with an explicit remote — real git rejects this.",
        detail: "--all already fetches from every remote; naming one specific remote at the same time is contradictory.",
        flagIds: ["all"],
        field: "remote",
        fix: {
          label: "Clear remote",
          apply: (s) => (s.subcommand === "fetch" ? { ...s, remote: "" } : s),
        },
      },
    ];
  },
};

// ── pull ────────────────────────────────────────────────────────────────────

/**
 * `rebase` can be set bare (boolean `true`, the common `git pull --rebase`
 * form — see `argv/remote.ts`) or as an explicit string value; `--rebase=false`
 * explicitly opts OUT of rewriting anything, so that value is excluded here.
 */
const pullRebaseRisk: LintRule<GitSpec> = {
  code: "GIT026",
  check(spec) {
    if (spec.subcommand !== "pull") return [];
    const bare = flagBool(spec, "rebase");
    const value = flagString(spec, "rebase");
    if (!bare && (!value || value === "false")) return [];
    return [
      {
        code: "GIT026",
        level: "warning",
        message: "--rebase rewrites local commits the same way a plain rebase does.",
        detail: "Anyone else who already pulled the commits being rewritten will diverge from this branch afterward.",
        flagIds: ["rebase"],
      },
    ];
  },
};

// ── push ────────────────────────────────────────────────────────────────────

const pushForceRisk: LintRule<GitSpec> = {
  code: "GIT027",
  check(spec) {
    if (spec.subcommand !== "push" || !flagBool(spec, "force")) return [];
    return [
      {
        code: "GIT027",
        level: "destructive",
        message: "--force can overwrite the remote ref, permanently discarding commits someone else already pushed.",
        detail: "--force-with-lease is the safer alternative — it refuses if the remote ref moved since your last fetch.",
        flagIds: ["force"],
        fix: {
          label: "Use --force-with-lease instead",
          apply: (s) => (s.subcommand === "push" ? setFlags(s, { force: undefined, forceWithLease: true }) : s),
        },
      },
    ];
  },
};

/** Its own dedicated rule, deliberately not folded into `pushForceRisk` — the single most dangerous flag in this category. */
const pushMirrorRisk: LintRule<GitSpec> = {
  code: "GIT028",
  check(spec) {
    if (spec.subcommand !== "push" || !flagBool(spec, "mirror")) return [];
    return [
      {
        code: "GIT028",
        level: "destructive",
        message: "--mirror makes the remote exactly match this repository, deleting any remote ref absent locally.",
        detail: "Can delete remote branches and tags you never intended to touch — review what's local before running this.",
        flagIds: ["mirror"],
      },
    ];
  },
};

/** No fix offered — deleting the named ref is exactly what was asked for; there's nothing mechanical to correct. */
const pushDeleteRisk: LintRule<GitSpec> = {
  code: "GIT029",
  check(spec) {
    if (spec.subcommand !== "push" || !flagBool(spec, "delete")) return [];
    return [
      {
        code: "GIT029",
        level: "destructive",
        message: "--delete removes the named ref(s) from the remote entirely.",
        detail: "Not a local operation and not reversible from here — anyone else tracking that ref loses it too.",
        flagIds: ["delete"],
      },
    ];
  },
};

const pushAllRisk: LintRule<GitSpec> = {
  code: "GIT030",
  check(spec) {
    if (spec.subcommand !== "push" || !flagBool(spec, "all")) return [];
    return [
      {
        code: "GIT030",
        level: "warning",
        message: "--all pushes every local branch.",
        detail: "Easy to accidentally publish a local-only or work-in-progress branch you didn't mean to share.",
        flagIds: ["all"],
      },
    ];
  },
};

export const REMOTE_RULES: readonly LintRule<GitSpec>[] = [
  fetchAllWithRemote,
  pullRebaseRisk,
  pushForceRisk,
  pushMirrorRisk,
  pushDeleteRisk,
  pushAllRisk,
];

export const REMOTE_RULE_CODES: readonly string[] = REMOTE_RULES.map((r) => r.code);
