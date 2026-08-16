import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type UmaskSpec,
} from "@cmdgen/umask";

const line = (spec: UmaskSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<UmaskSpec> = {}): UmaskSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("umask", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("umask");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("umask alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Show or set default file creation permissions");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("umask");
  });
  it("preset symbolic", () => {
    expect(line(getPreset("symbolic")!.apply(spec()))).toBe("umask -S");
  });
  it("preset private", () => {
    expect(line(getPreset("private")!.apply(spec()))).toBe("umask 077");
  });
});
