import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ChattrSpec,
} from "@cmdgen/chattr";

const line = (spec: ChattrSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ChattrSpec> = {}): ChattrSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("chattr", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("chattr");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("chattr alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Change file attributes");
  });
  it("preset immutable", () => {
    expect(line(getPreset("immutable")!.apply(spec()))).toBe("chattr +i file.txt");
  });
  it("preset recursive", () => {
    expect(line(getPreset("recursive")!.apply(spec()))).toBe("chattr -R +a logs");
  });
});
