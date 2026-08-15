import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WhichSpec } from "@cmdgen/which";

const line = (spec: WhichSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<WhichSpec> = {}): WhichSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("names and flags", () => {
  it("a bare name with no flags", () => {
    expect(line(spec({ names: ["ls"] }))).toBe("which ls");
  });

  it("renders multiple names in order", () => {
    expect(line(spec({ names: ["ls", "git", "node"] }))).toBe("which ls git node");
  });

  it("renders -a and -s", () => {
    expect(line(spec({ names: ["ls"], flags: { all: true } }))).toBe("which -a ls");
    expect(line(spec({ names: ["ls"], flags: { silent: true } }))).toBe("which -s ls");
  });

  it("combines -a and -s with names last", () => {
    expect(line(spec({ names: ["ls"], flags: { all: true, silent: true } }))).toBe("which -a -s ls");
  });

  it("renders just the binary with no names", () => {
    expect(line(spec({ names: [] }))).toBe("which");
  });

  it("trims whitespace and skips blank entries", () => {
    expect(line(spec({ names: ["  ls  ", "  ", "git"] }))).toBe("which ls git");
  });
});

describe("lint", () => {
  it("WHC001 catches no command names", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("WHC001");
  });

  it("WHC001 also catches only whitespace-only names", () => {
    expect(lint(spec({ names: ["   "] })).diagnostics.map((d) => d.code)).toContain("WHC001");
  });

  it("a plain which has no diagnostics", () => {
    expect(lint(spec({ names: ["ls"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Locate a command' is a bare which", () => {
    expect(line(getPreset("locate-a-command")!.apply(spec()))).toBe("which ls");
  });

  it("'Locate every match in PATH' is -a", () => {
    expect(line(getPreset("locate-every-match")!.apply(spec()))).toBe("which -a ls");
  });

  it("'Silent existence check' is -s", () => {
    expect(line(getPreset("silent-check")!.apply(spec()))).toBe("which -s ls");
  });

  it("'Check multiple commands' looks up several names at once", () => {
    expect(line(getPreset("check-multiple")!.apply(spec()))).toBe("which ls git node");
  });
});

describe("describeSpec", () => {
  it("describes a single name", () => {
    expect(describeSpec(spec({ names: ["ls"] }))).toBe("Locate ls in PATH.");
  });

  it("describes an empty list with the SOME_COMMAND placeholder", () => {
    expect(describeSpec(spec())).toBe("Locate SOME_COMMAND in PATH.");
  });

  it("describes multiple names by count", () => {
    expect(describeSpec(spec({ names: ["ls", "git", "node"] }))).toBe("Locate 3 commands in PATH.");
  });

  it("mentions -a as a trailing clause", () => {
    expect(describeSpec(spec({ names: ["ls"], flags: { all: true } }))).toBe(
      "Locate ls in PATH, reporting every matching executable, not just the first.",
    );
  });

  it("-s takes priority over -a in the description when both are set", () => {
    expect(describeSpec(spec({ names: ["ls"], flags: { all: true, silent: true } }))).toBe(
      "Locate ls in PATH, printing nothing and only setting the exit status.",
    );
  });
});
