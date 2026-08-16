import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TrSpec,
} from "@cmdgen/tr";

const line = (spec: TrSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TrSpec> = {}): TrSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("tr", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("tr");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("tr alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain(
      "Translate, delete, or squeeze characters from standard input",
    );
  });
  it("preset upper", () => {
    expect(line(getPreset("upper")!.apply(spec()))).toBe("tr a-z A-Z");
  });
  it("preset delete", () => {
    expect(line(getPreset("delete")!.apply(spec()))).toBe("tr -d 0-9");
  });
});
