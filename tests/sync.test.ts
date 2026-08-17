import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SyncSpec,
} from "@cmdgen/sync";

const line = (spec: SyncSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SyncSpec> = {}): SyncSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("sync", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("sync");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("sync alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Flush filesystem buffers");
  });
  it("preset flush", () => {
    expect(line(getPreset("flush")!.apply(spec()))).toBe("sync");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("sync -d file.txt");
  });
});
