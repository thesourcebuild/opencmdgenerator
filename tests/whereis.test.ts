import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WhereisSpec } from "@cmdgen/whereis";

const line = (spec: WhereisSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<WhereisSpec> = {}): WhereisSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("command and flags", () => {
  it("a bare command with no flags", () => {
    expect(line(spec({ command: "ls" }))).toBe("whereis ls");
  });

  it("renders -b, -m, -s individually", () => {
    expect(line(spec({ command: "ls", flags: { binaryOnly: true } }))).toBe("whereis -b ls");
    expect(line(spec({ command: "ls", flags: { manualOnly: true } }))).toBe("whereis -m ls");
    expect(line(spec({ command: "ls", flags: { sourceOnly: true } }))).toBe("whereis -s ls");
  });

  it("renders -u", () => {
    expect(line(spec({ command: "ls", flags: { unusual: true } }))).toBe("whereis -u ls");
  });

  it("combines -b and -u with the command name last", () => {
    expect(line(spec({ command: "ls", flags: { binaryOnly: true, unusual: true } }))).toBe("whereis -b -u ls");
  });
});

describe("lint", () => {
  it("WHEREIS001 catches no command name", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("WHEREIS001");
  });

  it("WHEREIS001 also catches a whitespace-only command name", () => {
    expect(lint(spec({ command: "   " })).diagnostics.map((d) => d.code)).toContain("WHEREIS001");
  });

  it("a plain whereis has no diagnostics", () => {
    expect(lint(spec({ command: "ls" })).diagnostics).toEqual([]);
  });

  it("WHEREIS002 catches -b and -m both set", () => {
    const s = spec({ command: "ls", flags: { binaryOnly: true, manualOnly: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("WHEREIS002");
    const fix = result.diagnostics.find((d) => d.code === "WHEREIS002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("WHEREIS002");
  });

  it("WHEREIS002 catches -m and -s together too", () => {
    const s = spec({ command: "ls", flags: { manualOnly: true, sourceOnly: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("WHEREIS002");
  });

  it("only one of -b/-m/-s set is never flagged", () => {
    const s = spec({ command: "ls", flags: { sourceOnly: true } });
    expect(lint(s).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Locate binary, manual, and source' is a bare whereis", () => {
    expect(line(getPreset("locate-everything")!.apply(spec()))).toBe("whereis ls");
  });

  it("'Binary path only' is -b", () => {
    expect(line(getPreset("binary-only")!.apply(spec()))).toBe("whereis -b ls");
  });

  it("'Find commands with unusual results' is -u", () => {
    expect(line(getPreset("find-gaps")!.apply(spec()))).toBe("whereis -u ls");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ command: "ls" }))).toBe("Locate the binary, manual page, and source for ls.");
  });

  it("describes an empty command with the SOME_COMMAND placeholder", () => {
    expect(describeSpec(spec())).toBe("Locate the binary, manual page, and source for SOME_COMMAND.");
  });

  it("narrows the sentence to just the binary when -b is set", () => {
    expect(describeSpec(spec({ command: "ls", flags: { binaryOnly: true } }))).toBe("Locate the binary for ls.");
  });

  it("narrows the sentence to just the manual page when -m is set", () => {
    expect(describeSpec(spec({ command: "ls", flags: { manualOnly: true } }))).toBe("Locate the manual page for ls.");
  });

  it("narrows the sentence to just the source when -s is set", () => {
    expect(describeSpec(spec({ command: "ls", flags: { sourceOnly: true } }))).toBe("Locate the source for ls.");
  });

  it("mentions -u as a trailing clause", () => {
    expect(describeSpec(spec({ command: "ls", flags: { unusual: true } }))).toBe(
      "Locate the binary, manual page, and source for ls, reporting commands with an unusual number of results.",
    );
  });
});
