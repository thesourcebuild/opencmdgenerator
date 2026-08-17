import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type UnxzSpec,
} from "@cmdgen/unxz";

const line = (spec: UnxzSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<UnxzSpec> = {}): UnxzSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("unxz", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("unxz");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("unxz alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Decompress xz files");
  });
  it("preset decompress", () => {
    expect(line(getPreset("decompress")!.apply(spec()))).toBe("unxz archive.tar.xz");
  });
  it("preset stdout", () => {
    expect(line(getPreset("stdout")!.apply(spec()))).toBe("unxz -c archive.tar.xz");
  });
});
