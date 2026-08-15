import { describe, expect, it } from "vitest";
import { validateCatalogue } from "@cmdgen/engine";
import {
  ADD_FLAGS,
  COMMIT_FLAGS,
  MV_FLAGS,
  RESET_FLAGS,
  RESTORE_FLAGS,
  REVERT_FLAGS,
  RM_FLAGS,
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type GitAddSpec,
  type GitCommitSpec,
  type GitMvSpec,
  type GitResetSpec,
  type GitRestoreSpec,
  type GitRevertSpec,
  type GitRmSpec,
  type GitSpec,
} from "@cmdgen/git";

const line = (spec: GitSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const addSpec = (partial: Partial<GitAddSpec> = {}): GitAddSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "add" }) as GitAddSpec),
  ...partial,
});
const commitSpec = (partial: Partial<GitCommitSpec> = {}): GitCommitSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "commit" }) as GitCommitSpec),
  ...partial,
});
const rmSpec = (partial: Partial<GitRmSpec> = {}): GitRmSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "rm" }) as GitRmSpec),
  ...partial,
});
const mvSpec = (partial: Partial<GitMvSpec> = {}): GitMvSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "mv" }) as GitMvSpec),
  ...partial,
});
const restoreSpec = (partial: Partial<GitRestoreSpec> = {}): GitRestoreSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "restore" }) as GitRestoreSpec),
  ...partial,
});
const resetSpec = (partial: Partial<GitResetSpec> = {}): GitResetSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "reset" }) as GitResetSpec),
  ...partial,
});
const revertSpec = (partial: Partial<GitRevertSpec> = {}): GitRevertSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "revert" }) as GitRevertSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every Category 2/8 catalogue is internally consistent", () => {
    expect(validateCatalogue(ADD_FLAGS)).toEqual([]);
    expect(validateCatalogue(COMMIT_FLAGS)).toEqual([]);
    expect(validateCatalogue(RM_FLAGS)).toEqual([]);
    expect(validateCatalogue(MV_FLAGS)).toEqual([]);
    expect(validateCatalogue(RESTORE_FLAGS)).toEqual([]);
    expect(validateCatalogue(RESET_FLAGS)).toEqual([]);
    expect(validateCatalogue(REVERT_FLAGS)).toEqual([]);
  });
});

describe("add", () => {
  it("renders a bare add with one path", () => {
    expect(line(addSpec({ paths: ["file.txt"] }))).toBe("git add -- file.txt");
  });

  it("renders multiple paths in order", () => {
    expect(line(addSpec({ paths: ["a.txt", "b.txt"] }))).toBe("git add -- a.txt b.txt");
  });

  it("skips blank path entries", () => {
    expect(line(addSpec({ paths: ["", "file.txt", "  "] }))).toBe("git add -- file.txt");
  });

  it("renders with no paths at all when the list is empty", () => {
    expect(line(addSpec({ paths: [] }))).toBe("git add");
  });

  it("renders -A/-u/-f/-p flags before the -- separator", () => {
    expect(line(addSpec({ paths: ["."], flags: { all: true } }))).toBe("git add -A -- .");
    expect(line(addSpec({ paths: ["."], flags: { force: true } }))).toBe("git add -f -- .");
  });
});

describe("commit", () => {
  it("renders -m with a quoted message", () => {
    expect(line(commitSpec({ message: "Fix the thing" }))).toBe("git commit -m 'Fix the thing'");
  });

  it("renders paths after -- following the message", () => {
    expect(line(commitSpec({ message: "Fix it", paths: ["a.ts"] }))).toBe("git commit -m 'Fix it' -- a.ts");
  });

  it("renders --amend --no-edit", () => {
    expect(line(commitSpec({ flags: { amend: true, noEdit: true } }))).toBe("git commit --amend --no-edit");
  });

  it("renders with no message at all when blank", () => {
    expect(line(commitSpec({ message: "" }))).toBe("git commit");
  });
});

describe("rm", () => {
  it("renders a bare rm with one path", () => {
    expect(line(rmSpec({ paths: ["old.txt"] }))).toBe("git rm -- old.txt");
  });

  it("renders --cached before the separator", () => {
    expect(line(rmSpec({ paths: ["old.txt"], flags: { cached: true } }))).toBe("git rm --cached -- old.txt");
  });

  it("renders -f", () => {
    expect(line(rmSpec({ paths: ["old.txt"], flags: { force: true } }))).toBe("git rm -f -- old.txt");
  });
});

describe("mv", () => {
  it("renders one source and a destination, no -- separator", () => {
    expect(line(mvSpec({ sources: ["old.txt"], destination: "new.txt" }))).toBe("git mv old.txt new.txt");
  });

  it("renders multiple sources before the destination", () => {
    expect(line(mvSpec({ sources: ["a.txt", "b.txt"], destination: "dir/" }))).toBe("git mv a.txt b.txt dir/");
  });

  it("renders -f", () => {
    expect(line(mvSpec({ sources: ["a.txt"], destination: "b.txt", flags: { force: true } }))).toBe(
      "git mv -f a.txt b.txt",
    );
  });
});

describe("restore", () => {
  it("renders a bare restore (worktree discard) with no explicit flags", () => {
    expect(line(restoreSpec({ paths: ["a.txt"] }))).toBe("git restore -- a.txt");
  });

  it("renders --staged when checked", () => {
    expect(line(restoreSpec({ paths: ["a.txt"], staged: true }))).toBe("git restore --staged -- a.txt");
  });

  it("renders --worktree when explicitly checked", () => {
    expect(line(restoreSpec({ paths: ["a.txt"], worktree: true }))).toBe("git restore --worktree -- a.txt");
  });

  it("renders --staged --worktree --source together", () => {
    expect(line(restoreSpec({ paths: ["a.txt"], staged: true, worktree: true, source: "origin/main" }))).toBe(
      "git restore --staged --worktree --source=origin/main -- a.txt",
    );
  });
});

describe("reset", () => {
  it("renders the mode flag explicitly, even the default mixed", () => {
    expect(line(resetSpec({}))).toBe("git reset --mixed");
  });

  it("renders --hard with a commit", () => {
    expect(line(resetSpec({ mode: "hard", commit: "HEAD~1" }))).toBe("git reset --hard 'HEAD~1'");
  });

  it("renders the path-scoped form with no mode flag at all", () => {
    expect(line(resetSpec({ paths: ["a.txt"] }))).toBe("git reset -- a.txt");
  });

  it("renders the path-scoped form with a commit too", () => {
    expect(line(resetSpec({ commit: "HEAD~1", paths: ["a.txt"] }))).toBe("git reset 'HEAD~1' -- a.txt");
  });
});

describe("revert", () => {
  it("renders one commit", () => {
    expect(line(revertSpec({ commits: ["HEAD"] }))).toBe("git revert HEAD");
  });

  it("renders multiple commits in order", () => {
    expect(line(revertSpec({ commits: ["a", "b"] }))).toBe("git revert a b");
  });

  it("renders --no-commit", () => {
    expect(line(revertSpec({ commits: ["HEAD"], flags: { noCommit: true } }))).toBe("git revert -n HEAD");
  });

  it("a control action renders alone, disregarding commits", () => {
    expect(line(revertSpec({ commits: ["HEAD"], control: "abort" }))).toBe("git revert --abort");
  });
});

describe("lint", () => {
  it("GIT001 catches add with no paths", () => {
    const result = lint(addSpec({ paths: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("GIT001");
    expect(result.diagnostics.find((d) => d.code === "GIT001")!.level).toBe("error");
  });

  it("GIT003 catches commit with no message", () => {
    const result = lint(commitSpec({ message: "" }));
    expect(result.diagnostics.find((d) => d.code === "GIT003")!.level).toBe("error");
  });

  it("GIT004 catches -a combined with explicit paths, and the fix removes -a", () => {
    const s = commitSpec({ message: "x", paths: ["a.ts"], flags: { all: true } });
    const result = lint(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT004")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("GIT004");
  });

  it("GIT007 flags rm without --cached as destructive", () => {
    const result = lint(rmSpec({ paths: ["a.txt"] }));
    expect(result.diagnostics.find((d) => d.code === "GIT007")!.level).toBe("destructive");
  });

  it("GIT007 does not fire with --cached", () => {
    const result = lint(rmSpec({ paths: ["a.txt"], flags: { cached: true } }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT007");
  });

  it("GIT008 flags rm -f as destructive", () => {
    const result = lint(rmSpec({ paths: ["a.txt"], flags: { force: true } }));
    expect(result.diagnostics.find((d) => d.code === "GIT008")!.level).toBe("destructive");
  });

  it("GIT009 flags mv -f as destructive", () => {
    const result = lint(mvSpec({ sources: ["a"], destination: "b", flags: { force: true } }));
    expect(result.diagnostics.find((d) => d.code === "GIT009")!.level).toBe("destructive");
  });

  it("GIT010 flags a bare restore (worktree default) as destructive", () => {
    const result = lint(restoreSpec({ paths: ["a.txt"] }));
    expect(result.diagnostics.find((d) => d.code === "GIT010")!.level).toBe("destructive");
  });

  it("GIT010 does not fire for a staged-only restore", () => {
    const result = lint(restoreSpec({ paths: ["a.txt"], staged: true }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT010");
  });

  it("GIT011 flags reset --hard as destructive", () => {
    const result = lint(resetSpec({ mode: "hard" }));
    expect(result.diagnostics.find((d) => d.code === "GIT011")!.level).toBe("destructive");
  });

  it("GIT013 flags a non-default mode combined with paths as an error, and the fix resets mode", () => {
    const s = resetSpec({ mode: "hard", paths: ["a.txt"] });
    const result = lint(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT013")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitResetSpec;
    expect(fixed.mode).toBe("mixed");
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("GIT013");
  });

  it("GIT014 flags --skip on revert as a warning", () => {
    const result = lint(revertSpec({ control: "skip" }));
    expect(result.diagnostics.find((d) => d.code === "GIT014")!.level).toBe("warning");
  });

  it("GIT015 flags a control action combined with commits, and the fix clears commits", () => {
    const s = revertSpec({ control: "abort", commits: ["HEAD"] });
    const result = lint(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT015")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitRevertSpec;
    expect(fixed.commits).toEqual([]);
  });

  it("a clean add spec has no diagnostics", () => {
    expect(lint(addSpec({ paths: ["a.txt"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("preset ids are unique", () => {
    const seen = new Set<string>();
    let dupes = 0;
    for (const id of ["stage-everything", "commit-with-message", "undo-commit-keep-changes"]) {
      if (seen.has(id)) dupes++;
      seen.add(id);
    }
    expect(dupes).toBe(0);
  });

  it("'Stage everything' is git add .", () => {
    expect(line(getPreset("stage-everything")!.apply(addSpec()))).toBe("git add -- .");
  });

  it("'Unstage a file' is git restore --staged", () => {
    expect(line(getPreset("unstage-a-file")!.apply(restoreSpec()))).toBe("git restore --staged -- path/to/file");
  });

  it("'Hard reset to a commit' is git reset --hard", () => {
    expect(line(getPreset("hard-reset-to-commit")!.apply(resetSpec()))).toBe("git reset --hard 'HEAD~1'");
  });

  it("every preset applies and renders without throwing", () => {
    for (const id of [
      "stage-everything",
      "stage-tracked-only",
      "commit-with-message",
      "amend-last-commit",
      "untrack-keep-file",
      "rename-a-file",
      "unstage-a-file",
      "discard-worktree-changes",
      "undo-commit-keep-changes",
      "hard-reset-to-commit",
      "revert-a-commit",
    ]) {
      expect(() => line(getPreset(id)!.apply(createSpec({ id: "draft" })))).not.toThrow();
    }
  });
});

describe("describeSpec", () => {
  it("describes add", () => {
    expect(describeSpec(addSpec({ paths: ["a.ts"] }))).toBe("Stage a.ts for the next commit.");
  });

  it("describes commit", () => {
    expect(describeSpec(commitSpec({ message: "Fix it" }))).toBe('Record a commit: "Fix it".');
  });

  it("describes rm with --cached", () => {
    expect(describeSpec(rmSpec({ paths: ["a.txt"], flags: { cached: true } }))).toBe(
      "Untrack a.txt, keeping the file on disk.",
    );
  });

  it("describes restore in its three forms", () => {
    expect(describeSpec(restoreSpec({ paths: ["a.txt"], staged: true }))).toBe("Unstage a.txt.");
    expect(describeSpec(restoreSpec({ paths: ["a.txt"] }))).toBe("Discard uncommitted changes to a.txt in the working tree.");
    expect(describeSpec(restoreSpec({ paths: ["a.txt"], staged: true, worktree: true, source: "origin/main" }))).toBe(
      "Reset a.txt in both the index and working tree from origin/main.",
    );
  });
});
