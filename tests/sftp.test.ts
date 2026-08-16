import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SftpSpec,
} from "@cmdgen/sftp";

const line = (spec: SftpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SftpSpec> = {}): SftpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("sftp", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("sftp");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("sftp alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Open secure file transfer sessions");
  });
  it("preset connect", () => {
    expect(line(getPreset("connect")!.apply(spec()))).toBe("sftp user@example.com");
  });
  it("preset custom-port", () => {
    expect(line(getPreset("custom-port")!.apply(spec()))).toBe("sftp -P 2222 user@example.com");
  });
});
