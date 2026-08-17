import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DmidecodeSpec,
} from "@cmdgen/dmidecode";

const line = (spec: DmidecodeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DmidecodeSpec> = {}): DmidecodeSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("dmidecode", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("dmidecode");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("dmidecode alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Decode hardware DMI tables");
  });
  it("preset system", () => {
    expect(line(getPreset("system")!.apply(spec()))).toBe("dmidecode -t system");
  });
  it("preset serial", () => {
    expect(line(getPreset("serial")!.apply(spec()))).toBe("dmidecode -s system-serial-number");
  });
});
