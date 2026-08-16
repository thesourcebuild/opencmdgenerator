import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type Bunzip2Spec,
} from "@cmdgen/bunzip2";

const line = (spec: Bunzip2Spec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<Bunzip2Spec> = {}): Bunzip2Spec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("bunzip2", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("bunzip2");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("bunzip2 alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Decompress bzip2 files");
  });
  it("preset decompress", () => {
    expect(line(getPreset("decompress")!.apply(spec()))).toBe("bunzip2 data.log.bz2");
  });
  it("preset keep", () => {
    expect(line(getPreset("keep")!.apply(spec()))).toBe("bunzip2 -k data.log.bz2");
  });
  it("preset stdout", () => {
    expect(line(getPreset("stdout")!.apply(spec()))).toBe("bunzip2 -c data.log.bz2");
  });
});
