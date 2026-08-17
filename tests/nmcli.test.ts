import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type NmcliSpec,
} from "@cmdgen/nmcli";

const line = (spec: NmcliSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<NmcliSpec> = {}): NmcliSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("nmcli", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("nmcli");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("nmcli alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Control NetworkManager");
  });
  it("preset devices", () => {
    expect(line(getPreset("devices")!.apply(spec()))).toBe("nmcli device status");
  });
  it("preset connections", () => {
    expect(line(getPreset("connections")!.apply(spec()))).toBe(
      "nmcli -t -f NAME connection show",
    );
  });
});
