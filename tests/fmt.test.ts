import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FmtSpec,
} from "@cmdgen/fmt";

const line = (spec: FmtSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FmtSpec> = {}): FmtSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fmt", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("fmt");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("fmt alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Format text paragraphs");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("fmt notes.txt");
  });
  it("preset width", () => {
    expect(line(getPreset("width")!.apply(spec()))).toBe("fmt -w 80 notes.txt");
  });
});
