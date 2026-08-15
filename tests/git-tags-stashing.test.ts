import { describe, expect, it } from "vitest";
import { lint as lintGeneric, renderOneLine, validateCatalogue, type Argv } from "@cmdgen/engine";
import {
  createSpec,
  describeSpec,
  type GitSpec,
  type GitStashSpec,
  type GitTagSpec,
  TAG_CATALOGUE,
  TAG_FLAGS,
  STASH_CATALOGUE,
  STASH_FLAGS,
  buildTagArgv,
  buildStashArgv,
  TAGS_RULES,
  STASHING_RULES,
  TAGS_PRESETS,
  STASHING_PRESETS,
} from "@cmdgen/git";

const tagSpec = (partial: Partial<GitTagSpec> = {}): GitTagSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "tag" }) as GitTagSpec),
  ...partial,
});
const stashSpec = (partial: Partial<GitStashSpec> = {}): GitStashSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "stash" }) as GitStashSpec),
  ...partial,
});

const tagArgv = (spec: GitTagSpec): Argv => ({
  binary: "git",
  args: [{ text: "tag", role: "value" }, ...buildTagArgv(spec)],
});
const tagLine = (spec: GitTagSpec) => renderOneLine(tagArgv(spec), { shell: spec.shell });

const stashArgv = (spec: GitStashSpec): Argv => ({
  binary: "git",
  args: [{ text: "stash", role: "value" }, ...buildStashArgv(spec)],
});
const stashLine = (spec: GitStashSpec) => renderOneLine(stashArgv(spec), { shell: spec.shell });

const lintTags = (spec: GitSpec) => lintGeneric(spec, TAGS_RULES);
const lintStashing = (spec: GitSpec) => lintGeneric(spec, STASHING_RULES);

describe("catalogue integrity", () => {
  it("TAG_FLAGS and STASH_FLAGS are internally consistent", () => {
    expect(validateCatalogue(TAG_FLAGS)).toEqual([]);
    expect(validateCatalogue(STASH_FLAGS)).toEqual([]);
  });

  it("TAG_CATALOGUE / STASH_CATALOGUE expose every declared flag", () => {
    expect(TAG_CATALOGUE.flags.length).toBe(TAG_FLAGS.length);
    expect(STASH_CATALOGUE.flags.length).toBe(STASH_FLAGS.length);
  });
});

describe("tag: create", () => {
  it("renders bare with no name, commit or message", () => {
    expect(tagLine(tagSpec({ action: "create" }))).toBe("git tag");
  });

  it("renders the first name only, ignoring any extras", () => {
    expect(tagLine(tagSpec({ action: "create", names: ["v1.0.0", "extra"] }))).toBe("git tag v1.0.0");
  });

  it("renders name then commit", () => {
    expect(tagLine(tagSpec({ action: "create", names: ["v1.0.0"], commit: "HEAD~2" }))).toBe(
      "git tag v1.0.0 'HEAD~2'",
    );
  });

  it("renders -a", () => {
    expect(tagLine(tagSpec({ action: "create", names: ["v1.0.0"], flags: { annotate: true } }))).toBe(
      "git tag -a v1.0.0",
    );
  });

  it("renders -m with a quoted message ahead of the name", () => {
    expect(
      tagLine(tagSpec({ action: "create", names: ["v1.0.0"], message: "Release v1.0.0", flags: { annotate: true } })),
    ).toBe("git tag -a -m 'Release v1.0.0' v1.0.0");
  });

  it("renders -s and --local-user (long form, even though local-user has a short spelling)", () => {
    expect(
      tagLine(tagSpec({ action: "create", names: ["v1.0.0"], flags: { sign: true, localUser: "ABC123" } })),
    ).toBe("git tag -s --local-user ABC123 v1.0.0");
  });

  it("renders -f", () => {
    expect(tagLine(tagSpec({ action: "create", names: ["v1.0.0"], flags: { force: true } }))).toBe(
      "git tag -f v1.0.0",
    );
  });

  it("renders --cleanup=<mode>", () => {
    expect(tagLine(tagSpec({ action: "create", names: ["v1.0.0"], flags: { cleanup: "strip" } }))).toBe(
      "git tag --cleanup=strip v1.0.0",
    );
  });

  it("renders --file (long form)", () => {
    expect(tagLine(tagSpec({ action: "create", names: ["v1.0.0"], flags: { file: "message.txt" } }))).toBe(
      "git tag --file message.txt v1.0.0",
    );
  });

  it("drops list-only flags when creating", () => {
    expect(
      tagLine(tagSpec({ action: "create", names: ["v1.0.0"], flags: { sort: "-version:refname" } })),
    ).toBe("git tag v1.0.0");
  });
});

describe("tag: delete", () => {
  it("renders -d with one name", () => {
    expect(tagLine(tagSpec({ action: "delete", names: ["v1.0.0"] }))).toBe("git tag -d v1.0.0");
  });

  it("renders -d with multiple names", () => {
    expect(tagLine(tagSpec({ action: "delete", names: ["v1.0.0", "v2.0.0"] }))).toBe(
      "git tag -d v1.0.0 v2.0.0",
    );
  });

  it("never renders a commit, even if one is set", () => {
    expect(tagLine(tagSpec({ action: "delete", names: ["v1.0.0"], commit: "HEAD" }))).toBe(
      "git tag -d v1.0.0",
    );
  });
});

describe("tag: verify", () => {
  it("renders -v with one name", () => {
    expect(tagLine(tagSpec({ action: "verify", names: ["v1.0.0"] }))).toBe("git tag -v v1.0.0");
  });

  it("renders -v with multiple names", () => {
    expect(tagLine(tagSpec({ action: "verify", names: ["v1.0.0", "v2.0.0"] }))).toBe(
      "git tag -v v1.0.0 v2.0.0",
    );
  });
});

describe("tag: list", () => {
  it("renders bare with no names or flags", () => {
    expect(tagLine(tagSpec({ action: "list" }))).toBe("git tag");
  });

  it("renders names as quoted glob patterns", () => {
    expect(tagLine(tagSpec({ action: "list", names: ["v*"] }))).toBe("git tag 'v*'");
  });

  it("renders --sort=<key>", () => {
    expect(tagLine(tagSpec({ action: "list", flags: { sort: "-version:refname" } }))).toBe(
      "git tag --sort=-version:refname",
    );
  });

  it("renders --contains (long form, detached)", () => {
    expect(tagLine(tagSpec({ action: "list", flags: { contains: "abc123" } }))).toBe(
      "git tag --contains abc123",
    );
  });

  it("renders --points-at", () => {
    expect(tagLine(tagSpec({ action: "list", flags: { pointsAt: "HEAD" } }))).toBe(
      "git tag --points-at HEAD",
    );
  });

  it("drops create-only flags when listing", () => {
    expect(tagLine(tagSpec({ action: "list", flags: { force: true } }))).toBe("git tag");
  });
});

describe("stash: push", () => {
  it("always renders the explicit push keyword when bare", () => {
    expect(stashLine(stashSpec({ action: "push" }))).toBe("git stash push");
  });

  it("renders -k and -u", () => {
    expect(stashLine(stashSpec({ action: "push", flags: { keepIndex: true, includeUntracked: true } }))).toBe(
      "git stash push -k -u",
    );
  });

  it("renders -a and -p", () => {
    expect(stashLine(stashSpec({ action: "push", flags: { all: true, patch: true } }))).toBe(
      "git stash push -a -p",
    );
  });

  it("renders --staged", () => {
    expect(stashLine(stashSpec({ action: "push", flags: { staged: true } }))).toBe("git stash push --staged");
  });

  it("renders -m with a quoted message", () => {
    expect(stashLine(stashSpec({ action: "push", message: "WIP on feature" }))).toBe(
      "git stash push -m 'WIP on feature'",
    );
  });

  it("renders paths after --", () => {
    expect(stashLine(stashSpec({ action: "push", paths: ["a.txt", "b.txt"] }))).toBe(
      "git stash push -- a.txt b.txt",
    );
  });

  it("renders flags, message, then paths together", () => {
    expect(
      stashLine(
        stashSpec({ action: "push", flags: { keepIndex: true, includeUntracked: true }, message: "WIP", paths: ["a.txt"] }),
      ),
    ).toBe("git stash push -k -u -m WIP -- a.txt");
  });

  it("drops pop/apply-only flags when pushing", () => {
    expect(stashLine(stashSpec({ action: "push", flags: { index: true } }))).toBe("git stash push");
  });
});

describe("stash: list", () => {
  it("renders bare", () => {
    expect(stashLine(stashSpec({ action: "list" }))).toBe("git stash list");
  });

  it("renders -q", () => {
    expect(stashLine(stashSpec({ action: "list", flags: { quiet: true } }))).toBe("git stash list -q");
  });
});

describe("stash: show", () => {
  it("renders bare (defaults to stash@{0})", () => {
    expect(stashLine(stashSpec({ action: "show" }))).toBe("git stash show");
  });

  it("renders and quotes an explicit stash ref", () => {
    expect(stashLine(stashSpec({ action: "show", stashRef: "stash@{2}" }))).toBe(
      "git stash show 'stash@{2}'",
    );
  });
});

describe("stash: pop / apply", () => {
  it("renders pop bare", () => {
    expect(stashLine(stashSpec({ action: "pop" }))).toBe("git stash pop");
  });

  it("renders pop with --index and a quoted ref", () => {
    expect(stashLine(stashSpec({ action: "pop", flags: { index: true }, stashRef: "stash@{1}" }))).toBe(
      "git stash pop --index 'stash@{1}'",
    );
  });

  it("renders apply bare", () => {
    expect(stashLine(stashSpec({ action: "apply" }))).toBe("git stash apply");
  });

  it("renders apply with --index", () => {
    expect(stashLine(stashSpec({ action: "apply", flags: { index: true } }))).toBe("git stash apply --index");
  });
});

describe("stash: drop", () => {
  it("renders bare", () => {
    expect(stashLine(stashSpec({ action: "drop" }))).toBe("git stash drop");
  });

  it("renders with a quoted ref", () => {
    expect(stashLine(stashSpec({ action: "drop", stashRef: "stash@{3}" }))).toBe("git stash drop 'stash@{3}'");
  });

  it("renders -q", () => {
    expect(stashLine(stashSpec({ action: "drop", flags: { quiet: true } }))).toBe("git stash drop -q");
  });
});

describe("stash: branch", () => {
  it("renders the branch name", () => {
    expect(stashLine(stashSpec({ action: "branch", branchName: "recovered-feature" }))).toBe(
      "git stash branch recovered-feature",
    );
  });

  it("renders the branch name and a quoted stash ref", () => {
    expect(stashLine(stashSpec({ action: "branch", branchName: "recovered-feature", stashRef: "stash@{0}" }))).toBe(
      "git stash branch recovered-feature 'stash@{0}'",
    );
  });
});

describe("stash: clear", () => {
  it("renders bare with no other args or flags at all", () => {
    expect(stashLine(stashSpec({ action: "clear" }))).toBe("git stash clear");
  });

  it("ignores every other field, however they are populated", () => {
    expect(
      stashLine(
        stashSpec({
          action: "clear",
          message: "ignored",
          paths: ["ignored.txt"],
          branchName: "ignored",
          stashRef: "stash@{0}",
          flags: { quiet: true, keepIndex: true },
        }),
      ),
    ).toBe("git stash clear");
  });
});

describe("tag lint", () => {
  it("GIT043 flags create -f as destructive", () => {
    const result = lintTags(tagSpec({ action: "create", flags: { force: true } }));
    expect(result.diagnostics.find((d) => d.code === "GIT043")!.level).toBe("destructive");
  });

  it("GIT043 does not fire without -f", () => {
    const result = lintTags(tagSpec({ action: "create" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT043");
  });

  it("GIT043 does not fire for other actions even with the flag lingering in state", () => {
    const result = lintTags(tagSpec({ action: "delete", flags: { force: true } }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT043");
  });

  it("GIT044 flags delete as a warning, not destructive", () => {
    const result = lintTags(tagSpec({ action: "delete", names: ["v1.0.0"] }));
    const diag = result.diagnostics.find((d) => d.code === "GIT044")!;
    expect(diag.level).toBe("warning");
  });

  it("GIT045 adds an info note that delete never touches a remote", () => {
    const result = lintTags(tagSpec({ action: "delete", names: ["v1.0.0"] }));
    expect(result.diagnostics.find((d) => d.code === "GIT045")!.level).toBe("info");
  });

  it("GIT044/GIT045 do not fire for create", () => {
    const result = lintTags(tagSpec({ action: "create" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT044");
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT045");
  });

  it("GIT046 flags a commit set on delete, and the fix clears it", () => {
    const s = tagSpec({ action: "delete", names: ["v1.0.0"], commit: "HEAD" });
    const result = lintTags(s);
    const diag = result.diagnostics.find((d) => d.code === "GIT046")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s) as GitTagSpec;
    expect(fixed.commit).toBe("");
    expect(lintTags(fixed).diagnostics.map((d) => d.code)).not.toContain("GIT046");
  });

  it("GIT046 flags a commit set on verify too", () => {
    const result = lintTags(tagSpec({ action: "verify", names: ["v1.0.0"], commit: "HEAD" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("GIT046");
  });

  it("GIT046 does not fire on create", () => {
    const result = lintTags(tagSpec({ action: "create", names: ["v1.0.0"], commit: "HEAD" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT046");
  });

  it("a clean create spec has no diagnostics from the tags rules", () => {
    expect(lintTags(tagSpec({ action: "create", names: ["v1.0.0"] })).diagnostics).toEqual([]);
  });
});

describe("stash lint", () => {
  it("GIT047 flags drop as destructive", () => {
    const result = lintStashing(stashSpec({ action: "drop" }));
    expect(result.diagnostics.find((d) => d.code === "GIT047")!.level).toBe("destructive");
  });

  it("GIT048 flags clear as destructive and more severe than drop", () => {
    const result = lintStashing(stashSpec({ action: "clear" }));
    const diag = result.diagnostics.find((d) => d.code === "GIT048")!;
    expect(diag.level).toBe("destructive");
    expect(diag.message.toLowerCase()).toContain("every stash");
  });

  it("GIT047/GIT048 do not fire for push", () => {
    const result = lintStashing(stashSpec({ action: "push" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT047");
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT048");
  });

  it("GIT049 notes that a pop conflict is a safety feature, not destructive", () => {
    const result = lintStashing(stashSpec({ action: "pop" }));
    expect(result.diagnostics.find((d) => d.code === "GIT049")!.level).toBe("info");
  });

  it("GIT049 also fires for apply", () => {
    const result = lintStashing(stashSpec({ action: "apply" }));
    expect(result.diagnostics.find((d) => d.code === "GIT049")!.level).toBe("info");
  });

  it("GIT049 does not fire for push", () => {
    const result = lintStashing(stashSpec({ action: "push" }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("GIT049");
  });

  it("a clean push spec has no diagnostics from the stashing rules", () => {
    expect(lintStashing(stashSpec({ action: "push" })).diagnostics).toEqual([]);
  });
});

describe("tag presets", () => {
  it("preset ids are unique", () => {
    const ids = TAGS_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every preset is categorized under Tags", () => {
    for (const preset of TAGS_PRESETS) expect(preset.category).toBe("Tags");
  });

  it("'Create an annotated tag' produces a create invocation with -a and -m", () => {
    const line = tagLine(TAGS_PRESETS.find((p) => p.id === "create-annotated-tag")!.apply(tagSpec()) as GitTagSpec);
    expect(line).toBe("git tag -a -m 'Release v1.0.0' v1.0.0");
  });

  it("'Delete a tag' produces a -d invocation", () => {
    const line = tagLine(TAGS_PRESETS.find((p) => p.id === "delete-a-tag")!.apply(tagSpec()) as GitTagSpec);
    expect(line).toBe("git tag -d v1.0.0");
  });

  it("'List tags' produces a bare list invocation", () => {
    const line = tagLine(TAGS_PRESETS.find((p) => p.id === "list-tags")!.apply(tagSpec()) as GitTagSpec);
    expect(line).toBe("git tag");
  });

  it("every preset applies and renders without throwing, from any starting spec", () => {
    for (const preset of TAGS_PRESETS) {
      expect(() => tagLine(preset.apply(createSpec({ id: "draft" })) as GitTagSpec)).not.toThrow();
    }
  });
});

describe("stash presets", () => {
  it("preset ids are unique", () => {
    const ids = STASHING_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every preset is categorized under Stashing", () => {
    for (const preset of STASHING_PRESETS) expect(preset.category).toBe("Stashing");
  });

  it("'Stash all changes' is git stash push", () => {
    const line = stashLine(
      STASHING_PRESETS.find((p) => p.id === "stash-all-changes")!.apply(stashSpec()) as GitStashSpec,
    );
    expect(line).toBe("git stash push");
  });

  it("'Pop the latest stash' is git stash pop", () => {
    const line = stashLine(
      STASHING_PRESETS.find((p) => p.id === "pop-latest-stash")!.apply(stashSpec()) as GitStashSpec,
    );
    expect(line).toBe("git stash pop");
  });

  it("'List stashes' is git stash list", () => {
    const line = stashLine(
      STASHING_PRESETS.find((p) => p.id === "list-stashes")!.apply(stashSpec()) as GitStashSpec,
    );
    expect(line).toBe("git stash list");
  });

  it("every preset applies and renders without throwing, from any starting spec", () => {
    for (const preset of STASHING_PRESETS) {
      expect(() => stashLine(preset.apply(createSpec({ id: "draft" })) as GitStashSpec)).not.toThrow();
    }
  });
});

describe("describeSpec", () => {
  it("describes tag (generic — describe.ts is not yet extended per-action)", () => {
    expect(describeSpec(tagSpec({ action: "create", names: ["v1.0.0"] }))).toBe("Manage tags.");
  });

  it("describes stash (generic — describe.ts is not yet extended per-action)", () => {
    expect(describeSpec(stashSpec({ action: "push" }))).toBe("Manage the stash.");
  });
});
