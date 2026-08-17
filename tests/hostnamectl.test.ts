import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type HostnamectlSpec,
} from "@cmdgen/hostnamectl";

const line = (spec: HostnamectlSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<HostnamectlSpec> = {}): HostnamectlSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("hostnamectl", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("hostnamectl");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("hostnamectl alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage system hostname");
  });
  it("preset status", () => {
    expect(line(getPreset("status")!.apply(spec()))).toBe("hostnamectl status");
  });
  it("preset set", () => {
    expect(line(getPreset("set")!.apply(spec()))).toBe("hostnamectl set-hostname server01");
  });
});
