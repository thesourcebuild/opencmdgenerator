import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type NohupSpec,
} from "@cmdgen/nohup";

const line = (spec: NohupSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<NohupSpec> = {}): NohupSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("nohup", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("nohup");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("nohup alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Run a command immune to hangups");
  });
  it("preset task", () => {
    expect(line(getPreset("task")!.apply(spec()))).toBe("nohup long-task --all");
  });
  it("preset server", () => {
    expect(line(getPreset("server")!.apply(spec()))).toBe("nohup python -m http.server 8000");
  });
});
