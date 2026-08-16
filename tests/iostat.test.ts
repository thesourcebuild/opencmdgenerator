import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type IostatSpec,
} from "@cmdgen/iostat";

const line = (spec: IostatSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<IostatSpec> = {}): IostatSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("iostat", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("iostat");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("iostat alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display CPU and disk I/O statistics");
  });
  it("preset extended", () => {
    expect(line(getPreset("extended")!.apply(spec()))).toBe("iostat -x");
  });
  it("preset interval", () => {
    expect(line(getPreset("interval")!.apply(spec()))).toBe("iostat -x 1 5");
  });
});
