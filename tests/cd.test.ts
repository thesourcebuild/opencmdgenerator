import { describe, expect, it } from "vitest";
import { PRESETS, buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CdSpec } from "@cmdgen/cd";

/**
 * Exact-string assertions, same convention as tests/rsync-argv.test.ts: a spec in,
 * an exact command out, so a diff shows what changed rather than a hash.
 */
const line = (spec: CdSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<CdSpec> = {}): CdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("platform-gated flags", () => {
  it("renders POSIX symlink modes on linux and mac, nowhere else", () => {
    // `~/projects` stays bare here (see "path handling" below for why —
    // unlike the generic quotePosix tested in tests/quote.test.ts, cd
    // deliberately preserves tilde-expansion since it's central to its domain).
    expect(line(spec({ platform: "linux", path: "~/projects", flags: { symlinkMode: "physical" } }))).toBe(
      "cd -P ~/projects",
    );
    expect(line(spec({ platform: "mac", path: "~/projects", flags: { symlinkMode: "logical" } }))).toBe(
      "cd -L ~/projects",
    );
  });

  it("only emits -e alongside physical mode", () => {
    const withPhysical = spec({
      platform: "linux",
      path: "/data",
      flags: { symlinkMode: "physical", errorIfCwdUnavailable: true },
    });
    expect(line(withPhysical)).toBe("cd -P -e /data");
  });

  it("drops POSIX-only flags entirely when the platform is windows-cmd", () => {
    const spec1 = spec({
      platform: "windows-cmd",
      path: "D:\\Data",
      // These are POSIX-only ids; setting them on windows-cmd must not render.
      flags: { symlinkMode: "physical", errorIfCwdUnavailable: true, extendedAttributes: true },
    });
    expect(line(spec1)).toBe("cd D:\\Data");
  });

  it("renders /d only on windows-cmd", () => {
    expect(line(spec({ platform: "windows-cmd", path: "D:\\Data", flags: { switchDrive: true } }))).toBe(
      "cd /d D:\\Data",
    );
    expect(line(spec({ platform: "linux", path: "/data", flags: { switchDrive: true } }))).toBe(
      "cd /data",
    );
  });

  it("renders PowerShell-only flags only on windows-powershell", () => {
    const ps = spec({
      platform: "windows-powershell",
      path: "C:\\Data",
      flags: { literalPath: true, passThru: true },
    });
    expect(line(ps)).toBe("cd -LiteralPath -PassThru C:\\Data");

    const notPs = spec({ platform: "mac", path: "/data", flags: { literalPath: true } });
    expect(line(notPs)).toBe("cd /data");
  });
});

describe("path handling", () => {
  it("omits the path token entirely when empty (bash: go home)", () => {
    expect(line(spec({ platform: "linux", path: "" }))).toBe("cd");
  });

  it("quotes a POSIX path with spaces and an apostrophe", () => {
    expect(line(spec({ platform: "mac", path: "/Users/me/Bob's Files" }))).toBe(
      `cd '/Users/me/Bob'\\''s Files'`,
    );
  });

  it("quotes a PowerShell path with spaces", () => {
    expect(line(spec({ platform: "windows-powershell", path: "C:\\Program Files\\App" }))).toBe(
      "cd 'C:\\Program Files\\App'",
    );
  });

  it("quotes a cmd.exe path with spaces using double quotes", () => {
    expect(line(spec({ platform: "windows-cmd", path: "C:\\Program Files\\App" }))).toBe(
      'cd "C:\\Program Files\\App"',
    );
  });

  it("supports cd - (previous directory) as a bare path", () => {
    expect(line(spec({ platform: "linux", path: "-" }))).toBe("cd -");
  });

  it("leaves tilde shorthand bare on POSIX and PowerShell, but not cmd.exe", () => {
    expect(line(spec({ platform: "linux", path: "~" }))).toBe("cd ~");
    expect(line(spec({ platform: "mac", path: "~bob" }))).toBe("cd ~bob");
    expect(line(spec({ platform: "mac", path: "~bob/reports" }))).toBe("cd ~bob/reports");
    expect(line(spec({ platform: "windows-powershell", path: "~bob" }))).toBe("cd ~bob");
    // cmd.exe has no tilde shorthand at all (see CD002), so this is quoted like any other value.
    expect(line(spec({ platform: "windows-cmd", path: "~bob" }))).toBe('cd "~bob"');
  });

  it("still quotes a path that merely contains a tilde later on, not as a leading shorthand", () => {
    expect(line(spec({ platform: "linux", path: "/data/~backup" }))).toBe("cd '/data/~backup'");
  });

  it("converts forward slashes to backslashes on cmd.exe — its cd misreads embedded \"/\" as a switch attempt", () => {
    expect(line(spec({ platform: "windows-cmd", path: "sub/dir" }))).toBe("cd sub\\dir");
  });

  it("leaves forward slashes untouched on POSIX and PowerShell — only cmd.exe needs this", () => {
    expect(line(spec({ platform: "linux", path: "sub/dir" }))).toBe("cd sub/dir");
    expect(line(spec({ platform: "windows-powershell", path: "sub/dir" }))).toBe("cd sub/dir");
  });
});

describe("cygwin/msys/wsl (cd) — same real shell builtin as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<CdSpec> = {}): CdSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<CdSpec> = {}): CdSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<CdSpec> = {}): CdSpec => spec({ platform: "windows-wsl", ...partial });

  it("renders POSIX symlink modes, same as linux/mac", () => {
    expect(line(cygwin({ path: "/data", flags: { symlinkMode: "physical" } }))).toBe("cd -P /data");
    expect(line(msys({ path: "/data", flags: { symlinkMode: "logical" } }))).toBe("cd -L /data");
    expect(line(wsl({ path: "/data", flags: { symlinkMode: "logical" } }))).toBe("cd -L /data");
  });

  it("drops cmd.exe/PowerShell-only flags entirely", () => {
    expect(line(cygwin({ path: "/data", flags: { switchDrive: true, literalPath: true, passThru: true } }))).toBe(
      "cd /data",
    );
    expect(line(wsl({ path: "/data", flags: { switchDrive: true, literalPath: true, passThru: true } }))).toBe(
      "cd /data",
    );
  });

  it("omits the path token entirely when empty (bash: go home)", () => {
    expect(line(cygwin())).toBe("cd");
    expect(line(msys())).toBe("cd");
    expect(line(wsl())).toBe("cd");
  });

  it("leaves tilde shorthand bare, same as linux/mac/PowerShell", () => {
    expect(line(cygwin({ path: "~" }))).toBe("cd ~");
    expect(line(msys({ path: "~bob/reports" }))).toBe("cd ~bob/reports");
    expect(line(wsl({ path: "~bob/reports" }))).toBe("cd ~bob/reports");
  });

  it("leaves a relative forward-slash path untouched — nothing to rewrite without a drive letter", () => {
    expect(line(cygwin({ path: "sub/dir" }))).toBe("cd sub/dir");
    expect(line(msys({ path: "sub/dir" }))).toBe("cd sub/dir");
    expect(line(wsl({ path: "sub/dir" }))).toBe("cd sub/dir");
  });

  it("converts a Windows-style absolute path to the dialect's own bash spelling", () => {
    expect(line(cygwin({ path: "C:\\Users\\me\\Projects" }))).toBe("cd /cygdrive/c/Users/me/Projects");
    expect(line(msys({ path: "C:\\Users\\me\\Projects" }))).toBe("cd /c/Users/me/Projects");
    expect(line(wsl({ path: "C:\\Users\\me\\Projects" }))).toBe("cd /mnt/c/Users/me/Projects");
  });

  it("still quotes a converted path that contains a space", () => {
    expect(line(cygwin({ path: "C:\\Program Files\\App" }))).toBe("cd '/cygdrive/c/Program Files/App'");
    expect(line(wsl({ path: "C:\\Program Files\\App" }))).toBe("cd '/mnt/c/Program Files/App'");
  });

  it("'Previous directory' and 'Another user's home' now apply — POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("previous")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("other-user-home")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("other-user-home")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("previous")!.apply(cygwin({ path: "/somewhere" })))).toBe("cd -");
  });

  it("'Home directory' preset goes home with a bare cd, same as linux/mac", () => {
    const home = getPreset("home")!;
    expect(line(home.apply(cygwin({ path: "/somewhere" })))).toBe("cd");
    expect(line(home.apply(msys({ path: "/somewhere" })))).toBe("cd");
    expect(line(home.apply(wsl({ path: "/somewhere" })))).toBe("cd");
  });

  it("'Root directory' and 'Up two levels' use POSIX separators, not backslashes", () => {
    expect(line(getPreset("root")!.apply(cygwin()))).toBe("cd /");
    expect(line(getPreset("up-two")!.apply(msys()))).toBe("cd ../..");
    expect(line(getPreset("up-two")!.apply(wsl()))).toBe("cd ../..");
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin({ path: "/data" }))).toBe('Change the working directory to "/data" on Windows (Cygwin).');
    expect(describeSpec(msys({ path: "/data" }))).toBe('Change the working directory to "/data" on Windows (MSYS2).');
    expect(describeSpec(wsl({ path: "/data" }))).toBe('Change the working directory to "/data" on Windows (WSL).');
  });

  it("CD001 does NOT fire for a Windows-style path — unlike linux/mac, where it still should", () => {
    expect(lint(cygwin({ path: "C:\\Data" })).diagnostics.map((d) => d.code)).not.toContain("CD001");
    expect(lint(msys({ path: "C:\\Data" })).diagnostics.map((d) => d.code)).not.toContain("CD001");
    expect(lint(wsl({ path: "C:\\Data" })).diagnostics.map((d) => d.code)).not.toContain("CD001");
    expect(lint(spec({ platform: "linux", path: "C:\\Data" })).diagnostics.map((d) => d.code)).toContain(
      "CD001",
    );
    expect(lint(spec({ platform: "mac", path: "C:\\Data" })).diagnostics.map((d) => d.code)).toContain(
      "CD001",
    );
  });

  it("CD002 does NOT fire — Cygwin, MSYS2 and WSL expand ~ via their real bash, unlike cmd.exe", () => {
    expect(lint(cygwin({ path: "~/projects" })).diagnostics.map((d) => d.code)).not.toContain("CD002");
    expect(lint(msys({ path: "~/projects" })).diagnostics.map((d) => d.code)).not.toContain("CD002");
    expect(lint(wsl({ path: "~/projects" })).diagnostics.map((d) => d.code)).not.toContain("CD002");
  });
});

describe("lint", () => {
  it("CD001 warns about a Windows path on a POSIX platform", () => {
    const s = spec({ platform: "linux", path: "C:\\Data" });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CD001");
    expect(lint({ ...s, platform: "windows-cmd" }).diagnostics.map((d) => d.code)).not.toContain(
      "CD001",
    );
  });

  it("CD002 warns about ~ on cmd.exe (but not PowerShell, which expands it) and the fix uses %USERPROFILE%", () => {
    const s = spec({ platform: "windows-cmd", path: "~/projects" });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CD002");

    const fix = result.diagnostics.find((d) => d.code === "CD002")?.fix;
    expect(fix).toBeDefined();
    expect(fix!.apply(s).path).toBe("%USERPROFILE%");
    expect(lint(fix!.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CD002");

    // PowerShell's filesystem provider expands ~ directly — no warning there.
    expect(lint({ ...s, platform: "windows-powershell" }).diagnostics.map((d) => d.code)).not.toContain(
      "CD002",
    );
  });

  it("a clean POSIX spec has no diagnostics", () => {
    expect(lint(spec({ platform: "linux", path: "/srv/app" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Home directory' goes home correctly on every platform", () => {
    const home = getPreset("home")!;
    expect(line(home.apply(spec({ platform: "linux", path: "/somewhere" })))).toBe("cd");
    expect(line(home.apply(spec({ platform: "mac", path: "/somewhere" })))).toBe("cd");
    expect(line(home.apply(spec({ platform: "windows-powershell", path: "C:\\Data" })))).toBe("cd ~");
    // Quoted, unlike PowerShell's `~` — but harmless: cmd.exe expands %VAR%
    // regardless of quoting, since that substitution happens before the
    // quotes are stripped, so this still resolves to the real home directory.
    expect(line(home.apply(spec({ platform: "windows-cmd", path: "C:\\Data" })))).toBe(
      'cd /d "%USERPROFILE%"',
    );
  });

  it("'Previous directory' only applies on POSIX platforms", () => {
    const previous = getPreset("previous")!;
    expect(previous.isApplicable?.(spec({ platform: "linux" }))).toBe(true);
    expect(previous.isApplicable?.(spec({ platform: "mac" }))).toBe(true);
    expect(previous.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
    expect(previous.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);

    expect(line(previous.apply(spec({ platform: "linux", path: "/somewhere" })))).toBe("cd -");
    // Applying it anyway (defense in depth) must not silently produce a
    // misleading command on a platform with no such feature.
    const unchanged = spec({ platform: "windows-cmd", path: "/somewhere" });
    expect(previous.apply(unchanged)).toEqual(unchanged);
  });

  it("'Parent directory' is .. on every platform", () => {
    const parent = getPreset("parent")!;
    expect(line(parent.apply(spec({ platform: "linux" })))).toBe("cd ..");
    expect(line(parent.apply(spec({ platform: "windows-cmd" })))).toBe("cd ..");
    expect(line(parent.apply(spec({ platform: "windows-powershell" })))).toBe("cd ..");
  });

  it("'Up two levels' uses the platform's own separator", () => {
    const upTwo = getPreset("up-two")!;
    expect(line(upTwo.apply(spec({ platform: "mac" })))).toBe("cd ../..");
    expect(line(upTwo.apply(spec({ platform: "windows-powershell" })))).toBe("cd ..\\..");
  });

  it("'Root directory' is / on POSIX and \\ (current drive) on Windows", () => {
    const root = getPreset("root")!;
    expect(line(root.apply(spec({ platform: "linux" })))).toBe("cd /");
    expect(line(root.apply(spec({ platform: "windows-cmd" })))).toBe("cd \\");
  });

  it("'Another user's home' only applies on POSIX and leaves ~username bare", () => {
    const otherUserHome = getPreset("other-user-home")!;
    expect(otherUserHome.isApplicable?.(spec({ platform: "linux" }))).toBe(true);
    expect(otherUserHome.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
    expect(line(otherUserHome.apply(spec({ platform: "linux" })))).toBe("cd ~username");
  });

  it("every preset in the catalogue round-trips through describe/build without throwing", () => {
    for (const preset of PRESETS) {
      const result = preset.apply(spec({ platform: "windows-cmd" }));
      expect(() => line(result)).not.toThrow();
    }
  });
});
