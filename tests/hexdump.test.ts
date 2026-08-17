import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type HexdumpSpec,
} from "@cmdgen/hexdump";

const line = (spec: HexdumpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<HexdumpSpec> = {}): HexdumpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("hexdump", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("hexdump");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("hexdump alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display hexadecimal file contents");
  });
  it("preset canonical", () => {
    expect(line(getPreset("canonical")!.apply(spec()))).toBe("hexdump -C file.bin");
  });
  it("preset length", () => {
    expect(line(getPreset("length")!.apply(spec()))).toBe("hexdump -C -n 64 file.bin");
  });
});
