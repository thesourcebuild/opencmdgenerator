import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ExitSpec,
} from "@cmdgen/exit";

const line = (spec: ExitSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ExitSpec> = {}): ExitSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("exit", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("exit");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("exit alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain(
      "Exit the current shell with an optional status code",
    );
  });
  it("preset current", () => {
    expect(line(getPreset("current")!.apply(spec()))).toBe("exit");
  });
  it("preset success", () => {
    expect(line(getPreset("success")!.apply(spec()))).toBe("exit 0");
  });
  it("preset failure", () => {
    expect(line(getPreset("failure")!.apply(spec()))).toBe("exit 1");
  });
});
