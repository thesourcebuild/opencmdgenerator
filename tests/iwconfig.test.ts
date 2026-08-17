import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type IwconfigSpec,
} from "@cmdgen/iwconfig";

const line = (spec: IwconfigSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<IwconfigSpec> = {}): IwconfigSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("iwconfig", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("iwconfig");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("iwconfig alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Configure wireless interfaces");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("iwconfig wlan0");
  });
  it("preset essid", () => {
    expect(line(getPreset("essid")!.apply(spec()))).toBe("iwconfig wlan0 essid MyWifi");
  });
});
