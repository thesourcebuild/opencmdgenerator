import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FlatpakSpec,
} from "@cmdgen/flatpak";

const line = (spec: FlatpakSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FlatpakSpec> = {}): FlatpakSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flatpak", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("flatpak");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("flatpak alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage Flatpak apps");
  });
  it("preset install", () => {
    expect(line(getPreset("install")!.apply(spec()))).toBe(
      "flatpak install flathub org.gimp.GIMP",
    );
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe(
      "flatpak --user install flathub org.gimp.GIMP",
    );
  });
});
