import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type TeeSpec } from "@cmdgen/tee";

const line = (spec: TeeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<TeeSpec> = {}): TeeSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["output.log"],
  ...partial,
});

describe("argv/render", () => {
  it("a bare output file", () => {
    expect(line(spec())).toBe("tee output.log");
  });

  it("lists multiple output files in order", () => {
    expect(line(spec({ files: ["a.log", "b.log"] }))).toBe("tee a.log b.log");
  });

  it("renders -a and -i", () => {
    expect(line(spec({ flags: { append: true } }))).toBe("tee -a output.log");
    expect(line(spec({ flags: { ignoreInterrupts: true } }))).toBe("tee -i output.log");
  });

  it("renders no target files as a bare tee", () => {
    expect(line(spec({ files: [] }))).toBe("tee");
  });
});

describe("lint", () => {
  it("TEE001 catches a non-empty file list with no -a, at destructive level, and the fix silences it", () => {
    const s = spec();
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("TEE001");
    const diag = result.diagnostics.find((d) => d.code === "TEE001")!;
    expect(diag.level).toBe("destructive");
    const fixed = diag.fix!.apply(s);
    expect(fixed.flags.append).toBe(true);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("TEE001");
  });

  it("TEE001 does not fire once -a is set", () => {
    expect(lint(spec({ flags: { append: true } })).diagnostics.map((d) => d.code)).not.toContain("TEE001");
  });

  it("TEE001 does not fire with no files at all", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).not.toContain("TEE001");
  });
});

describe("presets", () => {
  it("'Split output to a file' is a bare tee", () => {
    expect(line(getPreset("split-to-a-file")!.apply(spec()))).toBe("tee output.log");
  });

  it("'Append to a log' is -a", () => {
    expect(line(getPreset("append-to-a-log")!.apply(spec()))).toBe("tee -a app.log");
  });

  it("'Write to multiple files' lists both targets", () => {
    expect(line(getPreset("write-to-multiple-files")!.apply(spec()))).toBe("tee a.log b.log");
  });

  it("'Keep writing through interrupts' is -i", () => {
    expect(line(getPreset("survive-interrupts")!.apply(spec()))).toBe("tee -i output.log");
  });
});

describe("describeSpec", () => {
  it("describes overwriting the target by default", () => {
    expect(describeSpec(spec())).toBe(
      "Copy standard input to standard output, overwriting output.log.",
    );
  });

  it("describes appending when -a is set", () => {
    expect(describeSpec(spec({ flags: { append: true } }))).toBe(
      "Copy standard input to standard output, appending to output.log.",
    );
  });

  it("mentions ignoring interrupts", () => {
    expect(describeSpec(spec({ flags: { ignoreInterrupts: true } }))).toContain("ignoring interrupt signals");
  });

  it("describes no target files distinctly", () => {
    expect(describeSpec(spec({ files: [] }))).toBe(
      "Copy standard input to standard output, overwriting no files (only standard output).",
    );
  });
});
