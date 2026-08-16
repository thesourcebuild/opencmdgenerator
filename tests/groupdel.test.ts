import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type GroupdelSpec,
} from "@cmdgen/groupdel";

const line = (spec: GroupdelSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<GroupdelSpec> = {}): GroupdelSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("groupdel", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("groupdel");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("groupdel alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Delete group accounts");
  });
  it("preset delete", () => {
    expect(line(getPreset("delete")!.apply(spec()))).toBe("groupdel developers");
  });
  it("preset force", () => {
    expect(line(getPreset("force")!.apply(spec()))).toBe("groupdel -f developers");
  });
});
