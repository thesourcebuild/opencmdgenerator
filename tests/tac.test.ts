import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TacSpec,
} from "@cmdgen/tac";

const line = (spec: TacSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TacSpec> = {}): TacSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("tac", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("tac");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("tac alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Concatenate and print files in reverse line order");
  });
  it("preset reverse", () => {
    expect(line(getPreset("reverse")!.apply(spec()))).toBe("tac log.txt");
  });
  it("preset separator", () => {
    expect(line(getPreset("separator")!.apply(spec()))).toBe("tac -s --- entries.txt");
  });
});
