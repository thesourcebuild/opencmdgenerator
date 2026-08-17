import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type NlSpec,
} from "@cmdgen/nl";

const line = (spec: NlSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<NlSpec> = {}): NlSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("nl", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("nl");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("nl alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Number file lines");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("nl file.txt");
  });
  it("preset all", () => {
    expect(line(getPreset("all")!.apply(spec()))).toBe("nl -b a file.txt");
  });
});
