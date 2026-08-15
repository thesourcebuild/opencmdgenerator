import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CatSpec } from "@cmdgen/cat";

const line = (spec: CatSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<CatSpec> = {}): CatSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["notes.txt"],
  ...partial,
});

describe("POSIX (cat)", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("cat notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("cat a.txt b.txt");
  });

  it("renders -A implying -v -E -T", () => {
    expect(line(spec({ flags: { showAll: true } }))).toBe("cat -A notes.txt");
  });

  it("renders -n, -b, -s, -E, -T, -v", () => {
    expect(line(spec({ flags: { numberAll: true } }))).toBe("cat -n notes.txt");
    expect(line(spec({ flags: { numberNonblank: true } }))).toBe("cat -b notes.txt");
    expect(line(spec({ flags: { squeezeBlank: true } }))).toBe("cat -s notes.txt");
    expect(line(spec({ flags: { showEnds: true } }))).toBe("cat -E notes.txt");
    expect(line(spec({ flags: { showTabs: true } }))).toBe("cat -T notes.txt");
    expect(line(spec({ flags: { showNonprinting: true } }))).toBe("cat -v notes.txt");
  });
});

describe("lint", () => {
  it("CAT001 catches no files", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).toContain("CAT001");
  });

  it("CAT002 catches -n and -b together", () => {
    const s = spec({ flags: { numberAll: true, numberNonblank: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CAT002");
    const fix = result.diagnostics.find((d) => d.code === "CAT002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CAT002");
  });

  it("a plain cat has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Print a file' is a bare cat", () => {
    expect(line(getPreset("print-file")!.apply(spec()))).toBe("cat notes.txt");
  });

  it("'Number every line' is -n, POSIX only", () => {
    expect(line(getPreset("number-lines")!.apply(spec()))).toBe("cat -n notes.txt");
    expect(getPreset("number-lines")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });

  it("'Reveal invisible characters' is -A", () => {
    expect(line(getPreset("show-invisible-characters")!.apply(spec()))).toBe("cat -A notes.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain print", () => {
    expect(describeSpec(spec())).toBe("Print the contents of notes.txt on Linux.");
  });
});

describe("cmd.exe (type)", () => {
  const cmd = (partial: Partial<CatSpec> = {}): CatSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses type as the binary, with no flags at all", () => {
    expect(line(cmd())).toBe("type notes.txt");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ flags: { showAll: true } }))).toBe("type notes.txt");
  });

  it("converts forward slashes to backslashes — cmd.exe's type misreads embedded \"/\" as a switch attempt", () => {
    expect(line(cmd({ files: ["sub/notes.txt"] }))).toBe("type sub\\notes.txt");
  });
});

describe("cygwin/msys/wsl (cat) — same real binary and flags as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<CatSpec> = {}): CatSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<CatSpec> = {}): CatSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<CatSpec> = {}): CatSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses cat (not type or Get-Content) as the binary", () => {
    expect(line(cygwin())).toBe("cat notes.txt");
    expect(line(msys())).toBe("cat notes.txt");
    expect(line(wsl())).toBe("cat notes.txt");
  });

  it("lists multiple files space-separated, not comma-joined like PowerShell", () => {
    expect(line(cygwin({ files: ["a.txt", "b.txt"] }))).toBe("cat a.txt b.txt");
    expect(line(msys({ files: ["a.txt", "b.txt"] }))).toBe("cat a.txt b.txt");
    expect(line(wsl({ files: ["a.txt", "b.txt"] }))).toBe("cat a.txt b.txt");
  });

  it("renders -n and -A identically to linux/mac", () => {
    expect(line(cygwin({ flags: { numberAll: true } }))).toBe("cat -n notes.txt");
    expect(line(msys({ flags: { showAll: true } }))).toBe("cat -A notes.txt");
    expect(line(wsl({ flags: { showAll: true } }))).toBe("cat -A notes.txt");
  });

  it("a relative forward-slash path is left as-is — nothing to rewrite without a drive letter", () => {
    expect(line(cygwin({ files: ["sub/notes.txt"] }))).toBe("cat sub/notes.txt");
    expect(line(msys({ files: ["sub/notes.txt"] }))).toBe("cat sub/notes.txt");
    expect(line(wsl({ files: ["sub/notes.txt"] }))).toBe("cat sub/notes.txt");
  });

  it("converts a Windows-style absolute path to the dialect's own bash spelling", () => {
    expect(line(cygwin({ files: ["C:\\Users\\me\\notes.txt"] }))).toBe("cat /cygdrive/c/Users/me/notes.txt");
    expect(line(msys({ files: ["C:\\Users\\me\\notes.txt"] }))).toBe("cat /c/Users/me/notes.txt");
    expect(line(wsl({ files: ["C:\\Users\\me\\notes.txt"] }))).toBe("cat /mnt/c/Users/me/notes.txt");
  });

  it("'Number every line' and 'Reveal invisible characters' now apply — they're POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("number-lines")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("show-invisible-characters")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("show-invisible-characters")!.isApplicable?.(wsl())).toBe(true);
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin())).toBe("Print the contents of notes.txt on Windows (Cygwin).");
    expect(describeSpec(msys())).toBe("Print the contents of notes.txt on Windows (MSYS2).");
    expect(describeSpec(wsl())).toBe("Print the contents of notes.txt on Windows (WSL).");
  });
});

describe("PowerShell (Get-Content)", () => {
  const ps = (partial: Partial<CatSpec> = {}): CatSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Get-Content -Path", () => {
    expect(line(ps())).toBe("Get-Content -Path notes.txt");
  });

  it("comma-joins multiple files", () => {
    expect(line(ps({ files: ["a.txt", "b.txt"] }))).toBe("Get-Content -Path a.txt, b.txt");
  });

  it("renders -Raw at the end", () => {
    expect(line(ps({ flags: { rawPs: true } }))).toBe("Get-Content -Path notes.txt -Raw");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(ps({ flags: { showAll: true } }))).toBe("Get-Content -Path notes.txt");
  });
});
