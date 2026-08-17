import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DisownSpec,
} from "@cmdgen/disown";

const line = (spec: DisownSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DisownSpec> = {}): DisownSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("disown", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("disown");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("disown alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Disown shell jobs");
  });
  it("preset job", () => {
    expect(line(getPreset("job")!.apply(spec()))).toBe("disown %1");
  });
  it("preset all", () => {
    expect(line(getPreset("all")!.apply(spec()))).toBe("disown -a");
  });
});
