import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, getPreset, lint, renderOneLine, type RmSpec } from "@cmdgen/rm";

const line = (spec: RmSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<RmSpec> = {}): RmSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paths and flags", () => {
  it("renders nothing beyond the binary with no paths", () => {
    expect(line(spec())).toBe("rm");
  });

  it("renders -r -f before the path list", () => {
    expect(line(spec({ paths: ["/tmp/build"], flags: { recursive: true, force: true } }))).toBe(
      "rm -r -f /tmp/build",
    );
  });

  it("quotes a path with a space", () => {
    expect(line(spec({ paths: ["/tmp/old backup"] }))).toBe("rm '/tmp/old backup'");
  });

  it("renders identically on mac as on linux", () => {
    expect(line(spec({ platform: "mac", paths: ["/tmp/build"], flags: { recursive: true, force: true } }))).toBe(
      "rm -r -f /tmp/build",
    );
  });
});

describe("lint — this is the safety-critical part", () => {
  it("RM001 fires with no targets", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("RM001");
  });

  it("RM002 catches catastrophic targets like / and ~ and *", () => {
    expect(lint(spec({ paths: ["/"] })).diagnostics.map((d) => d.code)).toContain("RM002");
    expect(lint(spec({ paths: ["~"] })).diagnostics.map((d) => d.code)).toContain("RM002");
    expect(lint(spec({ paths: ["*"] })).diagnostics.map((d) => d.code)).toContain("RM002");
    expect(lint(spec({ paths: ["/srv/app/logs"] })).diagnostics.map((d) => d.code)).not.toContain("RM002");
  });

  it("RM003 fires for -r -f together and stays quiet for -r alone", () => {
    const rf = spec({ paths: ["/tmp/x"], flags: { recursive: true, force: true } });
    expect(lint(rf).diagnostics.map((d) => d.code)).toContain("RM003");
    const rOnly = spec({ paths: ["/tmp/x"], flags: { recursive: true } });
    expect(lint(rOnly).diagnostics.map((d) => d.code)).not.toContain("RM003");
  });

  it("RM004 flags --no-preserve-root and the fix removes it", () => {
    const s = spec({ paths: ["/"], flags: { recursive: true, force: true, noPreserveRoot: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("RM004");
    const fix = result.diagnostics.find((d) => d.code === "RM004")!.fix!;
    expect(fix.apply(s).flags.noPreserveRoot).toBeUndefined();
  });

  it("RM005 always fires when there are real targets — rm has no dry-run", () => {
    expect(lint(spec({ paths: ["/tmp/x"] })).isDestructive).toBe(true);
    expect(lint(spec({ paths: ["/tmp/x"] })).diagnostics.map((d) => d.code)).toContain("RM005");
  });

  it("RM006 warns that -f alone gives no visibility, and the fix adds -v", () => {
    const s = spec({ paths: ["/tmp/x"], flags: { force: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("RM006");
    const fix = result.diagnostics.find((d) => d.code === "RM006")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("RM006");
  });
});

describe("presets", () => {
  it("'Safe delete' is -I -v with no -f", () => {
    const safe = getPreset("safe-delete")!.apply(spec({ paths: ["/tmp/x"] }));
    expect(line(safe)).toBe("rm -I -v /tmp/x");
    expect(lint(safe).isDestructive).toBe(true); // still destructive — RM005 always fires
  });

  it("'Recursive force' is rm -rf and still trips the destructive checks", () => {
    const forced = getPreset("recursive-force")!.apply(spec({ paths: ["/tmp/build"] }));
    expect(line(forced)).toBe("rm -r -f /tmp/build");
    expect(lint(forced).diagnostics.map((d) => d.code)).toContain("RM003");
  });
});

describe("cygwin/msys/wsl — same binary and flags as posix, only path spelling differs", () => {
  it("renders -r -f identically under linux, cygwin, msys, and wsl", () => {
    const flags = { recursive: true, force: true };
    expect(line(spec({ platform: "linux", paths: ["/tmp/build"], flags }))).toBe("rm -r -f /tmp/build");
    expect(line(spec({ platform: "windows-cygwin", paths: ["/tmp/build"], flags }))).toBe("rm -r -f /tmp/build");
    expect(line(spec({ platform: "windows-msys", paths: ["/tmp/build"], flags }))).toBe("rm -r -f /tmp/build");
    expect(line(spec({ platform: "windows-wsl", paths: ["/tmp/build"], flags }))).toBe("rm -r -f /tmp/build");
  });

  it("renders -I -v identically under linux, cygwin, msys, and wsl", () => {
    const flags = { interactive: "once" as const, verbose: true };
    expect(line(spec({ platform: "linux", paths: ["/tmp/x"], flags }))).toBe("rm -I -v /tmp/x");
    expect(line(spec({ platform: "windows-cygwin", paths: ["/tmp/x"], flags }))).toBe("rm -I -v /tmp/x");
    expect(line(spec({ platform: "windows-msys", paths: ["/tmp/x"], flags }))).toBe("rm -I -v /tmp/x");
    expect(line(spec({ platform: "windows-wsl", paths: ["/tmp/x"], flags }))).toBe("rm -I -v /tmp/x");
  });

  it("renders -d identically under linux, cygwin, msys, and wsl", () => {
    const flags = { removeEmptyDirs: true };
    expect(line(spec({ platform: "linux", paths: ["/tmp/empty"], flags }))).toBe("rm -d /tmp/empty");
    expect(line(spec({ platform: "windows-cygwin", paths: ["/tmp/empty"], flags }))).toBe("rm -d /tmp/empty");
    expect(line(spec({ platform: "windows-msys", paths: ["/tmp/empty"], flags }))).toBe("rm -d /tmp/empty");
    expect(line(spec({ platform: "windows-wsl", paths: ["/tmp/empty"], flags }))).toBe("rm -d /tmp/empty");
  });

  it("converts a Windows-style path to Cygwin/MSYS2/WSL bash spelling", () => {
    const target = "C:\\Users\\me\\old-file.txt";
    expect(line(spec({ platform: "windows-cygwin", paths: [target] }))).toBe("rm /cygdrive/c/Users/me/old-file.txt");
    expect(line(spec({ platform: "windows-msys", paths: [target] }))).toBe("rm /c/Users/me/old-file.txt");
    expect(line(spec({ platform: "windows-wsl", paths: [target] }))).toBe("rm /mnt/c/Users/me/old-file.txt");
  });

  it("'Recursive force' preset renders the same POSIX flags under cygwin, msys, and wsl as under linux", () => {
    const linux = getPreset("recursive-force")!.apply(spec({ platform: "linux", paths: ["/tmp/build"] }));
    const cygwin = getPreset("recursive-force")!.apply(spec({ platform: "windows-cygwin", paths: ["/tmp/build"] }));
    const msys = getPreset("recursive-force")!.apply(spec({ platform: "windows-msys", paths: ["/tmp/build"] }));
    const wsl = getPreset("recursive-force")!.apply(spec({ platform: "windows-wsl", paths: ["/tmp/build"] }));
    expect(line(linux)).toBe("rm -r -f /tmp/build");
    expect(line(cygwin)).toBe("rm -r -f /tmp/build");
    expect(line(msys)).toBe("rm -r -f /tmp/build");
    expect(line(wsl)).toBe("rm -r -f /tmp/build");
  });

  it("keeps the binary as 'rm', not 'Remove-Item', under cygwin, msys, and wsl", () => {
    expect(buildArgv(spec({ platform: "windows-cygwin", paths: ["/tmp/x"] })).binary).toBe("rm");
    expect(buildArgv(spec({ platform: "windows-msys", paths: ["/tmp/x"] })).binary).toBe("rm");
    expect(buildArgv(spec({ platform: "windows-wsl", paths: ["/tmp/x"] })).binary).toBe("rm");
  });
});

describe("PowerShell (Remove-Item)", () => {
  const ps = (partial: Partial<RmSpec> = {}): RmSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Remove-Item as the binary, with -Recurse -Force", () => {
    expect(line(ps({ paths: ["/tmp/build"], flags: { recursePs: true, forcePs: true } }))).toBe(
      "Remove-Item -Recurse -Force /tmp/build",
    );
  });

  it("RM002 catches PowerShell-shaped catastrophic targets", () => {
    expect(lint(ps({ paths: ["C:\\"] })).diagnostics.map((d) => d.code)).toContain("RM002");
    expect(lint(ps({ paths: ["\\"] })).diagnostics.map((d) => d.code)).toContain("RM002");
    expect(lint(ps({ paths: ["/srv/app/logs"] })).diagnostics.map((d) => d.code)).not.toContain("RM002");
  });

  it("RM003 fires for -Recurse -Force together", () => {
    const rf = ps({ paths: ["/tmp/x"], flags: { recursePs: true, forcePs: true } });
    expect(lint(rf).diagnostics.map((d) => d.code)).toContain("RM003");
  });

  it("RM004 (--no-preserve-root) never fires on PowerShell — there is no such protection to disable", () => {
    const s = ps({ paths: ["C:\\"], flags: { recursePs: true, forcePs: true, noPreserveRoot: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).not.toContain("RM004");
  });

  it("RM005 offers -WhatIf as a fix, and is satisfied once -WhatIf is set", () => {
    const s = ps({ paths: ["/tmp/x"] });
    const result = lint(s);
    expect(result.isDestructive).toBe(true);
    const fix = result.diagnostics.find((d) => d.code === "RM005")!.fix!;
    const previewed = fix.apply(s);
    expect(previewed.flags.whatIfPs).toBe(true);
    expect(lint(previewed).diagnostics.map((d) => d.code)).not.toContain("RM005");
  });

  it("RM006 warns that -Force alone gives no visibility, and the fix adds -Verbose", () => {
    const s = ps({ paths: ["/tmp/x"], flags: { forcePs: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("RM006");
    const fix = result.diagnostics.find((d) => d.code === "RM006")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("RM006");
  });

  it("'Safe delete' preset is -Confirm -Verbose with no -Force", () => {
    const safe = getPreset("safe-delete")!.apply(ps({ paths: ["/tmp/x"] }));
    expect(line(safe)).toBe("Remove-Item -Confirm -Verbose /tmp/x");
  });

  it("'Preview first' preset is PowerShell-only", () => {
    expect(getPreset("preview-first")!.isApplicable?.(spec())).toBe(false);
    expect(line(getPreset("preview-first")!.apply(ps({ paths: ["/tmp/x"] })))).toBe("Remove-Item -WhatIf /tmp/x");
  });

  it("'Empty directories only' preset is POSIX-only — Remove-Item has no narrower equivalent", () => {
    expect(getPreset("empty-dirs-only")!.isApplicable?.(ps())).toBe(false);
  });
});
