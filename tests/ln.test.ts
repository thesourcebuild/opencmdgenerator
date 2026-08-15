import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type LnSpec } from "@cmdgen/ln";

const line = (spec: LnSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<LnSpec> = {}): LnSpec => ({
  ...createSpec({ id: "test-spec" }),
  target: "a.txt",
  linkName: "b.txt",
  ...partial,
});

describe("POSIX (ln) — target then link name", () => {
  it("a bare hard link (the default, no -s)", () => {
    expect(line(spec())).toBe("ln a.txt b.txt");
  });

  it("renders -s for a symbolic link", () => {
    expect(line(spec({ flags: { symbolic: true } }))).toBe("ln -s a.txt b.txt");
  });

  it("renders -f, -i, -v, -r, -T", () => {
    expect(line(spec({ flags: { force: true } }))).toBe("ln -f a.txt b.txt");
    expect(line(spec({ flags: { interactive: true } }))).toBe("ln -i a.txt b.txt");
    expect(line(spec({ flags: { verbose: true } }))).toBe("ln -v a.txt b.txt");
    expect(line(spec({ flags: { symbolic: true, relative: true } }))).toBe("ln -s -r a.txt b.txt");
    expect(line(spec({ flags: { noTargetDirectory: true } }))).toBe("ln -T a.txt b.txt");
  });
});

describe("lint", () => {
  it("LN001 catches a missing target and link name, separately", () => {
    const noTarget = spec({ target: "" });
    expect(lint(noTarget).diagnostics.filter((d) => d.code === "LN001")).toHaveLength(1);

    const neither = spec({ target: "", linkName: "" });
    expect(lint(neither).diagnostics.filter((d) => d.code === "LN001")).toHaveLength(2);
  });

  it("LN002 catches -f and -i together", () => {
    const s = spec({ flags: { force: true, interactive: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("LN002");
    const fix = result.diagnostics.find((d) => d.code === "LN002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("LN002");
  });

  it("LN003 catches -r without -s, and the fix enables -s", () => {
    const s = spec({ flags: { relative: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("LN003");
    const fix = result.diagnostics.find((d) => d.code === "LN003")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("LN003");
  });

  it("-s and -r together is not flagged", () => {
    expect(lint(spec({ flags: { symbolic: true, relative: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Symbolic link' is -s on POSIX", () => {
    expect(line(getPreset("symbolic-link")!.apply(spec()))).toBe("ln -s target.txt link.txt");
  });

  it("'Hard link' is bare ln on POSIX", () => {
    expect(line(getPreset("hard-link")!.apply(spec()))).toBe("ln target.txt link.txt");
  });

  it("'Force-replace an existing link' is -sf on POSIX", () => {
    expect(line(getPreset("force-replace")!.apply(spec()))).toBe("ln -s -f target.txt link.txt");
  });

  it("'Force-replace an existing link' is not applicable on cmd.exe", () => {
    const cmd = spec({ platform: "windows-cmd" });
    expect(getPreset("force-replace")!.isApplicable?.(cmd)).toBe(false);
    expect(line(getPreset("force-replace")!.apply(cmd))).toBe(line(cmd));
  });
});

describe("describeSpec (POSIX)", () => {
  it("describes the default hard link", () => {
    expect(describeSpec(spec())).toBe("Create b.txt as a hard link pointing to a.txt.");
  });

  it("describes a symbolic link with extras", () => {
    expect(describeSpec(spec({ flags: { symbolic: true, force: true } }))).toBe(
      "Create b.txt as a symbolic link pointing to a.txt, removing any existing file at that name first.",
    );
  });
});

describe("cmd.exe (mklink) — link name then target, the reverse of POSIX", () => {
  const cmd = (partial: Partial<LnSpec> = {}): LnSpec => spec({ platform: "windows-cmd", ...partial });

  it("a file symlink (default, no mode flag)", () => {
    expect(line(cmd())).toBe("mklink b.txt a.txt");
  });

  it("a directory symlink is /D", () => {
    expect(line(cmd({ winKind: "dir-symlink" }))).toBe("mklink /D b.txt a.txt");
  });

  it("a hard link is /H", () => {
    expect(line(cmd({ winKind: "hard-link" }))).toBe("mklink /H b.txt a.txt");
  });

  it("a junction is /J", () => {
    expect(line(cmd({ winKind: "junction" }))).toBe("mklink /J b.txt a.txt");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ flags: { symbolic: true, force: true } }))).toBe("mklink b.txt a.txt");
  });

  it("converts forward slashes to backslashes — cmd.exe's mklink misreads embedded \"/\" as a switch attempt", () => {
    expect(line(cmd({ target: "dir/a.txt", linkName: "sub/b.txt" }))).toBe("mklink sub\\b.txt dir\\a.txt");
  });
});

describe("cygwin/msys/wsl (ln) — same real binary and flags as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<LnSpec> = {}): LnSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<LnSpec> = {}): LnSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<LnSpec> = {}): LnSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses ln (not mklink or New-Item) as the binary, target then link name — POSIX order, not mklink's reversed order", () => {
    expect(line(cygwin())).toBe("ln a.txt b.txt");
    expect(line(msys())).toBe("ln a.txt b.txt");
    expect(line(wsl())).toBe("ln a.txt b.txt");
  });

  it("renders -s, -f, -i, -v, -r, -T identically to linux/mac", () => {
    expect(line(cygwin({ flags: { symbolic: true } }))).toBe("ln -s a.txt b.txt");
    expect(line(msys({ flags: { symbolic: true, force: true } }))).toBe("ln -s -f a.txt b.txt");
    expect(line(wsl({ flags: { symbolic: true, force: true } }))).toBe("ln -s -f a.txt b.txt");
    expect(line(cygwin({ flags: { interactive: true } }))).toBe("ln -i a.txt b.txt");
    expect(line(msys({ flags: { verbose: true } }))).toBe("ln -v a.txt b.txt");
    expect(line(wsl({ flags: { verbose: true } }))).toBe("ln -v a.txt b.txt");
    expect(line(cygwin({ flags: { symbolic: true, relative: true } }))).toBe("ln -s -r a.txt b.txt");
    expect(line(msys({ flags: { noTargetDirectory: true } }))).toBe("ln -T a.txt b.txt");
    expect(line(wsl({ flags: { noTargetDirectory: true } }))).toBe("ln -T a.txt b.txt");
  });

  it("winKind is ignored — /D, /H, /J and -ItemType never appear, only the real POSIX flags matter", () => {
    expect(line(cygwin({ winKind: "dir-symlink" }))).toBe("ln a.txt b.txt");
    expect(line(cygwin({ winKind: "hard-link", flags: { symbolic: true } }))).toBe("ln -s a.txt b.txt");
    expect(line(msys({ winKind: "junction" }))).toBe("ln a.txt b.txt");
    expect(line(wsl({ winKind: "junction" }))).toBe("ln a.txt b.txt");
  });

  it("POSIX-only flags render the same way they already do on linux/mac (no dropping)", () => {
    expect(line(cygwin({ flags: { symbolic: true, force: true } }))).toBe("ln -s -f a.txt b.txt");
    expect(line(wsl({ flags: { symbolic: true, force: true } }))).toBe("ln -s -f a.txt b.txt");
  });

  it("a relative forward-slash path is left as-is — nothing to rewrite without a drive letter", () => {
    expect(line(cygwin({ target: "dir/a.txt", linkName: "sub/b.txt" }))).toBe("ln dir/a.txt sub/b.txt");
    expect(line(msys({ target: "dir/a.txt", linkName: "sub/b.txt" }))).toBe("ln dir/a.txt sub/b.txt");
    expect(line(wsl({ target: "dir/a.txt", linkName: "sub/b.txt" }))).toBe("ln dir/a.txt sub/b.txt");
  });

  it("converts a Windows-style absolute path to the dialect's own bash spelling, for both target and link name", () => {
    expect(line(cygwin({ target: "C:\\Users\\me\\a.txt" }))).toBe("ln /cygdrive/c/Users/me/a.txt b.txt");
    expect(line(msys({ target: "C:\\Users\\me\\a.txt" }))).toBe("ln /c/Users/me/a.txt b.txt");
    expect(line(wsl({ target: "C:\\Users\\me\\a.txt" }))).toBe("ln /mnt/c/Users/me/a.txt b.txt");
    expect(line(cygwin({ linkName: "C:\\Users\\me\\b.txt" }))).toBe("ln a.txt /cygdrive/c/Users/me/b.txt");
    expect(line(msys({ linkName: "C:\\Users\\me\\b.txt" }))).toBe("ln a.txt /c/Users/me/b.txt");
    expect(line(wsl({ linkName: "C:\\Users\\me\\b.txt" }))).toBe("ln a.txt /mnt/c/Users/me/b.txt");
  });

  it("'Force-replace an existing link' now applies — it's POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("force-replace")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("force-replace")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("force-replace")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("force-replace")!.apply(cygwin()))).toBe("ln -s -f target.txt link.txt");
    expect(line(getPreset("force-replace")!.apply(wsl()))).toBe("ln -s -f target.txt link.txt");
  });

  it("describeSpec matches the linux/mac POSIX wording, unaffected by winKind", () => {
    expect(describeSpec(cygwin({ flags: { symbolic: true, force: true } }))).toBe(
      "Create b.txt as a symbolic link pointing to a.txt, removing any existing file at that name first.",
    );
    expect(describeSpec(msys())).toBe("Create b.txt as a hard link pointing to a.txt.");
    expect(describeSpec(wsl())).toBe("Create b.txt as a hard link pointing to a.txt.");
  });
});

describe("PowerShell (New-Item) — -Path (link) then -Target", () => {
  const ps = (partial: Partial<LnSpec> = {}): LnSpec => spec({ platform: "windows-powershell", ...partial });

  it("SymbolicLink for both file- and dir-symlink kinds", () => {
    expect(line(ps({ winKind: "file-symlink" }))).toBe("New-Item -ItemType SymbolicLink -Path b.txt -Target a.txt");
    expect(line(ps({ winKind: "dir-symlink" }))).toBe("New-Item -ItemType SymbolicLink -Path b.txt -Target a.txt");
  });

  it("HardLink and Junction", () => {
    expect(line(ps({ winKind: "hard-link" }))).toBe("New-Item -ItemType HardLink -Path b.txt -Target a.txt");
    expect(line(ps({ winKind: "junction" }))).toBe("New-Item -ItemType Junction -Path b.txt -Target a.txt");
  });

  it("-Force renders at the end", () => {
    expect(line(ps({ flags: { forcePs: true } }))).toBe(
      "New-Item -ItemType SymbolicLink -Path b.txt -Target a.txt -Force",
    );
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(ps({ flags: { symbolic: true } }))).toBe("New-Item -ItemType SymbolicLink -Path b.txt -Target a.txt");
  });

  it("'Force-replace an existing link' is -Force on PowerShell", () => {
    expect(line(getPreset("force-replace")!.apply(ps()))).toBe(
      "New-Item -ItemType SymbolicLink -Path link.txt -Target target.txt -Force",
    );
  });
});
