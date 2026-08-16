import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type Bzip2Spec,
} from "@cmdgen/bzip2";

const line = (spec: Bzip2Spec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<Bzip2Spec> = {}): Bzip2Spec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("bzip2", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("bzip2");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("bzip2 alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Compress files using bzip2");
  });
  it("preset compress", () => {
    expect(line(getPreset("compress")!.apply(spec()))).toBe("bzip2 data.log");
  });
  it("preset keep", () => {
    expect(line(getPreset("keep")!.apply(spec()))).toBe("bzip2 -k data.log");
  });
  it("preset test", () => {
    expect(line(getPreset("test")!.apply(spec()))).toBe("bzip2 -t data.log.bz2");
  });
});
