import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type GroupsSpec,
} from "@cmdgen/groups";

const line = (spec: GroupsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<GroupsSpec> = {}): GroupsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("groups", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("groups");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("groups alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print group memberships");
  });
  it("preset current", () => {
    expect(line(getPreset("current")!.apply(spec()))).toBe("groups");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("groups alice");
  });
});
