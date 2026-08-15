import { describe, expect, it } from "vitest";
import { lint as lintRules, validateCatalogue, type Arg, type Argv } from "@cmdgen/engine";
import {
  createSpec,
  describeSpec,
  renderOneLine,
  type GitBranchSpec,
  type GitCloneSpec,
  type GitInitSpec,
  type GitSpec,
  type GitSwitchSpec,
  CLONE_CATALOGUE,
  CLONE_FLAGS,
  INIT_CATALOGUE,
  INIT_FLAGS,
  BRANCH_CATALOGUE,
  BRANCH_FLAGS,
  SWITCH_CATALOGUE,
  SWITCH_FLAGS,
  buildCloneArgv,
  buildInitArgv,
  buildBranchArgv,
  buildSwitchArgv,
  SETUP_RULES,
  BRANCHING_RULES,
  SETUP_PRESETS,
  getSetupPreset,
  BRANCHING_PRESETS,
  getBranchingPreset,
} from "@cmdgen/git";

/**
 * Setup and Branching aren't wired into `build/argv.ts`'s dispatcher yet
 * (that file is off-limits for this batch — someone else integrates every
 * batch's cases into it afterward), so this stands in with the exact same
 * shape that dispatcher already uses for every wired-up subcommand: a
 * leading bare subcommand token, then whatever the per-category `build*Argv`
 * returns. Once integrated, this and the real dispatcher produce identical
 * output.
 */
function argv(spec: GitSpec): Argv {
  const args: Arg[] = [{ text: spec.subcommand, role: "value" }];
  switch (spec.subcommand) {
    case "clone":
      args.push(...buildCloneArgv(spec));
      break;
    case "init":
      args.push(...buildInitArgv(spec));
      break;
    case "branch":
      args.push(...buildBranchArgv(spec));
      break;
    case "switch":
      args.push(...buildSwitchArgv(spec));
      break;
    default:
      break;
  }
  return { binary: "git", args };
}
const line = (spec: GitSpec) => renderOneLine(argv(spec), { shell: spec.shell });

const cloneSpec = (partial: Partial<GitCloneSpec> = {}): GitCloneSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "clone" }) as GitCloneSpec),
  ...partial,
});
const initSpec = (partial: Partial<GitInitSpec> = {}): GitInitSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "init" }) as GitInitSpec),
  ...partial,
});
const branchSpec = (partial: Partial<GitBranchSpec> = {}): GitBranchSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "branch" }) as GitBranchSpec),
  ...partial,
});
const switchSpec = (partial: Partial<GitSwitchSpec> = {}): GitSwitchSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "switch" }) as GitSwitchSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every Setup/Branching catalogue is internally consistent", () => {
    expect(validateCatalogue(CLONE_FLAGS)).toEqual([]);
    expect(validateCatalogue(INIT_FLAGS)).toEqual([]);
    expect(validateCatalogue(BRANCH_FLAGS)).toEqual([]);
    expect(validateCatalogue(SWITCH_FLAGS)).toEqual([]);
  });

  it("catalogues expose the flags they were built from", () => {
    expect(CLONE_CATALOGUE.flags.length).toBe(CLONE_FLAGS.length);
    expect(INIT_CATALOGUE.flags.length).toBe(INIT_FLAGS.length);
    expect(BRANCH_CATALOGUE.flags.length).toBe(BRANCH_FLAGS.length);
    expect(SWITCH_CATALOGUE.flags.length).toBe(SWITCH_FLAGS.length);
  });
});

describe("clone", () => {
  it("renders the repository with no directory", () => {
    expect(line(cloneSpec({ repository: "https://github.com/user/repo.git" }))).toBe(
      "git clone https://github.com/user/repo.git",
    );
  });

  it("renders the repository before the directory — load-bearing order", () => {
    expect(
      line(cloneSpec({ repository: "https://github.com/user/repo.git", directory: "my-project" })),
    ).toBe("git clone https://github.com/user/repo.git my-project");
  });

  it("renders with neither repository nor directory", () => {
    expect(line(cloneSpec({}))).toBe("git clone");
  });

  it("renders --depth=N before the repository", () => {
    expect(line(cloneSpec({ repository: "repo", flags: { depth: 1 } }))).toBe("git clone --depth=1 repo");
  });

  it("renders --branch and --origin in their long form (not -b/-o — value flags always render long)", () => {
    expect(line(cloneSpec({ repository: "repo", flags: { branch: "main", origin: "upstream" } }))).toBe(
      "git clone --branch=main --origin=upstream repo",
    );
  });

  it("renders --bare", () => {
    expect(line(cloneSpec({ repository: "repo", flags: { bare: true } }))).toBe("git clone --bare repo");
  });

  it("renders --recurse-submodules and --shallow-submodules together", () => {
    expect(
      line(cloneSpec({ repository: "repo", flags: { recurseSubmodules: true, shallowSubmodules: true } })),
    ).toBe("git clone --recurse-submodules --shallow-submodules repo");
  });

  it("renders --filter for a partial clone", () => {
    expect(line(cloneSpec({ repository: "repo", flags: { filter: "blob:none" } }))).toBe(
      "git clone --filter=blob:none repo",
    );
  });

  it("renders --reference and --dissociate together", () => {
    expect(
      line(cloneSpec({ repository: "repo", flags: { reference: "/path/to/other", dissociate: true } })),
    ).toBe("git clone --reference=/path/to/other --dissociate repo");
  });

  it("renders -j's long form --jobs=N", () => {
    expect(line(cloneSpec({ repository: "repo", flags: { jobs: 4 } }))).toBe("git clone --jobs=4 repo");
  });
});

describe("init", () => {
  it("renders bare init with no directory", () => {
    expect(line(initSpec({}))).toBe("git init");
  });

  it("renders a directory", () => {
    expect(line(initSpec({ directory: "my-project" }))).toBe("git init my-project");
  });

  it("renders --bare", () => {
    expect(line(initSpec({ flags: { bare: true } }))).toBe("git init --bare");
  });

  it("renders -b's long form --initial-branch=NAME", () => {
    expect(line(initSpec({ flags: { initialBranch: "main" } }))).toBe("git init --initial-branch=main");
  });

  it("renders --separate-git-dir", () => {
    expect(line(initSpec({ flags: { separateGitDir: "/path/to/git-dir" } }))).toBe(
      "git init --separate-git-dir=/path/to/git-dir",
    );
  });

  it("renders multiple flags before the directory", () => {
    expect(line(initSpec({ directory: "proj", flags: { bare: true, initialBranch: "main" } }))).toBe(
      "git init --bare --initial-branch=main proj",
    );
  });
});

describe("branch", () => {
  it("create: bare name, no -b flag — branch IS the create form", () => {
    expect(line(branchSpec({ action: "create", names: ["feature/x"] }))).toBe("git branch feature/x");
  });

  it("create: name then start point", () => {
    expect(line(branchSpec({ action: "create", names: ["feature/x"], startPoint: "origin/main" }))).toBe(
      "git branch feature/x origin/main",
    );
  });

  it("create: -f renders before the name", () => {
    expect(line(branchSpec({ action: "create", names: ["feature/x"], flags: { force: true } }))).toBe(
      "git branch -f feature/x",
    );
  });

  it("delete: -d with one name", () => {
    expect(line(branchSpec({ action: "delete", names: ["old-feature"] }))).toBe("git branch -d old-feature");
  });

  it("delete: -D when forceDelete is set", () => {
    expect(line(branchSpec({ action: "delete", names: ["old-feature"], flags: { forceDelete: true } }))).toBe(
      "git branch -D old-feature",
    );
  });

  it("delete: multiple names in order", () => {
    expect(line(branchSpec({ action: "delete", names: ["a", "b"] }))).toBe("git branch -d a b");
  });

  it("delete: -r deletes a local remote-tracking ref only", () => {
    expect(line(branchSpec({ action: "delete", names: ["origin/old"], flags: { remotes: true } }))).toBe(
      "git branch -d -r origin/old",
    );
  });

  it("rename: -m with the old and new name", () => {
    expect(line(branchSpec({ action: "rename", names: ["old-name"], newName: "new-name" }))).toBe(
      "git branch -m old-name new-name",
    );
  });

  it("rename: empty names renames the CURRENT branch — only newName renders", () => {
    expect(line(branchSpec({ action: "rename", newName: "new-name" }))).toBe("git branch -m new-name");
  });

  it("rename: -M when forceMove is set", () => {
    expect(
      line(branchSpec({ action: "rename", names: ["old-name"], newName: "new-name", flags: { forceMove: true } })),
    ).toBe("git branch -M old-name new-name");
  });

  it("copy: -c with the old and new name", () => {
    expect(line(branchSpec({ action: "copy", names: ["old-name"], newName: "new-name" }))).toBe(
      "git branch -c old-name new-name",
    );
  });

  it("list: bare, the default action", () => {
    expect(line(branchSpec({}))).toBe("git branch");
  });

  it("list: -a", () => {
    expect(line(branchSpec({ flags: { all: true } }))).toBe("git branch -a");
  });

  it("list: -r", () => {
    expect(line(branchSpec({ flags: { remotes: true } }))).toBe("git branch -r");
  });

  it("list: names act as glob patterns and get quoted like any other unsafe token", () => {
    expect(line(branchSpec({ names: ["feature/*"] }))).toBe("git branch 'feature/*'");
  });

  it("list: --contains", () => {
    expect(line(branchSpec({ flags: { contains: "HEAD" } }))).toBe("git branch --contains=HEAD");
  });

  it("list: --sort", () => {
    expect(line(branchSpec({ flags: { sort: "-committerdate" } }))).toBe("git branch --sort=-committerdate");
  });

  it("list: --set-upstream-to and --unset-upstream", () => {
    expect(line(branchSpec({ flags: { setUpstreamTo: "origin/main" } }))).toBe(
      "git branch --set-upstream-to=origin/main",
    );
    expect(line(branchSpec({ flags: { unsetUpstream: true } }))).toBe("git branch --unset-upstream");
  });

  it("a flag irrelevant to the current action never leaks into its argv (create-only -f while listing)", () => {
    expect(line(branchSpec({ action: "list", flags: { force: true } }))).toBe("git branch");
  });
});

describe("switch", () => {
  it("renders a bare target with no create name", () => {
    expect(line(switchSpec({ target: "main" }))).toBe("git switch main");
  });

  it("renders -c with just a create name (no target)", () => {
    expect(line(switchSpec({ createName: "feature/x" }))).toBe("git switch -c feature/x");
  });

  it("renders -c <createName> <target> — new name FIRST, start point SECOND", () => {
    expect(line(switchSpec({ createName: "feature/x", target: "main" }))).toBe("git switch -c feature/x main");
  });

  it("renders -C instead of -c when forceCreate is set", () => {
    expect(line(switchSpec({ createName: "feature/x", target: "main", flags: { forceCreate: true } }))).toBe(
      "git switch -C feature/x main",
    );
  });

  it("setting the create flag alone (no createName) renders no -c at all", () => {
    expect(line(switchSpec({ target: "main", flags: { create: true } }))).toBe("git switch main");
  });

  it("setting forceCreate alone (no createName) renders no -C at all", () => {
    expect(line(switchSpec({ target: "main", flags: { forceCreate: true } }))).toBe("git switch main");
  });

  it("renders -d for detach", () => {
    expect(line(switchSpec({ target: "HEAD~1", flags: { detach: true } }))).toBe("git switch -d 'HEAD~1'");
  });

  it("renders --discard-changes", () => {
    expect(line(switchSpec({ target: "main", flags: { discardChanges: true } }))).toBe(
      "git switch --discard-changes main",
    );
  });

  it("renders -m for merge", () => {
    expect(line(switchSpec({ target: "main", flags: { merge: true } }))).toBe("git switch -m main");
  });

  it("renders --track ahead of -c/createName", () => {
    expect(
      line(switchSpec({ createName: "feature/x", target: "origin/feature/x", flags: { track: true } })),
    ).toBe("git switch --track -c feature/x origin/feature/x");
  });

  it("--orphan reuses createName and skips -c entirely", () => {
    expect(line(switchSpec({ createName: "feature/new", flags: { orphan: true } }))).toBe(
      "git switch --orphan feature/new",
    );
  });

  it("renders --ignore-other-worktrees", () => {
    expect(line(switchSpec({ target: "main", flags: { ignoreOtherWorktrees: true } }))).toBe(
      "git switch --ignore-other-worktrees main",
    );
  });
});

describe("lint — Setup", () => {
  it("GIT016 flags --separate-git-dir as a warning", () => {
    const result = lintRules(initSpec({ flags: { separateGitDir: "/other/git-dir" } }), SETUP_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT016")!.level).toBe("warning");
  });

  it("GIT016 does not fire without --separate-git-dir", () => {
    const result = lintRules(initSpec({}), SETUP_RULES);
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT016");
  });

  it("a clone spec never has any Setup diagnostics", () => {
    expect(lintRules(cloneSpec({ repository: "repo" }), SETUP_RULES).diagnostics).toEqual([]);
  });
});

describe("lint — Branching", () => {
  it("GIT017 flags -d/-r as an info-level misconception, not an error", () => {
    const result = lintRules(branchSpec({ action: "delete", names: ["origin/old"], flags: { remotes: true } }), BRANCHING_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT017")!.level).toBe("info");
  });

  it("GIT017 does not fire without -r", () => {
    const result = lintRules(branchSpec({ action: "delete", names: ["old"] }), BRANCHING_RULES);
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT017");
  });

  it("GIT018 flags -D as destructive", () => {
    const result = lintRules(branchSpec({ action: "delete", names: ["old"], flags: { forceDelete: true } }), BRANCHING_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT018")!.level).toBe("destructive");
  });

  it("GIT018 does not fire for plain -d", () => {
    const result = lintRules(branchSpec({ action: "delete", names: ["old"] }), BRANCHING_RULES);
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT018");
  });

  it("GIT019 flags create-form -f as destructive", () => {
    const result = lintRules(branchSpec({ action: "create", names: ["x"], flags: { force: true } }), BRANCHING_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT019")!.level).toBe("destructive");
  });

  it("GIT019 does not fire outside the create action", () => {
    const result = lintRules(branchSpec({ action: "list", flags: { force: true } }), BRANCHING_RULES);
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT019");
  });

  it("GIT020 flags rename-form -M as a warning", () => {
    const result = lintRules(
      branchSpec({ action: "rename", names: ["x"], newName: "y", flags: { forceMove: true } }),
      BRANCHING_RULES,
    );
    expect(result.diagnostics.find((d) => d.code === "GIT020")!.level).toBe("warning");
  });

  it("GIT021 flags switch -C as destructive", () => {
    const result = lintRules(switchSpec({ createName: "x", flags: { forceCreate: true } }), BRANCHING_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT021")!.level).toBe("destructive");
  });

  it("GIT022 flags --discard-changes as destructive, with no fix", () => {
    const result = lintRules(switchSpec({ target: "main", flags: { discardChanges: true } }), BRANCHING_RULES);
    const diag = result.diagnostics.find((d) => d.code === "GIT022")!;
    expect(diag.level).toBe("destructive");
    expect(diag.fix).toBeUndefined();
  });

  it("GIT023 flags -d (detach) as a warning", () => {
    const result = lintRules(switchSpec({ target: "HEAD~1", flags: { detach: true } }), BRANCHING_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT023")!.level).toBe("warning");
  });

  it("GIT024 flags --ignore-other-worktrees as a warning", () => {
    const result = lintRules(switchSpec({ target: "main", flags: { ignoreOtherWorktrees: true } }), BRANCHING_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT024")!.level).toBe("warning");
  });

  it("a clean switch spec has no Branching diagnostics", () => {
    expect(lintRules(switchSpec({ target: "main" }), BRANCHING_RULES).diagnostics).toEqual([]);
  });
});

describe("presets — Setup", () => {
  it("preset ids are unique", () => {
    const ids = SETUP_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("'Clone a repository' is a bare git clone", () => {
    expect(line(getSetupPreset("clone-a-repository")!.apply(cloneSpec()))).toBe(
      "git clone https://github.com/user/repo.git",
    );
  });

  it("'Shallow clone' adds --depth=1", () => {
    expect(line(getSetupPreset("shallow-clone")!.apply(cloneSpec()))).toBe(
      "git clone --depth=1 https://github.com/user/repo.git",
    );
  });

  it("'Initialize a new repo' is a bare git init", () => {
    expect(line(getSetupPreset("initialize-a-new-repo")!.apply(initSpec()))).toBe("git init");
  });

  it("every Setup preset applies and renders without throwing", () => {
    for (const preset of SETUP_PRESETS) {
      expect(() => line(preset.apply(createSpec({ id: "draft" })))).not.toThrow();
    }
  });
});

describe("presets — Branching", () => {
  it("preset ids are unique", () => {
    const ids = BRANCHING_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("'Create and switch to a new branch' is git switch -c", () => {
    expect(line(getBranchingPreset("create-and-switch-branch")!.apply(switchSpec()))).toBe(
      "git switch -c feature/new-thing",
    );
  });

  it("'List branches' is a bare git branch", () => {
    expect(line(getBranchingPreset("list-branches")!.apply(branchSpec()))).toBe("git branch");
  });

  it("'Delete a branch' is git branch -d", () => {
    expect(line(getBranchingPreset("delete-a-branch")!.apply(branchSpec()))).toBe("git branch -d old-feature");
  });

  it("every Branching preset applies and renders without throwing", () => {
    for (const preset of BRANCHING_PRESETS) {
      expect(() => line(preset.apply(createSpec({ id: "draft" })))).not.toThrow();
    }
  });
});

describe("describeSpec", () => {
  it("describes clone with and without a directory", () => {
    expect(describeSpec(cloneSpec({ repository: "repo" }))).toBe("Clone repo.");
    expect(describeSpec(cloneSpec({ repository: "repo", directory: "dir" }))).toBe("Clone repo into dir.");
  });

  it("describes init with and without a directory", () => {
    expect(describeSpec(initSpec({}))).toBe("Initialize a new git repository.");
    expect(describeSpec(initSpec({ directory: "proj" }))).toBe("Initialize a new git repository in proj.");
  });

  it("describes switch with and without a target", () => {
    expect(describeSpec(switchSpec({ target: "main" }))).toBe("Switch to main.");
    expect(describeSpec(switchSpec({}))).toBe("Switch to SOME_BRANCH.");
  });
});
