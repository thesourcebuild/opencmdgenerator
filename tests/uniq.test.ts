import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UniqSpec } from "@cmdgen/uniq";

const line = (spec: UniqSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UniqSpec> = {}): UniqSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["names.txt"],
  ...partial,
});

describe("argv/render", () => {
  it("a bare file", () => {
    expect(line(spec())).toBe("uniq names.txt");
  });

  it("renders an input and an output file, in order", () => {
    expect(line(spec({ files: ["in.txt", "out.txt"] }))).toBe("uniq in.txt out.txt");
  });

  it("renders -c, -d, -u, -i", () => {
    expect(line(spec({ flags: { count: true } }))).toBe("uniq -c names.txt");
    expect(line(spec({ flags: { repeated: true } }))).toBe("uniq -d names.txt");
    expect(line(spec({ flags: { unique: true } }))).toBe("uniq -u names.txt");
    expect(line(spec({ flags: { ignoreCase: true } }))).toBe("uniq -i names.txt");
  });

  it("renders -f with a number", () => {
    expect(line(spec({ flags: { skipFields: 2 } }))).toBe("uniq -f 2 names.txt");
  });

  it("reads/writes standard input/output when no files are given", () => {
    expect(line(spec({ files: [] }))).toBe("uniq");
  });
});

describe("lint", () => {
  it("UNQ001 catches -d with -u, at error level, and the fix silences it", () => {
    const s = spec({ flags: { repeated: true, unique: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("UNQ001");
    const diag = result.diagnostics.find((d) => d.code === "UNQ001")!;
    expect(diag.level).toBe("error");
    expect(lint(diag.fix!.apply(s)).diagnostics.map((d) => d.code)).not.toContain("UNQ001");
  });

  it("UNQ002 always reminds that uniq only removes adjacent duplicates, at info level", () => {
    const diags = lint(spec()).diagnostics;
    expect(diags.map((d) => d.code)).toContain("UNQ002");
    expect(diags.find((d) => d.code === "UNQ002")!.level).toBe("info");
  });

  it("a plain uniq has only the UNQ002 reminder", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toEqual(["UNQ002"]);
  });
});

describe("presets", () => {
  it("'Count occurrences' is -c", () => {
    expect(line(getPreset("count-duplicates")!.apply(spec()))).toBe("uniq -c access.log");
  });

  it("'Only repeated lines' is -d", () => {
    expect(line(getPreset("only-repeated-lines")!.apply(spec()))).toBe("uniq -d names.txt");
  });

  it("'Only non-repeated lines' is -u", () => {
    expect(line(getPreset("only-unique-lines")!.apply(spec()))).toBe("uniq -u names.txt");
  });

  it("'Case-insensitive dedup' is -i", () => {
    expect(line(getPreset("case-insensitive")!.apply(spec()))).toBe("uniq -i names.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain filter", () => {
    expect(describeSpec(spec())).toBe("Filter adjacent duplicate lines in names.txt.");
  });

  it("describes -d and -u as different selections", () => {
    expect(describeSpec(spec({ flags: { repeated: true } }))).toBe(
      "Print only the repeated adjacent duplicate lines in names.txt.",
    );
    expect(describeSpec(spec({ flags: { unique: true } }))).toBe(
      "Print only the non-repeated adjacent duplicate lines in names.txt.",
    );
  });

  it("mentions an output file, -c, -i, and -f", () => {
    expect(describeSpec(spec({ files: ["in.txt", "out.txt"] }))).toContain("writing the result to out.txt");
    expect(describeSpec(spec({ flags: { count: true } }))).toContain("prefixing each line with its occurrence count");
    expect(describeSpec(spec({ flags: { ignoreCase: true } }))).toContain("folding case when comparing");
    expect(describeSpec(spec({ flags: { skipFields: 2 } }))).toContain("ignoring the first 2 field(s) when comparing");
  });

  it("falls back to standard input when no files are given", () => {
    expect(describeSpec(spec({ files: [] }))).toBe("Filter adjacent duplicate lines in standard input.");
  });
});
