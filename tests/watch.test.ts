import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type WatchSpec,
} from "@cmdgen/watch";

const line = (spec: WatchSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<WatchSpec> = {}): WatchSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("watch", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("watch");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("watch alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Run commands repeatedly");
  });
  it("preset disk", () => {
    expect(line(getPreset("disk")!.apply(spec()))).toBe("watch -n 2 'df -h'");
  });
  it("preset processes", () => {
    expect(line(getPreset("processes")!.apply(spec()))).toBe("watch -d 'ps aux'");
  });
});
