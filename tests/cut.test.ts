import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CutSpec } from "@cmdgen/cut";

const line = (spec: CutSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<CutSpec> = {}): CutSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["data.csv"],
  flags: { fields: "1,3" },
  ...partial,
});

describe("argv/render", () => {
  it("renders -f with a file", () => {
    expect(line(spec())).toBe("cut -f 1,3 data.csv");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.csv", "b.csv"] }))).toBe("cut -f 1,3 a.csv b.csv");
  });

  it("renders -d before -f", () => {
    expect(line(spec({ flags: { delimiter: ",", fields: "1,3" } }))).toBe("cut -d , -f 1,3 data.csv");
  });

  it("renders -c and -b", () => {
    expect(line(spec({ flags: { characters: "1-4" } }))).toBe("cut -c 1-4 data.csv");
    expect(line(spec({ flags: { bytes: "1-4" } }))).toBe("cut -b 1-4 data.csv");
  });

  it("renders --complement", () => {
    expect(line(spec({ flags: { fields: "2", complement: true } }))).toBe("cut -f 2 --complement data.csv");
  });

  it("reads standard input when no files are given", () => {
    expect(line(spec({ files: [] }))).toBe("cut -f 1,3");
  });
});

describe("lint", () => {
  it("CUT001 catches none of -f/-c/-b given", () => {
    expect(lint(spec({ flags: {} })).diagnostics.map((d) => d.code)).toContain("CUT001");
  });

  it("CUT001 does not fire once one of -f/-c/-b is set", () => {
    expect(lint(spec({ flags: { characters: "1-4" } })).diagnostics.map((d) => d.code)).not.toContain("CUT001");
  });

  it("CUT002 catches -f with -c, and -c with -b, at error level, and the fix silences it", () => {
    const s = spec({ flags: { fields: "1", characters: "1-2" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CUT002");
    const diag = result.diagnostics.find((d) => d.code === "CUT002")!;
    expect(diag.level).toBe("error");
    expect(lint(diag.fix!.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CUT002");

    expect(
      lint(spec({ flags: { characters: "1-2", bytes: "1-2" } })).diagnostics.map((d) => d.code),
    ).toContain("CUT002");
  });

  it("CUT003 catches -d without -f, at info level, and the fix removes -d", () => {
    const s = spec({ flags: { delimiter: ",", characters: "1-4" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CUT003");
    const diag = result.diagnostics.find((d) => d.code === "CUT003")!;
    expect(diag.level).toBe("info");
    const fixed = diag.fix!.apply(s);
    expect(fixed.flags.delimiter).toBeUndefined();
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("CUT003");
  });

  it("CUT003 does not fire when -d is combined with -f", () => {
    expect(
      lint(spec({ flags: { delimiter: ",", fields: "1,3" } })).diagnostics.map((d) => d.code),
    ).not.toContain("CUT003");
  });

  it("a plain -f selection has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Extract CSV fields' is -d , -f 1,3", () => {
    expect(line(getPreset("extract-csv-fields")!.apply(spec()))).toBe("cut -d , -f 1,3 data.csv");
  });

  it("'Extract a character range' is -c 1-10", () => {
    expect(line(getPreset("extract-characters")!.apply(spec()))).toBe("cut -c 1-10 names.txt");
  });

  it("'Extract a byte range' is -b 1-4", () => {
    expect(line(getPreset("extract-bytes")!.apply(spec()))).toBe("cut -b 1-4 data.bin");
  });

  it("'Drop a field, keep the rest' is -f with --complement", () => {
    expect(line(getPreset("complement-fields")!.apply(spec()))).toBe(
      "cut -d , -f 2 --complement data.csv",
    );
  });
});

describe("describeSpec", () => {
  it("describes field extraction", () => {
    expect(describeSpec(spec())).toBe("Extract field(s) 1,3 from each line of data.csv.");
  });

  it("mentions the delimiter only alongside -f", () => {
    expect(describeSpec(spec({ flags: { delimiter: ",", fields: "1,3" } }))).toBe(
      'Extract field(s) 1,3 from each line of data.csv, splitting fields on ",".',
    );
    expect(describeSpec(spec({ flags: { delimiter: ",", characters: "1-4" } }))).toBe(
      "Extract character(s) 1-4 from each line of data.csv.",
    );
  });

  it("describes --complement as excluding the selection", () => {
    expect(describeSpec(spec({ flags: { fields: "2", complement: true } }))).toBe(
      "Exclude field(s) 2 from each line of data.csv.",
    );
  });

  it("falls back to standard input when no files are given", () => {
    expect(describeSpec(spec({ files: [] }))).toBe("Extract field(s) 1,3 from each line of standard input.");
  });
});
