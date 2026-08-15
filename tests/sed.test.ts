import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SedSpec } from "@cmdgen/sed";

const line = (spec: SedSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SedSpec> = {}): SedSpec => ({
  ...createSpec({ id: "test-spec" }),
  script: "s/foo/bar/",
  files: ["notes.txt"],
  ...partial,
});

describe("argv/render", () => {
  it("a bare script and file — / is POSIX-safe, so no quoting is needed", () => {
    expect(line(spec())).toBe("sed s/foo/bar/ notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("sed s/foo/bar/ a.txt b.txt");
  });

  it("renders -n and -r", () => {
    expect(line(spec({ flags: { quiet: true } }))).toBe("sed -n s/foo/bar/ notes.txt");
    expect(line(spec({ flags: { extendedRegexp: true } }))).toBe("sed -r s/foo/bar/ notes.txt");
  });

  it("renders -i with an attached suffix, no space", () => {
    expect(line(spec({ inPlace: true, backupSuffix: ".bak" }))).toBe("sed -i.bak s/foo/bar/ notes.txt");
  });

  it("renders a bare -i when the backup suffix is empty", () => {
    expect(line(spec({ inPlace: true, backupSuffix: "" }))).toBe("sed -i s/foo/bar/ notes.txt");
  });

  it("renders a single expression bare, with no -e", () => {
    expect(line(spec())).toBe("sed s/foo/bar/ notes.txt");
  });

  it("renders every expression behind its own -e once there is more than one", () => {
    expect(line(spec({ extraExpressions: ["s/baz/qux/"] }))).toBe(
      "sed -e s/foo/bar/ -e s/baz/qux/ notes.txt",
    );
    expect(line(spec({ extraExpressions: ["s/baz/qux/", "s/a/b/"] }))).toBe(
      "sed -e s/foo/bar/ -e s/baz/qux/ -e s/a/b/ notes.txt",
    );
  });

  it("drops blank extra expressions and blank files", () => {
    expect(line(spec({ extraExpressions: ["", "  "], files: ["", "notes.txt"] }))).toBe(
      "sed s/foo/bar/ notes.txt",
    );
  });

  it("reads standard input when no files are given", () => {
    expect(line(spec({ files: [] }))).toBe("sed s/foo/bar/");
  });

  it("uses the sole non-blank extra expression bare when script itself is blank", () => {
    expect(line(spec({ script: "", extraExpressions: ["s/a/b/"] }))).toBe("sed s/a/b/ notes.txt");
  });

  it("quotes an expression containing shell-unsafe characters", () => {
    expect(line(spec({ script: "s/[0-9]+/NUM/" }))).toBe("sed 's/[0-9]+/NUM/' notes.txt");
  });
});

describe("lint", () => {
  it("SED001 catches an empty script with no extra expressions", () => {
    expect(lint(spec({ script: "" })).diagnostics.map((d) => d.code)).toContain("SED001");
  });

  it("SED001 does not fire when an extra expression covers for a blank script", () => {
    expect(lint(spec({ script: "", extraExpressions: ["s/a/b/"] })).diagnostics.map((d) => d.code)).not.toContain(
      "SED001",
    );
  });

  it("SED002 catches -i with an empty backup suffix, at destructive level, and the fix silences it", () => {
    const s = spec({ inPlace: true, backupSuffix: "" });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("SED002");
    const diag = result.diagnostics.find((d) => d.code === "SED002")!;
    expect(diag.level).toBe("destructive");
    const fixed = diag.fix!.apply(s);
    expect(fixed.backupSuffix).toBe(".bak");
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("SED002");
  });

  it("SED002 does not fire when -i has a non-empty suffix, or when -i is not set", () => {
    expect(lint(spec({ inPlace: true, backupSuffix: ".bak" })).diagnostics.map((d) => d.code)).not.toContain(
      "SED002",
    );
    expect(lint(spec({ inPlace: false, backupSuffix: "" })).diagnostics.map((d) => d.code)).not.toContain(
      "SED002",
    );
  });

  it("a plain substitution has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Substitute text' is a bare sed", () => {
    expect(line(getPreset("substitute-in-file")!.apply(spec()))).toBe("sed s/foo/bar/ notes.txt");
  });

  it("'Print only matching lines' is -n with a p-suffixed script", () => {
    expect(line(getPreset("quiet-print-matching")!.apply(spec()))).toBe("sed -n /TODO/p notes.txt");
  });

  it("'Edit in place, with a backup' is -i.bak", () => {
    expect(line(getPreset("in-place-edit-with-backup")!.apply(spec()))).toBe(
      "sed -i.bak s/foo/bar/ notes.txt",
    );
  });

  it("'Multiple expressions' uses two -e flags", () => {
    expect(line(getPreset("multiple-expressions")!.apply(spec()))).toBe(
      "sed -e s/foo/bar/ -e s/baz/qux/ notes.txt",
    );
  });

  it("'Extended regular expressions' is -r, quoted for its bracket expression", () => {
    expect(line(getPreset("extended-regexp")!.apply(spec()))).toBe(
      "sed -r 's/[0-9]+/NUM/' notes.txt",
    );
  });
});

describe("describeSpec", () => {
  it("describes a plain substitution", () => {
    expect(describeSpec(spec())).toBe('Run the sed script "s/foo/bar/" over notes.txt.');
  });

  it("mentions -n, -r, and in-place editing", () => {
    expect(describeSpec(spec({ flags: { quiet: true } }))).toContain(
      "suppressing automatic printing of each line (-n)",
    );
    expect(describeSpec(spec({ flags: { extendedRegexp: true } }))).toContain(
      "using extended regular expressions (-r)",
    );
  });

  it("distinguishes in-place with a backup from in-place with none", () => {
    expect(describeSpec(spec({ inPlace: true, backupSuffix: ".bak" }))).toContain(
      'backing up the original with a ".bak" suffix',
    );
    expect(describeSpec(spec({ inPlace: true, backupSuffix: "" }))).toContain(
      "editing each file in place with NO backup copy",
    );
  });
});
