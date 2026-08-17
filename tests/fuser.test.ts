import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FuserSpec,
} from "@cmdgen/fuser";

const line = (spec: FuserSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FuserSpec> = {}): FuserSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fuser", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("fuser");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("fuser alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Find users of files or sockets");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("fuser /var/log/syslog");
  });
  it("preset tcp", () => {
    expect(line(getPreset("tcp")!.apply(spec()))).toBe("fuser -n tcp 80");
  });
});
