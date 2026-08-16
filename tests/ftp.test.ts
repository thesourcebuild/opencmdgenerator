import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FtpSpec,
} from "@cmdgen/ftp";

const line = (spec: FtpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FtpSpec> = {}): FtpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("ftp", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("ftp");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("ftp alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Interactive File Transfer Protocol client");
  });
  it("preset connect", () => {
    expect(line(getPreset("connect")!.apply(spec()))).toBe("ftp ftp.example.com");
  });
  it("preset passive", () => {
    expect(line(getPreset("passive")!.apply(spec()))).toBe("ftp -p ftp.example.com");
  });
});
