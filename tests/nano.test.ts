import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type NanoSpec } from "@cmdgen/nano";

const line = (spec: NanoSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<NanoSpec> = {}): NanoSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["notes.txt"],
  ...partial,
});

describe("files and flags", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("nano notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("nano a.txt b.txt");
  });

  it("renders -l, -w, -B, -m", () => {
    expect(line(spec({ flags: { lineNumbers: true } }))).toBe("nano -l notes.txt");
    expect(line(spec({ flags: { noWrap: true } }))).toBe("nano -w notes.txt");
    expect(line(spec({ flags: { backup: true } }))).toBe("nano -B notes.txt");
    expect(line(spec({ flags: { mouse: true } }))).toBe("nano -m notes.txt");
  });

  it("skips blank file entries", () => {
    expect(line(spec({ files: ["", "notes.txt", "  "] }))).toBe("nano notes.txt");
  });
});

describe("lint", () => {
  it("NAN001 notes an empty buffer when no files are given", () => {
    const result = lint(spec({ files: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("NAN001");
    expect(result.diagnostics.find((d) => d.code === "NAN001")!.level).toBe("info");
    expect(result.hasErrors).toBe(false);
  });

  it("NAN002 notes multiple files open in separate buffers", () => {
    expect(lint(spec({ files: ["a.txt", "b.txt"] })).diagnostics.map((d) => d.code)).toContain("NAN002");
    expect(lint(spec({ files: ["a.txt"] })).diagnostics.map((d) => d.code)).not.toContain("NAN002");
  });

  it("a plain nano with a single file has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Edit a file' is a bare nano", () => {
    expect(line(getPreset("edit-a-file")!.apply(spec()))).toBe("nano notes.txt");
  });

  it("'With line numbers' is -l", () => {
    expect(line(getPreset("with-line-numbers")!.apply(spec()))).toBe("nano -l notes.txt");
  });

  it("'Safe edit with a backup' is -B", () => {
    expect(line(getPreset("safe-edit-with-backup")!.apply(spec()))).toBe("nano -B notes.txt");
  });

  it("'No wrapping (for code or tables)' is -w", () => {
    expect(line(getPreset("no-wrap-for-code")!.apply(spec()))).toBe("nano -w notes.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain edit", () => {
    expect(describeSpec(spec())).toBe("Open notes.txt in nano.");
  });

  it("describes an empty buffer", () => {
    expect(describeSpec(spec({ files: [] }))).toBe("Open an empty, unnamed buffer in nano.");
  });

  it("describes several flags together", () => {
    expect(describeSpec(spec({ flags: { lineNumbers: true, backup: true } }))).toBe(
      "Open notes.txt in nano, showing line numbers, backing up the original before saving.",
    );
  });
});
