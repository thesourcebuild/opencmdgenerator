import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type AptCacheSpec,
} from "@cmdgen/apt-cache";

const line = (spec: AptCacheSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<AptCacheSpec> = {}): AptCacheSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("apt-cache", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("apt-cache");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("apt-cache alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Query APT package cache");
  });
  it("preset search", () => {
    expect(line(getPreset("search")!.apply(spec()))).toBe("apt-cache search nginx");
  });
  it("preset policy", () => {
    expect(line(getPreset("policy")!.apply(spec()))).toBe("apt-cache policy nginx");
  });
});
