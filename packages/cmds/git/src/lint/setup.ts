import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { flagString } from "../pure";

// ── Setup ──────────────────────────────────────────────────────────────────

/**
 * `clone` itself has no rule here — every one of its flags is `danger: "none"`
 * (it only ever writes into a new/empty target, nothing to warn about). Only
 * `init`'s `--separate-git-dir` carries a real footgun, matching the pattern
 * every other `danger`-tagged flag in this app gets a corresponding rule for.
 */
const initSeparateGitDirCaution: LintRule<GitSpec> = {
  code: "GIT016",
  check(spec) {
    if (spec.subcommand !== "init" || !flagString(spec, "separateGitDir")) return [];
    return [
      {
        code: "GIT016",
        level: "warning",
        message: "--separate-git-dir relocates .git's contents out of the working tree.",
        detail: "Moving or deleting either half afterward without updating the other breaks the link between them.",
        flagIds: ["separateGitDir"],
      },
    ];
  },
};

export const SETUP_RULES: readonly LintRule<GitSpec>[] = [initSeparateGitDirCaution];
