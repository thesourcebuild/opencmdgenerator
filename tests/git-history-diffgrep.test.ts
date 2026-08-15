import { describe, expect, it } from "vitest";
import { renderOneLine, validateCatalogue, type Arg } from "@cmdgen/engine";
import type { LintRule } from "@cmdgen/contracts/diagnostic";
import {
  createSpec,
  describeSpec,
  type GitBlameSpec,
  type GitDiffSpec,
  type GitGrepSpec,
  type GitLogSpec,
  type GitShowSpec,
  type GitSpec,
  type GitStatusSpec,
  BLAME_FLAGS,
  LOG_FLAGS,
  SHOW_FLAGS,
  STATUS_FLAGS,
  DIFF_FLAGS,
  GREP_FLAGS,
  buildBlameArgv,
  buildLogArgv,
  buildShowArgv,
  buildStatusArgv,
  buildDiffArgv,
  buildGrepArgv,
  HISTORY_RULES,
  DIFFGREP_RULES,
  HISTORY_PRESETS,
  DIFFGREP_PRESETS,
} from "@cmdgen/git";

function lineFor(subcommand: string, args: Arg[], shell: GitSpec["shell"]): string {
  return renderOneLine({ binary: "git", args: [{ text: subcommand, role: "value" }, ...args] }, { shell });
}

const logLine = (spec: GitLogSpec) => lineFor("log", buildLogArgv(spec), spec.shell);
const showLine = (spec: GitShowSpec) => lineFor("show", buildShowArgv(spec), spec.shell);
const blameLine = (spec: GitBlameSpec) => lineFor("blame", buildBlameArgv(spec), spec.shell);
const statusLine = (spec: GitStatusSpec) => lineFor("status", buildStatusArgv(spec), spec.shell);
const diffLine = (spec: GitDiffSpec) => lineFor("diff", buildDiffArgv(spec), spec.shell);
const grepLine = (spec: GitGrepSpec) => lineFor("grep", buildGrepArgv(spec), spec.shell);

/** Every preset in this batch only ever targets one of these six subcommands. */
function renderAny(spec: GitSpec): string {
  switch (spec.subcommand) {
    case "log":
      return logLine(spec);
    case "show":
      return showLine(spec);
    case "blame":
      return blameLine(spec);
    case "status":
      return statusLine(spec);
    case "diff":
      return diffLine(spec);
    case "grep":
      return grepLine(spec);
    default:
      throw new Error(`no renderer wired up in this test file for subcommand ${spec.subcommand}`);
  }
}

function checkRules(rules: readonly LintRule<GitSpec>[], spec: GitSpec) {
  return rules.flatMap((r) => r.check(spec));
}

const logSpec = (partial: Partial<GitLogSpec> = {}): GitLogSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "log" }) as GitLogSpec),
  ...partial,
});
const showSpec = (partial: Partial<GitShowSpec> = {}): GitShowSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "show" }) as GitShowSpec),
  ...partial,
});
const blameSpec = (partial: Partial<GitBlameSpec> = {}): GitBlameSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "blame" }) as GitBlameSpec),
  ...partial,
});
const statusSpec = (partial: Partial<GitStatusSpec> = {}): GitStatusSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "status" }) as GitStatusSpec),
  ...partial,
});
const diffSpec = (partial: Partial<GitDiffSpec> = {}): GitDiffSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "diff" }) as GitDiffSpec),
  ...partial,
});
const grepSpec = (partial: Partial<GitGrepSpec> = {}): GitGrepSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "grep" }) as GitGrepSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every History & Inspection / Diff & Grep catalogue is internally consistent", () => {
    expect(validateCatalogue(LOG_FLAGS)).toEqual([]);
    expect(validateCatalogue(SHOW_FLAGS)).toEqual([]);
    expect(validateCatalogue(BLAME_FLAGS)).toEqual([]);
    expect(validateCatalogue(STATUS_FLAGS)).toEqual([]);
    expect(validateCatalogue(DIFF_FLAGS)).toEqual([]);
    expect(validateCatalogue(GREP_FLAGS)).toEqual([]);
  });
});

describe("log", () => {
  it("renders bare with nothing set", () => {
    expect(logLine(logSpec())).toBe("git log");
  });

  it("renders a bare revision range with no paths", () => {
    expect(logLine(logSpec({ revisionRange: "main..feature" }))).toBe("git log main..feature");
  });

  it("always emits -- when paths are present, with no range", () => {
    expect(logLine(logSpec({ paths: ["a.ts"] }))).toBe("git log -- a.ts");
  });

  it("always emits -- when paths are present, even alongside a range", () => {
    expect(logLine(logSpec({ revisionRange: "main..feature", paths: ["a.ts"] }))).toBe(
      "git log main..feature -- a.ts",
    );
  });

  it("renders -n for maxCount, not --max-count=", () => {
    expect(logLine(logSpec({ flags: { maxCount: 5 } }))).toBe("git log -n 5");
  });

  it("renders --oneline --graph --all together, in catalogue order", () => {
    expect(logLine(logSpec({ flags: { oneline: true, graph: true, all: true } }))).toBe(
      "git log --oneline --graph --all",
    );
  });

  it("renders --grep with a quoted value when it contains a space", () => {
    expect(logLine(logSpec({ flags: { commitGrep: "fix bug" } }))).toBe("git log --grep='fix bug'");
  });

  it("renders -p for patch", () => {
    expect(logLine(logSpec({ flags: { patch: true } }))).toBe("git log -p");
  });
});

describe("show", () => {
  it("renders bare with no objects", () => {
    expect(showLine(showSpec())).toBe("git show");
  });

  it("renders objects in the order given", () => {
    expect(showLine(showSpec({ objects: ["HEAD", "abc123"] }))).toBe("git show HEAD abc123");
  });

  it("renders --stat --name-only", () => {
    expect(showLine(showSpec({ flags: { stat: true, nameOnly: true } }))).toBe("git show --stat --name-only");
  });
});

describe("blame", () => {
  it("renders bare with no file and no revision", () => {
    expect(blameLine(blameSpec())).toBe("git blame");
  });

  it("always emits -- before file, even with no revision", () => {
    expect(blameLine(blameSpec({ file: "src/index.ts" }))).toBe("git blame -- src/index.ts");
  });

  it("renders the revision before the -- separator, quoted when needed", () => {
    expect(blameLine(blameSpec({ file: "src/index.ts", revision: "HEAD~1" }))).toBe(
      "git blame 'HEAD~1' -- src/index.ts",
    );
  });

  it("renders -L with a space, not attached", () => {
    expect(blameLine(blameSpec({ file: "src/index.ts", flags: { lineRange: "10,20" } }))).toBe(
      "git blame -L 10,20 -- src/index.ts",
    );
  });
});

describe("status", () => {
  it("renders bare with no paths", () => {
    expect(statusLine(statusSpec())).toBe("git status");
  });

  it("always emits -- when paths are present", () => {
    expect(statusLine(statusSpec({ paths: ["a.txt"] }))).toBe("git status -- a.txt");
  });

  it("renders -s for short", () => {
    expect(statusLine(statusSpec({ flags: { short: true } }))).toBe("git status -s");
  });
});

describe("diff", () => {
  it("renders bare with nothing set", () => {
    expect(diffLine(diffSpec())).toBe("git diff");
  });

  it("renders a bare revision range with no paths", () => {
    expect(diffLine(diffSpec({ revisionRange: "main..feature" }))).toBe("git diff main..feature");
  });

  it("always emits -- when paths are present, even alongside a range", () => {
    expect(diffLine(diffSpec({ revisionRange: "main..feature", paths: ["a.ts"] }))).toBe(
      "git diff main..feature -- a.ts",
    );
  });

  it("renders --staged", () => {
    expect(diffLine(diffSpec({ flags: { staged: true } }))).toBe("git diff --staged");
  });

  it("renders -w and -b", () => {
    expect(diffLine(diffSpec({ flags: { ignoreAllSpace: true } }))).toBe("git diff -w");
    expect(diffLine(diffSpec({ flags: { ignoreSpaceChange: true } }))).toBe("git diff -b");
  });

  it("renders --unified=<n>", () => {
    expect(diffLine(diffSpec({ flags: { unified: 3 } }))).toBe("git diff --unified=3");
  });
});

describe("grep", () => {
  it("renders bare with no pattern", () => {
    expect(grepLine(grepSpec())).toBe("git grep");
  });

  it("renders a bare pattern", () => {
    expect(grepLine(grepSpec({ pattern: "TODO" }))).toBe("git grep TODO");
  });

  it("renders -e before a pattern that starts with a dash", () => {
    expect(grepLine(grepSpec({ pattern: "-x" }))).toBe("git grep -e -x");
  });

  it("renders revisions after the pattern, before any --", () => {
    expect(grepLine(grepSpec({ pattern: "TODO", revisions: ["HEAD", "abc"] }))).toBe("git grep TODO HEAD abc");
  });

  it("always emits -- when paths are present", () => {
    expect(grepLine(grepSpec({ pattern: "TODO", paths: ["src/"] }))).toBe("git grep TODO -- src/");
  });

  it("renders pattern, revisions, and paths together", () => {
    expect(grepLine(grepSpec({ pattern: "TODO", revisions: ["HEAD"], paths: ["src/"] }))).toBe(
      "git grep TODO HEAD -- src/",
    );
  });

  it("renders flags before the pattern", () => {
    expect(grepLine(grepSpec({ pattern: "TODO", flags: { ignoreCase: true, lineNumber: true } }))).toBe(
      "git grep -i -n TODO",
    );
  });

  it("renders -C with a space, not attached", () => {
    expect(grepLine(grepSpec({ pattern: "TODO", flags: { context: 3 } }))).toBe("git grep -C 3 TODO");
  });
});

describe("lint", () => {
  it("GIT031 flags --follow with zero paths as a warning", () => {
    const diags = checkRules(HISTORY_RULES, logSpec({ flags: { follow: true }, paths: [] }));
    expect(diags.find((d) => d.code === "GIT031")!.level).toBe("warning");
  });

  it("GIT031 flags --follow with multiple paths as a warning", () => {
    const diags = checkRules(HISTORY_RULES, logSpec({ flags: { follow: true }, paths: ["a.ts", "b.ts"] }));
    expect(diags.find((d) => d.code === "GIT031")!.level).toBe("warning");
  });

  it("GIT031 does not fire with --follow and exactly one path", () => {
    const diags = checkRules(HISTORY_RULES, logSpec({ flags: { follow: true }, paths: ["a.ts"] }));
    expect(diags.map((d) => d.code)).not.toContain("GIT031");
  });

  it("GIT032 flags --short + --long as an error", () => {
    const diags = checkRules(HISTORY_RULES, statusSpec({ flags: { short: true, long: true } }));
    expect(diags.find((d) => d.code === "GIT032")!.level).toBe("error");
  });

  it("GIT032 flags --short + --porcelain as an error", () => {
    const diags = checkRules(HISTORY_RULES, statusSpec({ flags: { short: true, porcelain: "v1" } }));
    expect(diags.find((d) => d.code === "GIT032")!.level).toBe("error");
  });

  it("GIT032 does not fire for just one of the three", () => {
    const diags = checkRules(HISTORY_RULES, statusSpec({ flags: { short: true } }));
    expect(diags.map((d) => d.code)).not.toContain("GIT032");
  });

  it("GIT033 flags --no-index combined with a revision range, and the fix clears the range", () => {
    const s = diffSpec({ flags: { noIndex: true }, revisionRange: "main..feature" });
    const diags = checkRules(DIFFGREP_RULES, s);
    const diag = diags.find((d) => d.code === "GIT033")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitDiffSpec;
    expect(fixed.revisionRange).toBe("");
  });

  it("GIT034 flags --staged combined with a revision range, and the fix clears the range", () => {
    const s = diffSpec({ flags: { staged: true }, revisionRange: "main..feature" });
    const diags = checkRules(DIFFGREP_RULES, s);
    const diag = diags.find((d) => d.code === "GIT034")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s) as GitDiffSpec;
    expect(fixed.revisionRange).toBe("");
  });

  it("GIT035 names three-dot notation as an info note", () => {
    const diags = checkRules(DIFFGREP_RULES, diffSpec({ revisionRange: "main...feature" }));
    const diag = diags.find((d) => d.code === "GIT035")!;
    expect(diag.level).toBe("info");
    expect(diag.message).toContain("three-dot");
  });

  it("GIT035 names two-dot notation as an info note", () => {
    const diags = checkRules(DIFFGREP_RULES, diffSpec({ revisionRange: "main..feature" }));
    const diag = diags.find((d) => d.code === "GIT035")!;
    expect(diag.level).toBe("info");
    expect(diag.message).toContain("two-dot");
  });

  it("GIT035 does not fire for a bare single revision or an empty range", () => {
    expect(checkRules(DIFFGREP_RULES, diffSpec({ revisionRange: "main" })).map((d) => d.code)).not.toContain(
      "GIT035",
    );
    expect(checkRules(DIFFGREP_RULES, diffSpec({ revisionRange: "" })).map((d) => d.code)).not.toContain("GIT035");
  });

  it("GIT036 flags -E + -F as an error", () => {
    const diags = checkRules(DIFFGREP_RULES, grepSpec({ flags: { extendedRegexp: true, fixedStrings: true } }));
    expect(diags.find((d) => d.code === "GIT036")!.level).toBe("error");
  });

  it("GIT036 does not fire for just one regex mode", () => {
    const diags = checkRules(DIFFGREP_RULES, grepSpec({ flags: { extendedRegexp: true } }));
    expect(diags.map((d) => d.code)).not.toContain("GIT036");
  });
});

describe("presets", () => {
  it("'Compact graph log' is git log --oneline --graph --all", () => {
    const preset = HISTORY_PRESETS.find((p) => p.id === "compact-graph-log")!;
    expect(renderAny(preset.apply(logSpec()))).toBe("git log --oneline --graph --all");
  });

  it("'Show the last commit' is a bare git show", () => {
    const preset = HISTORY_PRESETS.find((p) => p.id === "show-last-commit")!;
    expect(renderAny(preset.apply(showSpec()))).toBe("git show");
  });

  it("'Blame a file' fills in a placeholder file", () => {
    const preset = HISTORY_PRESETS.find((p) => p.id === "blame-a-file")!;
    expect(renderAny(preset.apply(blameSpec()))).toBe("git blame -- path/to/file");
  });

  it("'Diff staged changes' is git diff --staged", () => {
    const preset = DIFFGREP_PRESETS.find((p) => p.id === "diff-staged-changes")!;
    expect(renderAny(preset.apply(diffSpec()))).toBe("git diff --staged");
  });

  it("'Search the codebase' fills in a placeholder pattern", () => {
    const preset = DIFFGREP_PRESETS.find((p) => p.id === "search-the-codebase")!;
    expect(renderAny(preset.apply(grepSpec()))).toBe("git grep -n TODO");
  });

  it("every History & Inspection / Diff & Grep preset applies and renders without throwing", () => {
    for (const preset of [...HISTORY_PRESETS, ...DIFFGREP_PRESETS]) {
      expect(() => renderAny(preset.apply(createSpec({ id: "draft" })))).not.toThrow();
    }
  });

  it("preset ids are unique across both new files", () => {
    const ids = [...HISTORY_PRESETS, ...DIFFGREP_PRESETS].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("describeSpec", () => {
  it("describes log", () => {
    expect(describeSpec(logSpec())).toBe("Show commit history.");
  });

  it("describes show", () => {
    expect(describeSpec(showSpec({ objects: ["abc123"] }))).toBe("Show abc123.");
  });

  it("describes blame", () => {
    expect(describeSpec(blameSpec({ file: "src/index.ts" }))).toBe("Show line-by-line history of src/index.ts.");
  });

  it("describes status", () => {
    expect(describeSpec(statusSpec())).toBe("Show the working tree status.");
  });

  it("describes diff", () => {
    expect(describeSpec(diffSpec())).toBe("Show changes.");
  });

  it("describes grep", () => {
    expect(describeSpec(grepSpec({ pattern: "TODO" }))).toBe('Search for "TODO" in tracked files.');
  });
});
