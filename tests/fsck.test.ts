import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FsckSpec,
} from "@cmdgen/fsck";

const line = (spec: FsckSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FsckSpec> = {}): FsckSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fsck", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("fsck");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("fsck alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Check filesystems");
  });
  it("preset check", () => {
    expect(line(getPreset("check")!.apply(spec()))).toBe("fsck /dev/sda1");
  });
  it("preset dry", () => {
    expect(line(getPreset("dry")!.apply(spec()))).toBe("fsck -n /dev/sda1");
  });
});
