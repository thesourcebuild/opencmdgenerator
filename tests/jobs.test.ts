import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type JobsSpec,
} from "@cmdgen/jobs";

const line = (spec: JobsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<JobsSpec> = {}): JobsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("jobs", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("jobs");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("jobs alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("List active shell jobs");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("jobs");
  });
  it("preset long", () => {
    expect(line(getPreset("long")!.apply(spec()))).toBe("jobs -l");
  });
  it("preset pids", () => {
    expect(line(getPreset("pids")!.apply(spec()))).toBe("jobs -p");
  });
});
