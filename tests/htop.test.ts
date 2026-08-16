import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type HtopSpec,
} from "@cmdgen/htop";

const line = (spec: HtopSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<HtopSpec> = {}): HtopSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("htop", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("htop");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("htop alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Interactive process viewer");
  });
  it("preset monitor", () => {
    expect(line(getPreset("monitor")!.apply(spec()))).toBe("htop");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("htop -u alice");
  });
  it("preset tree", () => {
    expect(line(getPreset("tree")!.apply(spec()))).toBe("htop -t");
  });
});
