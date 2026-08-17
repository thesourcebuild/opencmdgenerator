import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type NmapSpec,
} from "@cmdgen/nmap";

const line = (spec: NmapSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<NmapSpec> = {}): NmapSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("nmap", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("nmap");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("nmap alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Scan network hosts");
  });
  it("preset host", () => {
    expect(line(getPreset("host")!.apply(spec()))).toBe("nmap example.com");
  });
  it("preset ports", () => {
    expect(line(getPreset("ports")!.apply(spec()))).toBe("nmap -p 22,80,443 example.com");
  });
});
