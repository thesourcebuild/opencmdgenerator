import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type IdSpec,
} from "@cmdgen/id";

const line = (spec: IdSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<IdSpec> = {}): IdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("id", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("id");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("id alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print user and group identity information");
  });
  it("preset current", () => {
    expect(line(getPreset("current")!.apply(spec()))).toBe("id");
  });
  it("preset uid", () => {
    expect(line(getPreset("uid")!.apply(spec()))).toBe("id -u");
  });
  it("preset groups", () => {
    expect(line(getPreset("groups")!.apply(spec()))).toBe("id -G -n alice");
  });
});
