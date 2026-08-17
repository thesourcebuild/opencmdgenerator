import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ChshSpec,
} from "@cmdgen/chsh";

const line = (spec: ChshSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ChshSpec> = {}): ChshSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("chsh", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("chsh");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("chsh alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Change login shells");
  });
  it("preset set", () => {
    expect(line(getPreset("set")!.apply(spec()))).toBe("chsh -s /bin/zsh alice");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("chsh -l");
  });
});
