import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ExportSpec } from "@cmdgen/export";

const line = (spec: ExportSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<ExportSpec> = {}): ExportSpec => ({
  ...createSpec({ id: "test-spec" }),
  varName: "API_URL",
  value: "https://api.example.com",
  ...partial,
});

describe("POSIX (export)", () => {
  it("sets NAME=VALUE as one attached token, unquoted when safe", () => {
    expect(line(spec())).toBe("export API_URL=https://api.example.com");
  });

  it("quotes only the value half when it needs quoting", () => {
    expect(line(spec({ varName: "FOO", value: "my value" }))).toBe("export FOO='my value'");
  });

  it("marks an already-set variable with no value", () => {
    expect(line(spec({ value: "" }))).toBe("export API_URL");
  });

  it("renders -p, ignoring name/value entirely", () => {
    expect(line(spec({ flags: { printAll: true } }))).toBe("export -p");
  });

  it("renders -n NAME, not attached", () => {
    expect(line(spec({ flags: { removeExport: true } }))).toBe("export -n API_URL");
  });
});

describe("lint", () => {
  it("EXPORT001 catches no name (unless -p)", () => {
    expect(lint(spec({ varName: "" })).diagnostics.map((d) => d.code)).toContain("EXPORT001");
    expect(lint(spec({ varName: "", flags: { printAll: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "EXPORT001",
    );
  });

  it("EXPORT002 catches -p and -n together", () => {
    const s = spec({ flags: { printAll: true, removeExport: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("EXPORT002");
    const fix = result.diagnostics.find((d) => d.code === "EXPORT002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("EXPORT002");
  });

  it("a plain export has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Set a variable'", () => {
    expect(line(getPreset("set-a-variable")!.apply(spec()))).toBe("export API_URL=https://api.example.com");
  });

  it("'Mark an existing variable for export' is POSIX only", () => {
    expect(line(getPreset("mark-for-export")!.apply(spec()))).toBe("export API_URL");
    expect(getPreset("mark-for-export")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });

  it("'List all exported variables' is -p, POSIX only", () => {
    expect(line(getPreset("list-all-exported")!.apply(spec()))).toBe("export -p");
    expect(getPreset("list-all-exported")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes setting a value", () => {
    expect(describeSpec(spec())).toBe('Set API_URL to "https://api.example.com" on Linux.');
  });

  it("describes marking for export", () => {
    expect(describeSpec(spec({ value: "" }))).toBe(
      "Mark the already-set variable API_URL for export to child processes on Linux.",
    );
  });
});

describe("cmd.exe (set)", () => {
  const cmd = (partial: Partial<ExportSpec> = {}): ExportSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses set with an attached NAME=VALUE", () => {
    expect(line(cmd())).toBe("set API_URL=https://api.example.com");
  });

  it("quotes the value half when needed", () => {
    expect(line(cmd({ varName: "FOO", value: "my value" }))).toBe('set FOO="my value"');
  });
});

describe("cygwin/msys/wsl (export) — same real export builtin and syntax as linux/mac", () => {
  const cygwin = (partial: Partial<ExportSpec> = {}): ExportSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<ExportSpec> = {}): ExportSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<ExportSpec> = {}): ExportSpec => spec({ platform: "windows-wsl", ...partial });

  it("sets NAME=VALUE as one attached token, unquoted when safe, identically to linux/mac", () => {
    expect(line(cygwin())).toBe("export API_URL=https://api.example.com");
    expect(line(msys())).toBe("export API_URL=https://api.example.com");
    expect(line(wsl())).toBe("export API_URL=https://api.example.com");
  });

  it("quotes only the value half when it needs quoting", () => {
    expect(line(cygwin({ varName: "FOO", value: "my value" }))).toBe("export FOO='my value'");
    expect(line(msys({ varName: "FOO", value: "my value" }))).toBe("export FOO='my value'");
    expect(line(wsl({ varName: "FOO", value: "my value" }))).toBe("export FOO='my value'");
  });

  it("marks an already-set variable with no value", () => {
    expect(line(cygwin({ value: "" }))).toBe("export API_URL");
    expect(line(msys({ value: "" }))).toBe("export API_URL");
    expect(line(wsl({ value: "" }))).toBe("export API_URL");
  });

  it("renders -p, ignoring name/value entirely, identically to linux/mac", () => {
    expect(line(cygwin({ flags: { printAll: true } }))).toBe("export -p");
    expect(line(msys({ flags: { printAll: true } }))).toBe("export -p");
    expect(line(wsl({ flags: { printAll: true } }))).toBe("export -p");
  });

  it("renders -n NAME, not attached, identically to linux/mac", () => {
    expect(line(cygwin({ flags: { removeExport: true } }))).toBe("export -n API_URL");
    expect(line(msys({ flags: { removeExport: true } }))).toBe("export -n API_URL");
    expect(line(wsl({ flags: { removeExport: true } }))).toBe("export -n API_URL");
  });

  it("'Mark an existing variable for export' and 'List all exported variables' now apply — POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("mark-for-export")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("mark-for-export")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("mark-for-export")!.isApplicable?.(wsl())).toBe(true);
    expect(getPreset("list-all-exported")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("list-all-exported")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("list-all-exported")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("list-all-exported")!.apply(cygwin()))).toBe("export -p");
    expect(line(getPreset("list-all-exported")!.apply(wsl()))).toBe("export -p");
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin())).toBe('Set API_URL to "https://api.example.com" on Windows (Cygwin).');
    expect(describeSpec(msys())).toBe('Set API_URL to "https://api.example.com" on Windows (MSYS2).');
    expect(describeSpec(wsl())).toBe('Set API_URL to "https://api.example.com" on Windows (WSL).');
  });
});

describe("PowerShell ($env:)", () => {
  const ps = (partial: Partial<ExportSpec> = {}): ExportSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses $env:NAME = VALUE with spaces around =", () => {
    expect(line(ps())).toBe("$env:API_URL = https://api.example.com");
  });

  it("quotes the value when needed", () => {
    expect(line(ps({ varName: "FOO", value: "my value" }))).toBe("$env:FOO = 'my value'");
  });
});
