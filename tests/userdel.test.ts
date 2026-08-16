import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type UserdelSpec,
} from "@cmdgen/userdel";

const line = (spec: UserdelSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<UserdelSpec> = {}): UserdelSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("userdel", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("userdel");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("userdel alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Delete a user account");
  });
  it("preset delete", () => {
    expect(line(getPreset("delete")!.apply(spec()))).toBe("userdel alice");
  });
  it("preset home", () => {
    expect(line(getPreset("home")!.apply(spec()))).toBe("userdel -r alice");
  });
});
