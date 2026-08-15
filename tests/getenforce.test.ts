import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type GetenforceSpec } from "@cmdgen/getenforce";

const line = (spec: GetenforceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<GetenforceSpec> = {}): GetenforceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("argv", () => {
  it("is a bare command with no arguments at all", () => {
    expect(line(spec())).toBe("getenforce");
  });
});

describe("lint", () => {
  it("never has any diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Check SELinux mode' is a bare getenforce", () => {
    expect(line(getPreset("check-status")!.apply(spec()))).toBe("getenforce");
  });
});

describe("describeSpec", () => {
  it("describes the command", () => {
    expect(describeSpec(spec())).toBe("Print whether SELinux is currently Enforcing, Permissive, or Disabled.");
  });
});
