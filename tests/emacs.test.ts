import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type EmacsSpec } from "@cmdgen/emacs";

const line = (spec: EmacsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<EmacsSpec> = {}): EmacsSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["notes.txt"],
  ...partial,
});

describe("files and flags", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("emacs notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("emacs a.txt b.txt");
  });

  it("renders no files at all", () => {
    expect(line(spec({ files: [] }))).toBe("emacs");
  });

  it("renders -nw, -Q, --daemon", () => {
    expect(line(spec({ flags: { noWindowSystem: true } }))).toBe("emacs -nw notes.txt");
    expect(line(spec({ flags: { quickStart: true } }))).toBe("emacs -Q notes.txt");
    expect(line(spec({ flags: { daemon: true } }))).toBe("emacs --daemon notes.txt");
  });

  it("skips blank file entries", () => {
    expect(line(spec({ files: ["", "notes.txt", "  "] }))).toBe("emacs notes.txt");
  });
});

describe("lint", () => {
  it("EMC001 notes an empty scratch buffer when no files are given", () => {
    const result = lint(spec({ files: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("EMC001");
    expect(result.diagnostics.find((d) => d.code === "EMC001")!.level).toBe("info");
    expect(result.hasErrors).toBe(false);
  });

  it("EMC002 notes that --daemon starts a background server", () => {
    const result = lint(spec({ flags: { daemon: true } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("EMC002");
    expect(result.diagnostics.find((d) => d.code === "EMC002")!.level).toBe("info");
  });

  it("EMC003 notes that -nw has no effect alongside --daemon", () => {
    const result = lint(spec({ flags: { daemon: true, noWindowSystem: true } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("EMC003");
    expect(lint(spec({ flags: { noWindowSystem: true } })).diagnostics.map((d) => d.code)).not.toContain("EMC003");
  });

  it("a plain emacs with a file has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Edit a file' is a bare emacs", () => {
    expect(line(getPreset("edit-a-file")!.apply(spec()))).toBe("emacs notes.txt");
  });

  it("'Terminal mode (no GUI)' is -nw", () => {
    expect(line(getPreset("terminal-mode")!.apply(spec()))).toBe("emacs -nw notes.txt");
  });

  it("'Quick edit, skip init file' is -Q", () => {
    expect(line(getPreset("quick-edit")!.apply(spec()))).toBe("emacs -Q notes.txt");
  });

  it("'Start a background server' is --daemon with no files", () => {
    expect(line(getPreset("start-server")!.apply(spec()))).toBe("emacs --daemon");
  });
});

describe("describeSpec", () => {
  it("describes a plain edit", () => {
    expect(describeSpec(spec())).toBe("Open notes.txt in Emacs.");
  });

  it("describes an empty scratch buffer", () => {
    expect(describeSpec(spec({ files: [] }))).toBe("Open an empty scratch buffer in Emacs.");
  });

  it("describes terminal mode and skipping the init file together", () => {
    expect(describeSpec(spec({ flags: { noWindowSystem: true, quickStart: true } }))).toBe(
      "Open notes.txt in Emacs, in the terminal instead of a graphical window, skipping the init file.",
    );
  });

  it("describes the daemon short-circuit", () => {
    expect(describeSpec(spec({ flags: { daemon: true } }))).toBe(
      "Start an Emacs server in the background, to be connected to later with emacsclient.",
    );
  });
});
