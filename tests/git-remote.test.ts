import { describe, expect, it } from "vitest";
import { lint, renderOneLine, validateCatalogue, type Arg, type Argv } from "@cmdgen/engine";
import {
  createSpec,
  describeSpec,
  type GitFetchSpec,
  type GitPullSpec,
  type GitPushSpec,
  type GitSpec,
  FETCH_CATALOGUE,
  FETCH_FLAGS,
  PULL_CATALOGUE,
  PULL_FLAGS,
  PUSH_CATALOGUE,
  PUSH_FLAGS,
  buildFetchArgv,
  buildPullArgv,
  buildPushArgv,
  REMOTE_RULES,
  getRemotePreset,
  REMOTE_PRESETS,
} from "@cmdgen/git";

function argv(subcommand: string, args: Arg[]): Argv {
  return { binary: "git", args: [{ text: subcommand, role: "value" }, ...args] };
}

const fetchLine = (spec: GitFetchSpec) => renderOneLine(argv("fetch", buildFetchArgv(spec)), { shell: spec.shell });
const pullLine = (spec: GitPullSpec) => renderOneLine(argv("pull", buildPullArgv(spec)), { shell: spec.shell });
const pushLine = (spec: GitPushSpec) => renderOneLine(argv("push", buildPushArgv(spec)), { shell: spec.shell });

/** Dispatches to the right renderer above — only ever called with a fetch/pull/push spec, e.g. after applying a Remote Sync preset. */
function remoteLine(spec: GitSpec): string {
  switch (spec.subcommand) {
    case "fetch":
      return fetchLine(spec);
    case "pull":
      return pullLine(spec);
    case "push":
      return pushLine(spec);
    default:
      throw new Error(`remoteLine: unexpected subcommand ${spec.subcommand}`);
  }
}

const fetchSpec = (partial: Partial<GitFetchSpec> = {}): GitFetchSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "fetch" }) as GitFetchSpec),
  ...partial,
});
const pullSpec = (partial: Partial<GitPullSpec> = {}): GitPullSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pull" }) as GitPullSpec),
  ...partial,
});
const pushSpec = (partial: Partial<GitPushSpec> = {}): GitPushSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "push" }) as GitPushSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every Remote Sync catalogue is internally consistent", () => {
    expect(validateCatalogue(FETCH_FLAGS)).toEqual([]);
    expect(validateCatalogue(PULL_FLAGS)).toEqual([]);
    expect(validateCatalogue(PUSH_FLAGS)).toEqual([]);
  });

  it("catalogues are bound to the flag arrays they claim", () => {
    expect(FETCH_CATALOGUE.flags).toBe(FETCH_FLAGS);
    expect(PULL_CATALOGUE.flags).toBe(PULL_FLAGS);
    expect(PUSH_CATALOGUE.flags).toBe(PUSH_FLAGS);
  });
});

describe("fetch", () => {
  it("renders bare fetch with no remote or refspecs", () => {
    expect(fetchLine(fetchSpec())).toBe("git fetch");
  });

  it("renders a remote with no refspecs", () => {
    expect(fetchLine(fetchSpec({ remote: "origin" }))).toBe("git fetch origin");
  });

  it("renders a remote with refspecs, in order", () => {
    expect(fetchLine(fetchSpec({ remote: "origin", refspecs: ["main", "dev"] }))).toBe("git fetch origin main dev");
  });

  it("skips blank refspec entries", () => {
    expect(fetchLine(fetchSpec({ remote: "origin", refspecs: ["", "main", "  "] }))).toBe("git fetch origin main");
  });

  it("quotes a refspec containing glob characters", () => {
    expect(fetchLine(fetchSpec({ remote: "origin", refspecs: ["refs/heads/*:refs/remotes/origin/*"] }))).toBe(
      "git fetch origin 'refs/heads/*:refs/remotes/origin/*'",
    );
  });

  it("renders --all", () => {
    expect(fetchLine(fetchSpec({ flags: { all: true } }))).toBe("git fetch --all");
  });

  it("renders -p and -P together", () => {
    expect(fetchLine(fetchSpec({ flags: { prune: true, pruneTags: true } }))).toBe("git fetch -p -P");
  });

  it("renders --tags and --no-tags", () => {
    expect(fetchLine(fetchSpec({ flags: { tags: true } }))).toBe("git fetch --tags");
    expect(fetchLine(fetchSpec({ flags: { noTags: true } }))).toBe("git fetch --no-tags");
  });

  it("renders --depth attached with =", () => {
    expect(fetchLine(fetchSpec({ flags: { depth: 1 } }))).toBe("git fetch --depth=1");
  });

  it("renders -f", () => {
    expect(fetchLine(fetchSpec({ flags: { force: true } }))).toBe("git fetch -f");
  });

  it("renders --dry-run", () => {
    expect(fetchLine(fetchSpec({ flags: { dryRun: true } }))).toBe("git fetch --dry-run");
  });

  it("renders --jobs attached with =", () => {
    expect(fetchLine(fetchSpec({ flags: { jobs: 4 } }))).toBe("git fetch --jobs=4");
  });

  it("renders --recurse-submodules with a text value", () => {
    expect(fetchLine(fetchSpec({ flags: { recurseSubmodules: "on-demand" } }))).toBe(
      "git fetch --recurse-submodules=on-demand",
    );
  });
});

describe("pull", () => {
  it("renders bare pull with no remote or refspecs", () => {
    expect(pullLine(pullSpec())).toBe("git pull");
  });

  it("renders a remote with refspecs", () => {
    expect(pullLine(pullSpec({ remote: "origin", refspecs: ["main"] }))).toBe("git pull origin main");
  });

  it("renders bare --rebase from the boolean toggle", () => {
    expect(pullLine(pullSpec({ flags: { rebase: true } }))).toBe("git pull --rebase");
  });

  it("renders --rebase with an explicit value", () => {
    expect(pullLine(pullSpec({ flags: { rebase: "merges" } }))).toBe("git pull --rebase=merges");
  });

  it("renders --ff-only and --no-ff", () => {
    expect(pullLine(pullSpec({ flags: { ffOnly: true } }))).toBe("git pull --ff-only");
    expect(pullLine(pullSpec({ flags: { noFf: true } }))).toBe("git pull --no-ff");
  });

  it("renders -p", () => {
    expect(pullLine(pullSpec({ flags: { prune: true } }))).toBe("git pull -p");
  });

  it("renders --depth attached with =", () => {
    expect(pullLine(pullSpec({ flags: { depth: 5 } }))).toBe("git pull --depth=5");
  });

  it("renders -f", () => {
    expect(pullLine(pullSpec({ flags: { force: true } }))).toBe("git pull -f");
  });

  it("renders --autostash", () => {
    expect(pullLine(pullSpec({ flags: { autostash: true } }))).toBe("git pull --autostash");
  });

  it("renders --strategy attached with =", () => {
    expect(pullLine(pullSpec({ flags: { strategy: "recursive" } }))).toBe("git pull --strategy=recursive");
  });

  it("renders --no-verify", () => {
    expect(pullLine(pullSpec({ flags: { noVerify: true } }))).toBe("git pull --no-verify");
  });
});

describe("push", () => {
  it("renders bare push with no remote or refspecs", () => {
    expect(pushLine(pushSpec())).toBe("git push");
  });

  it("renders a remote with a local:remote refspec", () => {
    expect(pushLine(pushSpec({ remote: "origin", refspecs: ["feature-x:feature-x"] }))).toBe(
      "git push origin feature-x:feature-x",
    );
  });

  it("quotes a refspec containing glob characters", () => {
    expect(pushLine(pushSpec({ remote: "origin", refspecs: ["refs/heads/*:refs/remotes/origin/*"] }))).toBe(
      "git push origin 'refs/heads/*:refs/remotes/origin/*'",
    );
  });

  it("renders -f", () => {
    expect(pushLine(pushSpec({ flags: { force: true } }))).toBe("git push -f");
  });

  it("renders bare --force-with-lease from the boolean toggle", () => {
    expect(pushLine(pushSpec({ flags: { forceWithLease: true } }))).toBe("git push --force-with-lease");
  });

  it("renders --force-with-lease with an explicit refname:expect value", () => {
    expect(pushLine(pushSpec({ flags: { forceWithLease: "main:abc123" } }))).toBe(
      "git push --force-with-lease=main:abc123",
    );
  });

  it("renders --force-if-includes", () => {
    expect(pushLine(pushSpec({ flags: { forceWithLease: true, forceIfIncludes: true } }))).toBe(
      "git push --force-if-includes --force-with-lease",
    );
  });

  it("renders -u", () => {
    expect(pushLine(pushSpec({ remote: "origin", refspecs: ["main"], flags: { setUpstream: true } }))).toBe(
      "git push -u origin main",
    );
  });

  it("renders -d", () => {
    expect(pushLine(pushSpec({ remote: "origin", refspecs: ["feature-x"], flags: { delete: true } }))).toBe(
      "git push -d origin feature-x",
    );
  });

  it("renders --tags and --all", () => {
    expect(pushLine(pushSpec({ flags: { tags: true } }))).toBe("git push --tags");
    expect(pushLine(pushSpec({ flags: { all: true } }))).toBe("git push --all");
  });

  it("renders --mirror", () => {
    expect(pushLine(pushSpec({ flags: { mirror: true } }))).toBe("git push --mirror");
  });

  it("renders -n", () => {
    expect(pushLine(pushSpec({ flags: { dryRun: true } }))).toBe("git push -n");
  });

  it("renders --atomic and --no-verify", () => {
    expect(pushLine(pushSpec({ flags: { atomic: true } }))).toBe("git push --atomic");
    expect(pushLine(pushSpec({ flags: { noVerify: true } }))).toBe("git push --no-verify");
  });

  it("renders --push-option attached with =", () => {
    expect(pushLine(pushSpec({ flags: { pushOption: "ci.skip" } }))).toBe("git push --push-option=ci.skip");
  });
});

describe("lint", () => {
  it("GIT025 catches fetch --all combined with an explicit remote, and the fix clears remote", () => {
    const s = fetchSpec({ remote: "origin", flags: { all: true } });
    const result = lint(s, REMOTE_RULES);
    const diag = result.diagnostics.find((d) => d.code === "GIT025")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitFetchSpec;
    expect(fixed.remote).toBe("");
    expect(lint(fixed, REMOTE_RULES).diagnostics.map((d) => d.code)).not.toContain("GIT025");
  });

  it("GIT025 does not fire for --all with no remote", () => {
    const result = lint(fetchSpec({ flags: { all: true } }), REMOTE_RULES);
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT025");
  });

  it("GIT026 catches the bare --rebase toggle as a warning", () => {
    const result = lint(pullSpec({ flags: { rebase: true } }), REMOTE_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT026")!.level).toBe("warning");
  });

  it("GIT026 catches an explicit non-false --rebase value", () => {
    const result = lint(pullSpec({ flags: { rebase: "merges" } }), REMOTE_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT026")!.level).toBe("warning");
  });

  it("GIT026 does not fire for --rebase=false", () => {
    const result = lint(pullSpec({ flags: { rebase: "false" } }), REMOTE_RULES);
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT026");
  });

  it("GIT027 flags push --force as destructive, and the fix swaps in --force-with-lease", () => {
    const s = pushSpec({ flags: { force: true } });
    const result = lint(s, REMOTE_RULES);
    const diag = result.diagnostics.find((d) => d.code === "GIT027")!;
    expect(diag.level).toBe("destructive");
    const fixed = diag.fix!.apply(s) as GitPushSpec;
    expect(fixed.flags.force).toBeUndefined();
    expect(fixed.flags.forceWithLease).toBe(true);
    expect(pushLine(fixed)).toBe("git push --force-with-lease");
    expect(lint(fixed, REMOTE_RULES).diagnostics.map((d) => d.code)).not.toContain("GIT027");
  });

  it("GIT028 flags push --mirror as destructive", () => {
    const result = lint(pushSpec({ flags: { mirror: true } }), REMOTE_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT028")!.level).toBe("destructive");
  });

  it("GIT029 flags push --delete as destructive, with no fix", () => {
    const result = lint(pushSpec({ flags: { delete: true } }), REMOTE_RULES);
    const diag = result.diagnostics.find((d) => d.code === "GIT029")!;
    expect(diag.level).toBe("destructive");
    expect(diag.fix).toBeUndefined();
  });

  it("GIT030 flags push --all as a warning", () => {
    const result = lint(pushSpec({ flags: { all: true } }), REMOTE_RULES);
    expect(result.diagnostics.find((d) => d.code === "GIT030")!.level).toBe("warning");
  });

  it("a clean fetch spec has no diagnostics", () => {
    expect(lint(fetchSpec({ remote: "origin" }), REMOTE_RULES).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("preset ids are unique", () => {
    const ids = REMOTE_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every preset is categorized under Remote Sync", () => {
    for (const preset of REMOTE_PRESETS) expect(preset.category).toBe("Remote Sync");
  });

  it("'Fetch all remotes' is git fetch --all", () => {
    expect(remoteLine(getRemotePreset("fetch-all-remotes")!.apply(fetchSpec()))).toBe("git fetch --all");
  });

  it("'Pull with rebase' is git pull --rebase", () => {
    expect(remoteLine(getRemotePreset("pull-with-rebase")!.apply(pullSpec()))).toBe("git pull --rebase");
  });

  it("'Push and set upstream' is git push -u origin main", () => {
    expect(remoteLine(getRemotePreset("push-set-upstream")!.apply(pushSpec()))).toBe("git push -u origin main");
  });

  it("'Force-push safely' is git push --force-with-lease", () => {
    expect(remoteLine(getRemotePreset("force-push-safely")!.apply(pushSpec()))).toBe("git push --force-with-lease");
  });

  it("every preset applies and renders without throwing, from any starting subcommand", () => {
    for (const id of ["fetch-all-remotes", "pull-with-rebase", "push-set-upstream", "force-push-safely"]) {
      expect(() => remoteLine(getRemotePreset(id)!.apply(createSpec({ id: "draft" })))).not.toThrow();
    }
  });
});

describe("describeSpec", () => {
  it("describes fetch", () => {
    expect(describeSpec(fetchSpec({ remote: "origin" }))).toBe("Fetch from origin.");
    expect(describeSpec(fetchSpec({ remote: "" }))).toBe("Fetch from the default remote.");
  });

  it("describes pull", () => {
    expect(describeSpec(pullSpec({ remote: "origin" }))).toBe("Pull from origin.");
    expect(describeSpec(pullSpec({ remote: "" }))).toBe("Pull from the default remote.");
  });

  it("describes push", () => {
    expect(describeSpec(pushSpec({ remote: "origin" }))).toBe("Push to origin.");
    expect(describeSpec(pushSpec({ remote: "" }))).toBe("Push to the default remote.");
  });
});
