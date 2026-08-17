import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type E2fsckSpec,
} from "@cmdgen/e2fsck";

const line = (spec: E2fsckSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<E2fsckSpec> = {}): E2fsckSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("e2fsck", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("e2fsck");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("e2fsck alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Check ext filesystems");
  });
  it("preset check", () => {
    expect(line(getPreset("check")!.apply(spec()))).toBe("e2fsck /dev/sda1");
  });
  it("preset force", () => {
    expect(line(getPreset("force")!.apply(spec()))).toBe("e2fsck -f /dev/sda1");
  });
});
