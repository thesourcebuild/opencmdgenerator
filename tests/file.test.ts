import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FileSpec,
} from "@cmdgen/file";

const line = (spec: FileSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FileSpec> = {}): FileSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("file", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("file");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("file alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Determine file types");
  });
  it("preset inspect", () => {
    expect(line(getPreset("inspect")!.apply(spec()))).toBe("file archive.tar.gz");
  });
  it("preset mime", () => {
    expect(line(getPreset("mime")!.apply(spec()))).toBe("file -i index.html");
  });
});
