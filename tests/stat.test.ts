import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type StatSpec,
} from "@cmdgen/stat";

const line = (spec: StatSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<StatSpec> = {}): StatSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("stat", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("stat");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("stat alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display detailed file or file system status");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("stat notes.txt");
  });
  it("preset filesystem", () => {
    expect(line(getPreset("filesystem")!.apply(spec()))).toBe("stat -f /");
  });
  it("preset format", () => {
    expect(line(getPreset("format")!.apply(spec()))).toBe("stat -c '%n %s' notes.txt");
  });
});
