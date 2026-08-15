import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SetenforceSpec } from "@cmdgen/setenforce";

const line = (spec: SetenforceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SetenforceSpec> = {}): SetenforceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("mode", () => {
  it("renders the word form for Enforcing", () => {
    expect(line(spec())).toBe("setenforce Enforcing");
  });

  it("renders the word form for Permissive", () => {
    expect(line(spec({ mode: "Permissive" }))).toBe("setenforce Permissive");
  });
});

describe("lint", () => {
  it("SEF001 warns on Permissive mode", () => {
    const diagnostics = lint(spec({ mode: "Permissive" })).diagnostics;
    expect(diagnostics.map((d) => d.code)).toContain("SEF001");
    expect(diagnostics.find((d) => d.code === "SEF001")!.level).toBe("warning");
  });

  it("SEF001 does not fire for Enforcing", () => {
    expect(lint(spec({ mode: "Enforcing" })).diagnostics).toEqual([]);
  });

  it("SEF001's fix sets mode back to Enforcing", () => {
    const permissive = spec({ mode: "Permissive" });
    const diagnostic = lint(permissive).diagnostics.find((d) => d.code === "SEF001");
    expect(diagnostic?.fix).toBeDefined();
    const fixed = diagnostic!.fix!.apply(permissive);
    expect(fixed.mode).toBe("Enforcing");
  });
});

describe("presets", () => {
  it("'Enable enforcing'", () => {
    expect(line(getPreset("enable-enforcing")!.apply(spec()))).toBe("setenforce Enforcing");
  });

  it("'Set permissive (troubleshooting)'", () => {
    expect(line(getPreset("set-permissive")!.apply(spec()))).toBe("setenforce Permissive");
  });
});

describe("describeSpec", () => {
  it("describes Enforcing", () => {
    expect(describeSpec(spec())).toBe("Set SELinux to Enforcing mode — policy violations are blocked and logged.");
  });

  it("describes Permissive", () => {
    expect(describeSpec(spec({ mode: "Permissive" }))).toBe(
      "Set SELinux to Permissive mode — policy violations are logged but nothing is actually blocked.",
    );
  });
});
