import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ClearSpec } from "@cmdgen/clear";

const line = (spec: ClearSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<ClearSpec> = {}): ClearSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("binary per platform", () => {
  it("uses clear on Linux/macOS", () => {
    expect(line(spec())).toBe("clear");
    expect(line(spec({ platform: "mac" }))).toBe("clear");
  });

  it("uses cls on cmd.exe", () => {
    expect(line(spec({ platform: "windows-cmd" }))).toBe("cls");
  });

  it("uses Clear-Host on PowerShell", () => {
    expect(line(spec({ platform: "windows-powershell" }))).toBe("Clear-Host");
  });

  it("renders -x on POSIX only", () => {
    expect(line(spec({ flags: { keepScrollback: true } }))).toBe("clear -x");
    expect(line(spec({ platform: "windows-cmd", flags: { keepScrollback: true } }))).toBe("cls");
  });
});

describe("Cygwin/MSYS2/WSL route to the real clear binary, same as Linux/macOS", () => {
  it("uses clear, not cls or Clear-Host", () => {
    expect(line(spec({ platform: "windows-cygwin" }))).toBe("clear");
    expect(line(spec({ platform: "windows-msys" }))).toBe("clear");
    expect(line(spec({ platform: "windows-wsl" }))).toBe("clear");
  });

  it("renders -x identically to linux/mac", () => {
    expect(line(spec({ platform: "windows-cygwin", flags: { keepScrollback: true } }))).toBe("clear -x");
    expect(line(spec({ platform: "windows-msys", flags: { keepScrollback: true } }))).toBe("clear -x");
    expect(line(spec({ platform: "windows-wsl", flags: { keepScrollback: true } }))).toBe("clear -x");
  });

  it("'Clear but keep scrollback' preset applies", () => {
    expect(getPreset("clear-keep-scrollback")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(true);
    expect(getPreset("clear-keep-scrollback")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(true);
    expect(getPreset("clear-keep-scrollback")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(true);
    expect(line(getPreset("clear-keep-scrollback")!.apply(spec({ platform: "windows-cygwin" })))).toBe("clear -x");
    expect(line(getPreset("clear-keep-scrollback")!.apply(spec({ platform: "windows-msys" })))).toBe("clear -x");
    expect(line(getPreset("clear-keep-scrollback")!.apply(spec({ platform: "windows-wsl" })))).toBe("clear -x");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { keepScrollback: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Clear the screen'", () => {
    expect(line(getPreset("clear-screen")!.apply(spec()))).toBe("clear");
  });

  it("'Clear but keep scrollback' is POSIX only", () => {
    expect(line(getPreset("clear-keep-scrollback")!.apply(spec()))).toBe("clear -x");
    expect(getPreset("clear-keep-scrollback")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes a plain clear", () => {
    expect(describeSpec(spec())).toBe("Clear the terminal screen on Linux.");
  });

  it("describes -x", () => {
    expect(describeSpec(spec({ flags: { keepScrollback: true } }))).toBe(
      "Clear the terminal screen on Linux, keeping the scrollback buffer intact.",
    );
  });

  it("describes WSL", () => {
    expect(describeSpec(spec({ platform: "windows-wsl" }))).toBe("Clear the terminal screen on Windows (WSL).");
  });
});
