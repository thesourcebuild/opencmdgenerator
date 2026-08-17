import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TcpdumpSpec,
} from "@cmdgen/tcpdump";

const line = (spec: TcpdumpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TcpdumpSpec> = {}): TcpdumpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("tcpdump", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("tcpdump");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("tcpdump alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Capture network packets");
  });
  it("preset dns", () => {
    expect(line(getPreset("dns")!.apply(spec()))).toBe("tcpdump -n port 53");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("tcpdump -i eth0 -w capture.pcap");
  });
});
