import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type JoinSpec,
} from "@cmdgen/join";

const line = (spec: JoinSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<JoinSpec> = {}): JoinSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("join", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("join");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("join alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Join files by matching fields");
  });
  it("preset basic", () => {
    expect(line(getPreset("basic")!.apply(spec()))).toBe("join left.txt right.txt");
  });
  it("preset csv", () => {
    expect(line(getPreset("csv")!.apply(spec()))).toBe(
      "join -1 1 -2 1 -t , left.csv right.csv",
    );
  });
});
