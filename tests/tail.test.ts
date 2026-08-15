import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type TailSpec } from "@cmdgen/tail";

const line = (spec: TailSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<TailSpec> = {}): TailSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["log.txt"],
  ...partial,
});

describe("POSIX (tail)", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("tail log.txt");
  });

  it("renders -n, -c, -f, -q, -v", () => {
    expect(line(spec({ flags: { linesCount: 50 } }))).toBe("tail -n 50 log.txt");
    expect(line(spec({ flags: { bytesCount: 512 } }))).toBe("tail -c 512 log.txt");
    expect(line(spec({ flags: { follow: true } }))).toBe("tail -f log.txt");
    expect(line(spec({ flags: { quiet: true } }))).toBe("tail -q log.txt");
    expect(line(spec({ flags: { verbose: true } }))).toBe("tail -v log.txt");
  });

  it("renders identically on mac as on linux", () => {
    expect(line(spec({ platform: "mac", flags: { linesCount: 50 } }))).toBe("tail -n 50 log.txt");
  });
});

describe("lint", () => {
  it("TAIL001 catches no files", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).toContain("TAIL001");
  });

  it("TAIL002 catches -n and -c together, and -q and -v together", () => {
    expect(lint(spec({ flags: { linesCount: 5, bytesCount: 5 } })).diagnostics.map((d) => d.code)).toContain("TAIL002");
    expect(lint(spec({ flags: { quiet: true, verbose: true } })).diagnostics.map((d) => d.code)).toContain("TAIL002");
  });

  it("TAIL003 notes following multiple files", () => {
    const s = spec({ files: ["a.txt", "b.txt"], flags: { follow: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("TAIL003");
  });

  it("TAIL003 does not fire for a single followed file", () => {
    expect(lint(spec({ flags: { follow: true } })).diagnostics.map((d) => d.code)).not.toContain("TAIL003");
  });

  it("a plain tail has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Last 10 lines' is a bare tail", () => {
    expect(line(getPreset("last-10-lines")!.apply(spec()))).toBe("tail log.txt");
  });

  it("'Follow a live log' is -f on POSIX, -Wait on PowerShell", () => {
    expect(line(getPreset("follow-log")!.apply(spec()))).toBe("tail -f log.txt");
    expect(line(getPreset("follow-log")!.apply(spec({ platform: "windows-powershell" })))).toBe(
      "Get-Content -Path log.txt -Wait",
    );
  });

  it("'Last 50 lines' is -n 50 on POSIX, -Tail 50 on PowerShell", () => {
    expect(line(getPreset("last-n-lines")!.apply(spec()))).toBe("tail -n 50 log.txt");
    expect(line(getPreset("last-n-lines")!.apply(spec({ platform: "windows-powershell" })))).toBe(
      "Get-Content -Path log.txt -Tail 50",
    );
  });
});

describe("describeSpec", () => {
  it("describes the default 10-line case", () => {
    expect(describeSpec(spec())).toBe("Print the last 10 lines of log.txt.");
  });

  it("describes -f", () => {
    expect(describeSpec(spec({ flags: { follow: true } }))).toBe(
      "Print the last 10 lines of log.txt, then keep watching for new lines as they're appended.",
    );
  });
});

describe("cygwin/msys/wsl — same binary and flags as linux/mac, only path spelling differs", () => {
  it("renders -n, -f, -q the same as linux/mac", () => {
    expect(line(spec({ platform: "windows-cygwin", flags: { linesCount: 50 } }))).toBe("tail -n 50 log.txt");
    expect(line(spec({ platform: "windows-msys", flags: { linesCount: 50 } }))).toBe("tail -n 50 log.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { linesCount: 50 } }))).toBe("tail -n 50 log.txt");

    expect(line(spec({ platform: "windows-cygwin", flags: { follow: true } }))).toBe("tail -f log.txt");
    expect(line(spec({ platform: "windows-msys", flags: { follow: true } }))).toBe("tail -f log.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { follow: true } }))).toBe("tail -f log.txt");

    expect(line(spec({ platform: "windows-cygwin", flags: { quiet: true } }))).toBe("tail -q log.txt");
    expect(line(spec({ platform: "windows-msys", flags: { quiet: true } }))).toBe("tail -q log.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { quiet: true } }))).toBe("tail -q log.txt");
  });

  it("rewrites a Windows-style file path to the bash spelling for each dialect", () => {
    expect(line(spec({ platform: "windows-cygwin", files: ["C:\\Users\\me\\log.txt"] }))).toBe(
      "tail /cygdrive/c/Users/me/log.txt",
    );
    expect(line(spec({ platform: "windows-msys", files: ["C:\\Users\\me\\log.txt"] }))).toBe(
      "tail /c/Users/me/log.txt",
    );
    expect(line(spec({ platform: "windows-wsl", files: ["C:\\Users\\me\\log.txt"] }))).toBe(
      "tail /mnt/c/Users/me/log.txt",
    );
  });

  it("'Follow a live log' renders the same POSIX-side output as under linux/mac", () => {
    expect(line(getPreset("follow-log")!.apply(spec({ platform: "windows-cygwin" })))).toBe("tail -f log.txt");
    expect(line(getPreset("follow-log")!.apply(spec({ platform: "windows-msys" })))).toBe("tail -f log.txt");
    expect(line(getPreset("follow-log")!.apply(spec({ platform: "windows-wsl" })))).toBe("tail -f log.txt");
  });

  it("'Last 50 lines' renders the same POSIX-side output as under linux/mac", () => {
    expect(line(getPreset("last-n-lines")!.apply(spec({ platform: "windows-cygwin" })))).toBe("tail -n 50 log.txt");
    expect(line(getPreset("last-n-lines")!.apply(spec({ platform: "windows-msys" })))).toBe("tail -n 50 log.txt");
    expect(line(getPreset("last-n-lines")!.apply(spec({ platform: "windows-wsl" })))).toBe("tail -n 50 log.txt");
  });

  it("keeps the binary as tail, not Get-Content", () => {
    expect(buildArgv(spec({ platform: "windows-cygwin" })).binary).toBe("tail");
    expect(buildArgv(spec({ platform: "windows-msys" })).binary).toBe("tail");
    expect(buildArgv(spec({ platform: "windows-wsl" })).binary).toBe("tail");
  });
});

describe("PowerShell (Get-Content -Tail/-Wait)", () => {
  const ps = (partial: Partial<TailSpec> = {}): TailSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Get-Content -Path", () => {
    expect(line(ps())).toBe("Get-Content -Path log.txt");
  });

  it("renders -Tail and -Wait", () => {
    expect(line(ps({ flags: { tailCountPs: 5, waitPs: true } }))).toBe("Get-Content -Path log.txt -Tail 5 -Wait");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(ps({ flags: { follow: true, linesCount: 5 } }))).toBe("Get-Content -Path log.txt");
  });
});
