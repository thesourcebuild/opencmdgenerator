import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, getPreset, lint, renderOneLine, type LsSpec } from "@cmdgen/ls";

const line = (spec: LsSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<LsSpec> = {}): LsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paths and flags", () => {
  it("lists the current directory implicitly when paths is empty", () => {
    expect(line(spec())).toBe("ls");
  });

  it("lists multiple paths in order", () => {
    expect(line(spec({ paths: ["/etc", "/var/log"] }))).toBe("ls /etc /var/log");
  });

  it("renders flags before paths, in catalogue order", () => {
    expect(line(spec({ paths: ["/tmp"], flags: { long: true, all: true, humanReadable: true } }))).toBe(
      "ls -l -a -h /tmp",
    );
  });

  it("renders the sort and color enums", () => {
    expect(line(spec({ flags: { sortBy: "time", color: "always" } }))).toBe("ls --color=always -t");
  });

  it("renders identically on mac as on linux", () => {
    expect(line(spec({ platform: "mac", paths: ["/tmp"], flags: { long: true } }))).toBe("ls -l /tmp");
  });
});

describe("lint", () => {
  it("LS001 catches -R and -d together", () => {
    const s = spec({ flags: { recursive: true, directory: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("LS001");
  });

  it("LS002 catches -h without -l, and the fix enables -l", () => {
    const s = spec({ flags: { humanReadable: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("LS002");
    const fix = result.diagnostics.find((d) => d.code === "LS002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("LS002");
  });

  it("a plain long listing has no diagnostics", () => {
    expect(lint(spec({ flags: { long: true, humanReadable: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Long listing' is -l -h", () => {
    expect(line(getPreset("long-listing")!.apply(spec()))).toBe("ls -l -h");
  });

  it("'Newest first' sorts by time", () => {
    expect(line(getPreset("newest-first")!.apply(spec()))).toBe("ls -l -h -t");
  });
});

describe("PowerShell (Get-ChildItem)", () => {
  const ps = (partial: Partial<LsSpec> = {}): LsSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Get-ChildItem as the binary", () => {
    expect(line(ps())).toBe("Get-ChildItem");
  });

  it("renders -Force and -Directory", () => {
    expect(line(ps({ flags: { forceHiddenPs: true, directoryOnlyPs: true } }))).toBe(
      "Get-ChildItem -Force -Directory",
    );
  });

  it("POSIX-only flags (e.g. long, sortBy) are silently dropped on PowerShell", () => {
    expect(line(ps({ flags: { long: true, sortBy: "time" } }))).toBe("Get-ChildItem");
  });

  it("PowerShell-only flags (e.g. -Force) are silently dropped on POSIX", () => {
    expect(line(spec({ flags: { forceHiddenPs: true } }))).toBe("ls");
  });

  it("LS001 catches -Directory and -File together", () => {
    const s = ps({ flags: { directoryOnlyPs: true, fileOnlyPs: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("LS001");
  });

  it("LS002 catches -Depth without -Recurse", () => {
    const s = ps({ flags: { depthPs: 2 } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("LS002");
  });

  it("'Show hidden files' preset is -Force on PowerShell", () => {
    expect(line(getPreset("show-hidden")!.apply(ps()))).toBe("Get-ChildItem -Force");
  });

  it("'Recursive listing' preset is -Recurse on PowerShell, -R on POSIX", () => {
    expect(line(getPreset("recursive-listing")!.apply(ps()))).toBe("Get-ChildItem -Recurse");
    expect(line(getPreset("recursive-listing")!.apply(spec()))).toBe("ls -R");
  });

  it("'Directories only' preset is PowerShell-only", () => {
    expect(getPreset("directories-only")!.isApplicable?.(spec())).toBe(false);
    expect(getPreset("directories-only")!.isApplicable?.(ps())).toBe(true);
    expect(line(getPreset("directories-only")!.apply(ps()))).toBe("Get-ChildItem -Directory");
  });
});

describe("cygwin/msys/wsl — same binary and flags as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<LsSpec> = {}): LsSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<LsSpec> = {}): LsSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<LsSpec> = {}): LsSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses ls (not Get-ChildItem) as the binary", () => {
    expect(line(cygwin())).toBe("ls");
    expect(line(msys())).toBe("ls");
    expect(line(wsl())).toBe("ls");
  });

  it("renders flags identically to linux/mac", () => {
    expect(line(cygwin({ paths: ["/tmp"], flags: { long: true, all: true, humanReadable: true } }))).toBe(
      "ls -l -a -h /tmp",
    );
    expect(line(msys({ paths: ["/tmp"], flags: { long: true, all: true, humanReadable: true } }))).toBe(
      "ls -l -a -h /tmp",
    );
    expect(line(wsl({ paths: ["/tmp"], flags: { long: true, all: true, humanReadable: true } }))).toBe(
      "ls -l -a -h /tmp",
    );
    expect(line(cygwin({ flags: { sortBy: "time", color: "always" } }))).toBe("ls --color=always -t");
    expect(line(msys({ flags: { sortBy: "time", color: "always" } }))).toBe("ls --color=always -t");
    expect(line(wsl({ flags: { sortBy: "time", color: "always" } }))).toBe("ls --color=always -t");
  });

  it("PowerShell-only flags (e.g. -Force) are silently dropped, same as posix", () => {
    expect(line(cygwin({ flags: { forceHiddenPs: true } }))).toBe("ls");
    expect(line(msys({ flags: { forceHiddenPs: true } }))).toBe("ls");
    expect(line(wsl({ flags: { forceHiddenPs: true } }))).toBe("ls");
  });

  it("converts a Windows-style path argument to the dialect's own bash spelling", () => {
    expect(line(cygwin({ paths: ["C:\\Users\\me\\Projects"] }))).toBe("ls /cygdrive/c/Users/me/Projects");
    expect(line(msys({ paths: ["C:\\Users\\me\\Projects"] }))).toBe("ls /c/Users/me/Projects");
    expect(line(wsl({ paths: ["C:\\Users\\me\\Projects"] }))).toBe("ls /mnt/c/Users/me/Projects");
  });

  it("'Long listing' preset applies and renders the same as posix", () => {
    expect(getPreset("long-listing")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("long-listing")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("long-listing")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("long-listing")!.apply(cygwin()))).toBe("ls -l -h");
    expect(line(getPreset("long-listing")!.apply(msys()))).toBe("ls -l -h");
    expect(line(getPreset("long-listing")!.apply(wsl()))).toBe("ls -l -h");
  });

  it("LS001/LS002 still fire under cygwin/msys/wsl, same as posix", () => {
    expect(lint(cygwin({ flags: { recursive: true, directory: true } })).diagnostics.map((d) => d.code)).toContain(
      "LS001",
    );
    expect(lint(msys({ flags: { recursive: true, directory: true } })).diagnostics.map((d) => d.code)).toContain(
      "LS001",
    );
    expect(lint(wsl({ flags: { recursive: true, directory: true } })).diagnostics.map((d) => d.code)).toContain(
      "LS001",
    );
    expect(lint(cygwin({ flags: { humanReadable: true } })).diagnostics.map((d) => d.code)).toContain("LS002");
    expect(lint(msys({ flags: { humanReadable: true } })).diagnostics.map((d) => d.code)).toContain("LS002");
    expect(lint(wsl({ flags: { humanReadable: true } })).diagnostics.map((d) => d.code)).toContain("LS002");
  });
});
