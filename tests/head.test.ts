import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type HeadSpec } from "@cmdgen/head";

const line = (spec: HeadSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<HeadSpec> = {}): HeadSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["log.txt"],
  ...partial,
});

describe("POSIX (head)", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("head log.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("head a.txt b.txt");
  });

  it("renders -n and -c", () => {
    expect(line(spec({ flags: { linesCount: 20 } }))).toBe("head -n 20 log.txt");
    expect(line(spec({ flags: { bytesCount: 512 } }))).toBe("head -c 512 log.txt");
  });

  it("renders -q and -v", () => {
    expect(line(spec({ flags: { quiet: true } }))).toBe("head -q log.txt");
    expect(line(spec({ flags: { verbose: true } }))).toBe("head -v log.txt");
  });

  it("renders identically on mac as on linux", () => {
    expect(line(spec({ platform: "mac", flags: { linesCount: 20 } }))).toBe("head -n 20 log.txt");
  });
});

describe("lint", () => {
  it("HEAD001 catches no files", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).toContain("HEAD001");
  });

  it("HEAD002 catches -n and -c together, and -q and -v together", () => {
    expect(lint(spec({ flags: { linesCount: 5, bytesCount: 5 } })).diagnostics.map((d) => d.code)).toContain("HEAD002");
    expect(lint(spec({ flags: { quiet: true, verbose: true } })).diagnostics.map((d) => d.code)).toContain("HEAD002");
  });

  it("a plain head has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'First 10 lines' is a bare head", () => {
    expect(line(getPreset("first-10-lines")!.apply(spec()))).toBe("head log.txt");
  });

  it("'First 20 lines' is -n 20 on POSIX, -TotalCount 20 on PowerShell", () => {
    expect(line(getPreset("first-n-lines")!.apply(spec()))).toBe("head -n 20 log.txt");
    expect(line(getPreset("first-n-lines")!.apply(spec({ platform: "windows-powershell" })))).toBe(
      "Get-Content -Path log.txt -TotalCount 20",
    );
  });

  it("'First 512 bytes' is POSIX only", () => {
    expect(line(getPreset("first-bytes")!.apply(spec()))).toBe("head -c 512 log.txt");
    expect(getPreset("first-bytes")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes the default 10-line case", () => {
    expect(describeSpec(spec())).toBe("Print the first 10 lines of log.txt.");
  });

  it("describes a byte count", () => {
    expect(describeSpec(spec({ flags: { bytesCount: 512 } }))).toBe("Print the first 512 bytes of log.txt.");
  });
});

describe("cygwin/msys/wsl — same binary and flags as posix, only path spelling differs", () => {
  it("a bare file with no flags renders identically to posix", () => {
    expect(line(spec({ platform: "windows-cygwin" }))).toBe("head log.txt");
    expect(line(spec({ platform: "windows-msys" }))).toBe("head log.txt");
    expect(line(spec({ platform: "windows-wsl" }))).toBe("head log.txt");
  });

  it("renders -n and -c same as posix", () => {
    expect(line(spec({ platform: "windows-cygwin", flags: { linesCount: 20 } }))).toBe("head -n 20 log.txt");
    expect(line(spec({ platform: "windows-msys", flags: { linesCount: 20 } }))).toBe("head -n 20 log.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { linesCount: 20 } }))).toBe("head -n 20 log.txt");
    expect(line(spec({ platform: "windows-cygwin", flags: { bytesCount: 512 } }))).toBe("head -c 512 log.txt");
    expect(line(spec({ platform: "windows-msys", flags: { bytesCount: 512 } }))).toBe("head -c 512 log.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { bytesCount: 512 } }))).toBe("head -c 512 log.txt");
  });

  it("renders -q and -v same as posix", () => {
    expect(line(spec({ platform: "windows-cygwin", flags: { quiet: true } }))).toBe("head -q log.txt");
    expect(line(spec({ platform: "windows-msys", flags: { verbose: true } }))).toBe("head -v log.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { quiet: true } }))).toBe("head -q log.txt");
  });

  it("converts a Windows-style path to the shell's own spelling", () => {
    expect(line(spec({ platform: "windows-cygwin", files: ["C:\\Users\\me\\log.txt"] }))).toBe(
      "head /cygdrive/c/Users/me/log.txt",
    );
    expect(line(spec({ platform: "windows-msys", files: ["C:\\Users\\me\\log.txt"] }))).toBe("head /c/Users/me/log.txt");
    expect(line(spec({ platform: "windows-wsl", files: ["C:\\Users\\me\\log.txt"] }))).toBe(
      "head /mnt/c/Users/me/log.txt",
    );
  });

  it("'First 20 lines' preset renders the same POSIX-side output as under posix", () => {
    expect(line(getPreset("first-n-lines")!.apply(spec({ platform: "windows-cygwin" })))).toBe("head -n 20 log.txt");
    expect(line(getPreset("first-n-lines")!.apply(spec({ platform: "windows-msys" })))).toBe("head -n 20 log.txt");
    expect(line(getPreset("first-n-lines")!.apply(spec({ platform: "windows-wsl" })))).toBe("head -n 20 log.txt");
  });

  it("'First 512 bytes' preset is applicable and renders the same as under posix", () => {
    expect(getPreset("first-bytes")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(true);
    expect(getPreset("first-bytes")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(true);
    expect(getPreset("first-bytes")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(true);
    expect(line(getPreset("first-bytes")!.apply(spec({ platform: "windows-cygwin" })))).toBe("head -c 512 log.txt");
    expect(line(getPreset("first-bytes")!.apply(spec({ platform: "windows-msys" })))).toBe("head -c 512 log.txt");
    expect(line(getPreset("first-bytes")!.apply(spec({ platform: "windows-wsl" })))).toBe("head -c 512 log.txt");
  });

  it("binary stays 'head', not 'Get-Content'", () => {
    expect(buildArgv(spec({ platform: "windows-cygwin" })).binary).toBe("head");
    expect(buildArgv(spec({ platform: "windows-msys" })).binary).toBe("head");
    expect(buildArgv(spec({ platform: "windows-wsl" })).binary).toBe("head");
  });
});

describe("PowerShell (Get-Content -TotalCount)", () => {
  const ps = (partial: Partial<HeadSpec> = {}): HeadSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Get-Content -Path", () => {
    expect(line(ps())).toBe("Get-Content -Path log.txt");
  });

  it("renders -TotalCount", () => {
    expect(line(ps({ flags: { totalCountPs: 5 } }))).toBe("Get-Content -Path log.txt -TotalCount 5");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(ps({ flags: { linesCount: 20, quiet: true } }))).toBe("Get-Content -Path log.txt");
  });
});
