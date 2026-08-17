import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ChkconfigSpec,
} from "@cmdgen/chkconfig";

const line = (spec: ChkconfigSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ChkconfigSpec> = {}): ChkconfigSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("chkconfig", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("chkconfig");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("chkconfig alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage service runlevels");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("chkconfig --list");
  });
  it("preset enable", () => {
    expect(line(getPreset("enable")!.apply(spec()))).toBe("chkconfig --level 35 httpd on");
  });
});
