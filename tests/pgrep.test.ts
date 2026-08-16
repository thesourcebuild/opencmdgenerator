import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type PgrepSpec,
} from "@cmdgen/pgrep";

const line = (spec: PgrepSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<PgrepSpec> = {}): PgrepSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("pgrep", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("pgrep");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("pgrep alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Look up processes by name and attributes");
  });
  it("preset ssh", () => {
    expect(line(getPreset("ssh")!.apply(spec()))).toBe("pgrep ssh");
  });
  it("preset full", () => {
    expect(line(getPreset("full")!.apply(spec()))).toBe("pgrep -f 'python.*server'");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("pgrep -a nginx");
  });
});
