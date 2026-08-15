import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type MkdirSpec } from "@cmdgen/mkdir";

const line = (spec: MkdirSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<MkdirSpec> = {}): MkdirSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("POSIX (mkdir)", () => {
  it("a bare directory with no flags", () => {
    expect(line(spec({ directories: ["dir"] }))).toBe("mkdir dir");
  });

  it("lists multiple directories in order", () => {
    expect(line(spec({ directories: ["a", "b"] }))).toBe("mkdir a b");
  });

  it("renders -p, -v, --mode, --context", () => {
    expect(line(spec({ directories: ["dir"], flags: { parents: true } }))).toBe("mkdir -p dir");
    expect(line(spec({ directories: ["dir"], flags: { verbose: true } }))).toBe("mkdir -v dir");
    // Text/path-kind flags always render their long form, regardless of `preferShort` — the
    // engine's `renderFlag` only consults `preferShort` for boolean flags (see @cmdgen/engine's
    // build/argv.ts). -m has a short form for the UI/docs, but the generated command uses --mode.
    expect(line(spec({ directories: ["dir"], flags: { mode: "755" } }))).toBe("mkdir --mode 755 dir");
    expect(line(spec({ directories: ["dir"], flags: { context: "unconfined_u" } }))).toBe(
      "mkdir --context=unconfined_u dir",
    );
  });

  it("quotes a directory with a space", () => {
    expect(line(spec({ directories: ["my dir"] }))).toBe("mkdir 'my dir'");
  });
});

describe("lint", () => {
  it("MKDIR001 catches no directories", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("MKDIR001");
  });

  it("a directory with flags has no diagnostics", () => {
    expect(lint(spec({ directories: ["dir"], flags: { parents: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Create nested directories' is -p", () => {
    expect(line(getPreset("nested-directories")!.apply(spec()))).toBe("mkdir -p mydir/subdir");
  });

  it("'Create with explicit permissions' is -p --mode 755", () => {
    expect(line(getPreset("with-explicit-permissions")!.apply(spec()))).toBe("mkdir -p --mode 755 mydir");
  });

  it("'Create with explicit permissions' is POSIX only", () => {
    const win = spec({ platform: "windows-cmd" });
    expect(getPreset("with-explicit-permissions")!.isApplicable?.(win)).toBe(false);
  });

  it("'Create nested directories' renders backslashes on cmd.exe, not the raw forward-slash preset value — this is the exact bug a user hit running the generated command", () => {
    expect(line(getPreset("nested-directories")!.apply(spec({ platform: "windows-cmd" })))).toBe(
      "md mydir\\subdir",
    );
  });
});

describe("describeSpec", () => {
  it("describes a plain create", () => {
    expect(describeSpec(spec({ directories: ["dir"] }))).toBe("Create dir on Linux.");
  });

  it("describes -p and -m together", () => {
    expect(describeSpec(spec({ directories: ["dir"], flags: { parents: true, mode: "755" } }))).toBe(
      "Create dir on Linux, creating any missing intermediate directories, with permissions 755.",
    );
  });
});

describe("cmd.exe (md)", () => {
  const cmd = (partial: Partial<MkdirSpec> = {}): MkdirSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses md as the binary, with no flags at all", () => {
    expect(line(cmd({ directories: ["dir"] }))).toBe("md dir");
  });

  it("lists multiple directories, still no flags", () => {
    expect(line(cmd({ directories: ["a", "b"] }))).toBe("md a b");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ directories: ["dir"], flags: { parents: true, mode: "755" } }))).toBe("md dir");
  });

  it("quotes a directory with a space using double quotes", () => {
    expect(line(cmd({ directories: ["my dir"] }))).toBe('md "my dir"');
  });

  it("converts forward slashes to backslashes — cmd.exe's md misreads embedded \"/\" as a switch attempt", () => {
    // Real-world bug: "md mydir/subdir" makes cmd.exe's legacy internal-command
    // parser try to read "/s" as a switch, producing "The syntax of the command
    // is incorrect." instead of creating anything.
    expect(line(cmd({ directories: ["mydir/subdir"] }))).toBe("md mydir\\subdir");
  });

  it("leaves forward slashes untouched on POSIX, mac, and PowerShell — only cmd.exe needs this", () => {
    expect(line(spec({ directories: ["mydir/subdir"] }))).toBe("mkdir mydir/subdir");
    expect(line(spec({ platform: "mac", directories: ["mydir/subdir"] }))).toBe("mkdir mydir/subdir");
    expect(line(spec({ platform: "windows-powershell", directories: ["mydir/subdir"] }))).toBe(
      "New-Item -ItemType Directory -Path mydir/subdir",
    );
  });
});

describe("cygwin/msys/wsl (mkdir) — same real binary and flags as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<MkdirSpec> = {}): MkdirSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<MkdirSpec> = {}): MkdirSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<MkdirSpec> = {}): MkdirSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses mkdir (not md or New-Item) as the binary", () => {
    expect(line(cygwin({ directories: ["dir"] }))).toBe("mkdir dir");
    expect(line(msys({ directories: ["dir"] }))).toBe("mkdir dir");
    expect(line(wsl({ directories: ["dir"] }))).toBe("mkdir dir");
  });

  it("renders -p, -v, --mode, --context identically to linux/mac", () => {
    expect(line(cygwin({ directories: ["dir"], flags: { parents: true } }))).toBe("mkdir -p dir");
    expect(line(msys({ directories: ["dir"], flags: { parents: true, mode: "755" } }))).toBe(
      "mkdir -p --mode 755 dir",
    );
    expect(line(wsl({ directories: ["dir"], flags: { parents: true, mode: "755" } }))).toBe(
      "mkdir -p --mode 755 dir",
    );
  });

  it("a relative forward-slash path is left as-is — nothing to rewrite without a drive letter", () => {
    expect(line(cygwin({ directories: ["mydir/subdir"] }))).toBe("mkdir mydir/subdir");
    expect(line(msys({ directories: ["mydir/subdir"] }))).toBe("mkdir mydir/subdir");
    expect(line(wsl({ directories: ["mydir/subdir"] }))).toBe("mkdir mydir/subdir");
  });

  it("converts a Windows-style absolute path to the dialect's own bash spelling", () => {
    expect(line(cygwin({ directories: ["C:\\Users\\me\\newdir"] }))).toBe("mkdir /cygdrive/c/Users/me/newdir");
    expect(line(msys({ directories: ["C:\\Users\\me\\newdir"] }))).toBe("mkdir /c/Users/me/newdir");
    expect(line(wsl({ directories: ["C:\\Users\\me\\newdir"] }))).toBe("mkdir /mnt/c/Users/me/newdir");
  });

  it("'Create with explicit permissions' now applies — it's POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("with-explicit-permissions")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("with-explicit-permissions")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("with-explicit-permissions")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("with-explicit-permissions")!.apply(cygwin()))).toBe("mkdir -p --mode 755 mydir");
    expect(line(getPreset("with-explicit-permissions")!.apply(wsl()))).toBe("mkdir -p --mode 755 mydir");
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin({ directories: ["dir"] }))).toBe("Create dir on Windows (Cygwin).");
    expect(describeSpec(msys({ directories: ["dir"] }))).toBe("Create dir on Windows (MSYS2).");
    expect(describeSpec(wsl({ directories: ["dir"] }))).toBe("Create dir on Windows (WSL).");
  });
});

describe("PowerShell (New-Item)", () => {
  const ps = (partial: Partial<MkdirSpec> = {}): MkdirSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses New-Item -ItemType Directory -Path, with no directories", () => {
    expect(line(ps())).toBe("New-Item -ItemType Directory");
  });

  it("renders a single directory after -Path", () => {
    expect(line(ps({ directories: ["dir"] }))).toBe("New-Item -ItemType Directory -Path dir");
  });

  it("joins multiple directories with a comma, matching -Path's array syntax", () => {
    expect(line(ps({ directories: ["a", "b"] }))).toBe("New-Item -ItemType Directory -Path a, b");
  });

  it("renders -Force at the end", () => {
    expect(line(ps({ directories: ["dir"], flags: { forcePs: true } }))).toBe(
      "New-Item -ItemType Directory -Path dir -Force",
    );
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(ps({ directories: ["dir"], flags: { parents: true, mode: "755" } }))).toBe(
      "New-Item -ItemType Directory -Path dir",
    );
  });

  it("quotes a directory with a space using single quotes, comma still appended", () => {
    expect(line(ps({ directories: ["my dir", "b"] }))).toBe("New-Item -ItemType Directory -Path 'my dir', b");
  });
});
