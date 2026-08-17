import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DnfSpec,
} from "@cmdgen/dnf";

const line = (spec: DnfSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DnfSpec> = {}): DnfSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("dnf", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("dnf");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("dnf alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage DNF packages");
  });
  it("preset install", () => {
    expect(line(getPreset("install")!.apply(spec()))).toBe("dnf install nginx");
  });
  it("preset yes", () => {
    expect(line(getPreset("yes")!.apply(spec()))).toBe("dnf -y install nginx");
  });
});
