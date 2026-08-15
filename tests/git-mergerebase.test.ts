import { describe, expect, it } from "vitest";
import { lint as lintGeneric, validateCatalogue, type Arg } from "@cmdgen/engine";
import {
  createSpec,
  describeSpec,
  renderOneLine,
  type GitCherryPickSpec,
  type GitMergeSpec,
  type GitRebaseSpec,
  type GitSpec,
  CHERRY_PICK_FLAGS,
  MERGE_FLAGS,
  MERGE_REBASE_PRESETS,
  MERGE_REBASE_RULES,
  REBASE_FLAGS,
  buildCherryPickArgv,
  buildMergeArgv,
  buildRebaseArgv,
  getMergeRebasePreset,
} from "@cmdgen/git";

/**
 * `buildArgv` in `build/argv.ts` doesn't dispatch to merge/rebase/cherry-pick
 * yet (that file is shared and off-limits for this batch — see the plan's
 * "Do NOT touch" list), so this mirrors its exact shape locally: the bare
 * subcommand token, then this subcommand's own build function's output.
 */
function line(spec: GitSpec): string {
  const args: Arg[] = [{ text: spec.subcommand, role: "value" }];
  switch (spec.subcommand) {
    case "merge":
      args.push(...buildMergeArgv(spec));
      break;
    case "rebase":
      args.push(...buildRebaseArgv(spec));
      break;
    case "cherry-pick":
      args.push(...buildCherryPickArgv(spec));
      break;
    default:
      break;
  }
  return renderOneLine({ binary: "git", args }, { shell: spec.shell });
}

/**
 * `lint()` re-exported from `@cmdgen/git` only runs `RULES` from `lint/rules.ts`,
 * which doesn't include `MERGE_REBASE_RULES` yet for the same reason as above —
 * run the generic engine `lint()` directly against this batch's own rule set.
 */
function lintMergeRebase(spec: GitSpec) {
  return lintGeneric(spec, MERGE_REBASE_RULES);
}

const mergeSpec = (partial: Partial<GitMergeSpec> = {}): GitMergeSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "merge" }) as GitMergeSpec),
  ...partial,
});
const rebaseSpec = (partial: Partial<GitRebaseSpec> = {}): GitRebaseSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "rebase" }) as GitRebaseSpec),
  ...partial,
});
const cherryPickSpec = (partial: Partial<GitCherryPickSpec> = {}): GitCherryPickSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "cherry-pick" }) as GitCherryPickSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every Category 7 catalogue is internally consistent", () => {
    expect(validateCatalogue(MERGE_FLAGS)).toEqual([]);
    expect(validateCatalogue(REBASE_FLAGS)).toEqual([]);
    expect(validateCatalogue(CHERRY_PICK_FLAGS)).toEqual([]);
  });
});

describe("merge", () => {
  it("renders one branch", () => {
    expect(line(mergeSpec({ branches: ["feature"] }))).toBe("git merge feature");
  });

  it("renders multiple branches in order (octopus merge)", () => {
    expect(line(mergeSpec({ branches: ["a", "b", "c"] }))).toBe("git merge a b c");
  });

  it("skips blank branch entries", () => {
    expect(line(mergeSpec({ branches: ["", "feature", "  "] }))).toBe("git merge feature");
  });

  it("renders with no branches at all when the list is empty", () => {
    expect(line(mergeSpec({ branches: [] }))).toBe("git merge");
  });

  it("renders -m with a quoted message, before the branches", () => {
    expect(line(mergeSpec({ branches: ["feature"], message: "Merge it" }))).toBe("git merge -m 'Merge it' feature");
  });

  it("renders --no-ff / --ff-only", () => {
    expect(line(mergeSpec({ branches: ["feature"], flags: { noFf: true } }))).toBe("git merge --no-ff feature");
    expect(line(mergeSpec({ branches: ["feature"], flags: { ffOnly: true } }))).toBe("git merge --ff-only feature");
  });

  it("renders -X", () => {
    expect(line(mergeSpec({ branches: ["feature"], flags: { strategyOption: "ours" } }))).toBe(
      "git merge --strategy-option=ours feature",
    );
  });

  it("a control action renders alone, disregarding branches and message", () => {
    expect(line(mergeSpec({ branches: ["feature"], message: "x", control: "abort" }))).toBe("git merge --abort");
  });
});

describe("rebase", () => {
  it("renders a bare upstream", () => {
    expect(line(rebaseSpec({ upstream: "main" }))).toBe("git rebase main");
  });

  it("renders upstream then branch", () => {
    expect(line(rebaseSpec({ upstream: "main", branch: "feature" }))).toBe("git rebase main feature");
  });

  it("renders --onto before upstream and branch, in that exact order", () => {
    expect(line(rebaseSpec({ onto: "origin/main", upstream: "main", branch: "feature" }))).toBe(
      "git rebase --onto origin/main main feature",
    );
  });

  it("renders --onto alone when upstream/branch are both empty", () => {
    expect(line(rebaseSpec({ onto: "origin/main" }))).toBe("git rebase --onto origin/main");
  });

  it("renders nothing extra when upstream/branch/onto are all empty", () => {
    expect(line(rebaseSpec({}))).toBe("git rebase");
  });

  it("renders -i", () => {
    expect(line(rebaseSpec({ upstream: "HEAD~3", flags: { interactive: true } }))).toBe("git rebase -i 'HEAD~3'");
  });

  it("renders -f (--force-rebase)", () => {
    expect(line(rebaseSpec({ upstream: "main", flags: { force: true } }))).toBe("git rebase -f main");
  });

  it("a control action renders alone, disregarding upstream/branch/onto", () => {
    expect(line(rebaseSpec({ upstream: "main", branch: "feature", onto: "x", control: "skip" }))).toBe(
      "git rebase --skip",
    );
  });
});

describe("cherry-pick", () => {
  it("renders one commit", () => {
    expect(line(cherryPickSpec({ commits: ["HEAD"] }))).toBe("git cherry-pick HEAD");
  });

  it("renders multiple commits in order (top-to-bottom apply order)", () => {
    expect(line(cherryPickSpec({ commits: ["a", "b", "c"] }))).toBe("git cherry-pick a b c");
  });

  it("skips blank commit entries", () => {
    expect(line(cherryPickSpec({ commits: ["", "HEAD", "  "] }))).toBe("git cherry-pick HEAD");
  });

  it("renders -n (--no-commit)", () => {
    expect(line(cherryPickSpec({ commits: ["HEAD"], flags: { noCommit: true } }))).toBe("git cherry-pick -n HEAD");
  });

  it("renders -m for a merge commit's mainline parent", () => {
    expect(line(cherryPickSpec({ commits: ["HEAD"], flags: { mainline: 1 } }))).toBe(
      "git cherry-pick --mainline=1 HEAD",
    );
  });

  it("a control action renders alone, disregarding commits", () => {
    expect(line(cherryPickSpec({ commits: ["HEAD"], control: "abort" }))).toBe("git cherry-pick --abort");
  });
});

describe("lint", () => {
  it("GIT037 catches merge control combined with branches/message, and the fix clears both", () => {
    const s = mergeSpec({ control: "abort", branches: ["feature"], message: "x" });
    const result = lintMergeRebase(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT037")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitMergeSpec;
    expect(fixed.branches).toEqual([]);
    expect(fixed.message).toBe("");
  });

  it("GIT037 catches rebase control combined with upstream/branch/onto, and the fix clears all three", () => {
    const s = rebaseSpec({ control: "abort", upstream: "main", branch: "feature", onto: "x" });
    const result = lintMergeRebase(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT037")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitRebaseSpec;
    expect(fixed.upstream).toBe("");
    expect(fixed.branch).toBe("");
    expect(fixed.onto).toBe("");
  });

  it("GIT037 catches cherry-pick control combined with commits, and the fix clears commits", () => {
    const s = cherryPickSpec({ control: "abort", commits: ["HEAD"] });
    const result = lintMergeRebase(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT037")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitCherryPickSpec;
    expect(fixed.commits).toEqual([]);
  });

  it("GIT037 does not fire for a control action with nothing else set", () => {
    const result = lintMergeRebase(mergeSpec({ control: "abort" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT037");
  });

  it("GIT038 unconditionally warns whenever a rebase would actually run", () => {
    const result = lintMergeRebase(rebaseSpec({ upstream: "main" }));
    expect(result.diagnostics.find((d) => d.code === "GIT038")!.level).toBe("warning");
  });

  it("GIT038 does not fire for a control action", () => {
    const result = lintMergeRebase(rebaseSpec({ control: "abort" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT038");
  });

  it("GIT039 flags --root combined with an explicit upstream, and the fix clears upstream", () => {
    const s = rebaseSpec({ upstream: "main", flags: { root: true } });
    const result = lintMergeRebase(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT039")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s) as GitRebaseSpec;
    expect(fixed.upstream).toBe("");
  });

  it("GIT039 does not fire for --root with no upstream", () => {
    const result = lintMergeRebase(rebaseSpec({ flags: { root: true } }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT039");
  });

  it("GIT040 notes --squash produces no merge commit", () => {
    const result = lintMergeRebase(mergeSpec({ branches: ["feature"], flags: { squash: true } }));
    expect(result.diagnostics.find((d) => d.code === "GIT040")!.level).toBe("info");
  });

  it("GIT041 flags -X ours/theirs on merge", () => {
    expect(
      lintMergeRebase(mergeSpec({ branches: ["feature"], flags: { strategyOption: "ours" } })).diagnostics.find(
        (d) => d.code === "GIT041",
      )!.level,
    ).toBe("warning");
    expect(
      lintMergeRebase(mergeSpec({ branches: ["feature"], flags: { strategyOption: "theirs" } })).diagnostics.find(
        (d) => d.code === "GIT041",
      )!.level,
    ).toBe("warning");
  });

  it("GIT041 does not fire for other -X values", () => {
    const result = lintMergeRebase(mergeSpec({ branches: ["feature"], flags: { strategyOption: "recursive" } }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT041");
  });

  it("GIT042 flags cherry-pick --skip as a caution", () => {
    const result = lintMergeRebase(cherryPickSpec({ control: "skip" }));
    expect(result.diagnostics.find((d) => d.code === "GIT042")!.level).toBe("warning");
  });
});

describe("presets", () => {
  it("preset ids are unique and don't collide with the existing Category 2/8 preset ids", () => {
    const ids = MERGE_REBASE_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain("stage-everything");
    expect(ids).not.toContain("revert-a-commit");
  });

  it("'Merge a branch' is git merge feature-branch", () => {
    expect(line(getMergeRebasePreset("merge-a-branch")!.apply(mergeSpec()))).toBe("git merge feature-branch");
  });

  it("'Interactive rebase' is git rebase -i HEAD~3", () => {
    expect(line(getMergeRebasePreset("interactive-rebase")!.apply(rebaseSpec()))).toBe("git rebase -i 'HEAD~3'");
  });

  it("'Cherry-pick a commit' is git cherry-pick HEAD", () => {
    expect(line(getMergeRebasePreset("cherry-pick-a-commit")!.apply(cherryPickSpec()))).toBe("git cherry-pick HEAD");
  });

  it("every preset applies and renders without throwing", () => {
    for (const id of ["merge-a-branch", "interactive-rebase", "cherry-pick-a-commit"]) {
      expect(() => line(getMergeRebasePreset(id)!.apply(createSpec({ id: "draft" })))).not.toThrow();
    }
  });
});

describe("describeSpec", () => {
  it("describes merge", () => {
    expect(describeSpec(mergeSpec({ branches: ["feature"] }))).toBe("Merge feature into the current branch.");
  });

  it("describes rebase", () => {
    expect(describeSpec(rebaseSpec({ branch: "feature", upstream: "main" }))).toBe("Rebase feature onto main.");
  });

  it("describes cherry-pick", () => {
    expect(describeSpec(cherryPickSpec({ commits: ["HEAD"] }))).toBe("Apply HEAD onto the current branch.");
  });
});
