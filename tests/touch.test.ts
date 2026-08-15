import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type TouchSpec } from "@cmdgen/touch";

const line = (spec: TouchSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<TouchSpec> = {}): TouchSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("files and flags", () => {
  it("a bare file with no flags", () => {
    expect(line(spec({ files: ["a.txt"] }))).toBe("touch a.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("touch a.txt b.txt");
  });

  it("renders -a/-m, -c, -h", () => {
    expect(line(spec({ files: ["a.txt"], flags: { accessOnly: true } }))).toBe("touch -a a.txt");
    expect(line(spec({ files: ["a.txt"], flags: { modifyOnly: true } }))).toBe("touch -m a.txt");
    expect(line(spec({ files: ["a.txt"], flags: { noCreate: true } }))).toBe("touch -c a.txt");
    expect(line(spec({ files: ["a.txt"], flags: { noDereference: true } }))).toBe("touch -h a.txt");
  });

  it("renders --date and -t as detached text values", () => {
    // "2 hours ago" contains spaces, so it's quoted like any other value with shell-significant characters.
    expect(line(spec({ files: ["a.txt"], flags: { date: "2 hours ago" } }))).toBe("touch --date '2 hours ago' a.txt");
    expect(line(spec({ files: ["a.txt"], flags: { stamp: "202601011200" } }))).toBe("touch -t 202601011200 a.txt");
  });

  it("renders --reference attached with =", () => {
    expect(line(spec({ files: ["a.txt"], flags: { reference: "template.txt" } }))).toBe(
      "touch --reference=template.txt a.txt",
    );
  });
});

describe("lint", () => {
  it("TOUCH001 catches no files", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("TOUCH001");
  });

  it("TOUCH002 catches --reference with --date", () => {
    const s = spec({ files: ["a.txt"], flags: { reference: "t.txt", date: "now" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("TOUCH002");
    const fix = result.diagnostics.find((d) => d.code === "TOUCH002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("TOUCH002");
  });

  it("TOUCH002 catches --reference with -t too", () => {
    const s = spec({ files: ["a.txt"], flags: { reference: "t.txt", stamp: "202601011200" } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("TOUCH002");
  });

  it("-a and -m together is valid, real touch usage — never flagged", () => {
    const s = spec({ files: ["a.txt"], flags: { accessOnly: true, modifyOnly: true } });
    expect(lint(s).diagnostics).toEqual([]);
  });

  it("a plain touch has no diagnostics", () => {
    expect(lint(spec({ files: ["a.txt"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Create if missing' is a bare touch", () => {
    expect(line(getPreset("create-if-missing")!.apply(spec()))).toBe("touch newfile.txt");
  });

  it("'Update access time only' is -a", () => {
    expect(line(getPreset("access-time-only")!.apply(spec()))).toBe("touch -a file.txt");
  });

  it("'Backdate to a reference file' is --reference", () => {
    expect(line(getPreset("backdate-from-reference")!.apply(spec()))).toBe("touch --reference=template.txt file.txt");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ files: ["a.txt"] }))).toBe(
      "Update both the access and modification time of a.txt, using the current time.",
    );
  });

  it("describes --reference", () => {
    expect(describeSpec(spec({ files: ["a.txt"], flags: { reference: "t.txt" } }))).toContain("copying the timestamp from t.txt");
  });
});
