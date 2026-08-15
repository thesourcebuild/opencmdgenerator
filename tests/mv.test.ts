import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type MvSpec } from "@cmdgen/mv";

const line = (spec: MvSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<MvSpec> = {}): MvSpec => ({
  ...createSpec({ id: "test-spec" }),
  sources: ["a.txt"],
  destination: "b.txt",
  ...partial,
});

describe("POSIX (mv)", () => {
  it("a single source and destination", () => {
    expect(line(spec())).toBe("mv a.txt b.txt");
  });

  it("multiple sources, space-separated", () => {
    expect(line(spec({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("mv a.txt b.txt dest/");
  });

  it("renders -f, -i, -n, -u, -b, --strip-trailing-slashes, -v", () => {
    expect(line(spec({ flags: { force: true } }))).toBe("mv -f a.txt b.txt");
    expect(line(spec({ flags: { interactive: true } }))).toBe("mv -i a.txt b.txt");
    expect(line(spec({ flags: { noClobber: true } }))).toBe("mv -n a.txt b.txt");
    expect(line(spec({ flags: { update: true } }))).toBe("mv -u a.txt b.txt");
    expect(line(spec({ flags: { backup: true } }))).toBe("mv -b a.txt b.txt");
    expect(line(spec({ flags: { stripTrailingSlashes: true } }))).toBe("mv --strip-trailing-slashes a.txt b.txt");
    expect(line(spec({ flags: { verbose: true } }))).toBe("mv -v a.txt b.txt");
  });
});

describe("lint", () => {
  it("MV001 catches no sources", () => {
    expect(lint(spec({ sources: [] })).diagnostics.map((d) => d.code)).toContain("MV001");
  });

  it("MV002 catches no destination", () => {
    expect(lint(spec({ destination: "" })).diagnostics.map((d) => d.code)).toContain("MV002");
  });

  it("MV003 catches -f and -i together", () => {
    const s = spec({ flags: { force: true, interactive: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("MV003");
    const fix = result.diagnostics.find((d) => d.code === "MV003")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("MV003");
  });

  it("a plain move has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Rename' is a single source/destination pair", () => {
    expect(line(getPreset("rename")!.apply(spec()))).toBe("mv old-name.txt new-name.txt");
  });

  it("'Move into a directory' has multiple sources", () => {
    expect(line(getPreset("move-into-directory")!.apply(spec()))).toBe("mv a.txt b.txt dest/");
  });

  it("'Never overwrite' is -n on POSIX", () => {
    expect(line(getPreset("no-overwrite")!.apply(spec()))).toBe("mv -n a.txt dest/");
  });

  it("'Never overwrite' is not applicable on cmd.exe", () => {
    const cmd = spec({ platform: "windows-cmd" });
    expect(getPreset("no-overwrite")!.isApplicable?.(cmd)).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes a plain move", () => {
    expect(describeSpec(spec())).toBe("Move a.txt to b.txt on Linux.");
  });
});

describe("cmd.exe (move) — comma-joins multiple sources, per its documented syntax", () => {
  const cmd = (partial: Partial<MvSpec> = {}): MvSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses move as the binary, no comma for a single source", () => {
    expect(line(cmd())).toBe("move a.txt b.txt");
  });

  it("comma-joins multiple sources, space before the destination", () => {
    expect(line(cmd({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("move a.txt, b.txt dest\\");
  });

  it("renders /Y", () => {
    expect(line(cmd({ flags: { noPromptCmd: true } }))).toBe("move /Y a.txt b.txt");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ flags: { force: true, verbose: true } }))).toBe("move a.txt b.txt");
  });

  it("converts forward slashes to backslashes — cmd.exe's move misreads embedded \"/\" as a switch attempt", () => {
    // Real-world bug: a forward slash mid-argument (e.g. "dest/sub") makes cmd.exe's
    // legacy internal-command parser try to read "/s" as a switch, producing
    // "The syntax of the command is incorrect." instead of moving anything.
    expect(line(cmd({ destination: "dest/sub" }))).toBe("move a.txt dest\\sub");
    expect(line(cmd({ sources: ["dir/a.txt"], destination: "dest/" }))).toBe("move dir\\a.txt dest\\");
  });

  it("'Move into a directory' renders backslashes on cmd.exe, not the raw forward-slash preset value", () => {
    expect(line(getPreset("move-into-directory")!.apply(cmd()))).toBe("move a.txt, b.txt dest\\");
  });
});

describe("cygwin/msys/wsl (mv) — same real binary and flags as linux/mac, space-separated sources (not comma-joined)", () => {
  const cygwin = (partial: Partial<MvSpec> = {}): MvSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<MvSpec> = {}): MvSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<MvSpec> = {}): MvSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses mv (not move or Move-Item) as the binary", () => {
    expect(line(cygwin())).toBe("mv a.txt b.txt");
    expect(line(msys())).toBe("mv a.txt b.txt");
    expect(line(wsl())).toBe("mv a.txt b.txt");
  });

  it("multiple sources render space-separated, NOT comma-joined like windows-cmd/windows-powershell", () => {
    expect(line(cygwin({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("mv a.txt b.txt dest/");
    expect(line(msys({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("mv a.txt b.txt dest/");
    expect(line(wsl({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("mv a.txt b.txt dest/");
  });

  it("renders -n identically to linux/mac", () => {
    expect(line(cygwin({ flags: { noClobber: true } }))).toBe("mv -n a.txt b.txt");
    expect(line(msys({ flags: { noClobber: true } }))).toBe("mv -n a.txt b.txt");
    expect(line(wsl({ flags: { noClobber: true } }))).toBe("mv -n a.txt b.txt");
  });

  it("cmd.exe/PowerShell-only flags are silently dropped", () => {
    expect(line(cygwin({ flags: { noPromptCmd: true, forcePs: true } }))).toBe("mv a.txt b.txt");
    expect(line(wsl({ flags: { noPromptCmd: true, forcePs: true } }))).toBe("mv a.txt b.txt");
  });

  it("converts a Windows-style absolute path in sources to the dialect's own bash spelling", () => {
    expect(line(cygwin({ sources: ["C:\\Users\\me\\a.txt"], destination: "b.txt" }))).toBe(
      "mv /cygdrive/c/Users/me/a.txt b.txt",
    );
    expect(line(msys({ sources: ["C:\\Users\\me\\a.txt"], destination: "b.txt" }))).toBe(
      "mv /c/Users/me/a.txt b.txt",
    );
    expect(line(wsl({ sources: ["C:\\Users\\me\\a.txt"], destination: "b.txt" }))).toBe(
      "mv /mnt/c/Users/me/a.txt b.txt",
    );
  });

  it("converts a Windows-style absolute path in the destination too", () => {
    expect(line(cygwin({ sources: ["a.txt"], destination: "C:\\Users\\me\\a.txt" }))).toBe(
      "mv a.txt /cygdrive/c/Users/me/a.txt",
    );
    expect(line(msys({ sources: ["a.txt"], destination: "C:\\Users\\me\\a.txt" }))).toBe(
      "mv a.txt /c/Users/me/a.txt",
    );
    expect(line(wsl({ sources: ["a.txt"], destination: "C:\\Users\\me\\a.txt" }))).toBe(
      "mv a.txt /mnt/c/Users/me/a.txt",
    );
  });

  it("'Never overwrite' is applicable and applies -n — it's POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("no-overwrite")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("no-overwrite")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("no-overwrite")!.apply(cygwin()))).toBe("mv -n a.txt dest/");
    expect(line(getPreset("no-overwrite")!.apply(wsl()))).toBe("mv -n a.txt dest/");
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin())).toBe("Move a.txt to b.txt on Windows (Cygwin).");
    expect(describeSpec(msys())).toBe("Move a.txt to b.txt on Windows (MSYS2).");
    expect(describeSpec(wsl())).toBe("Move a.txt to b.txt on Windows (WSL).");
  });
});

describe("PowerShell (Move-Item)", () => {
  const ps = (partial: Partial<MvSpec> = {}): MvSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses -Path and -Destination", () => {
    expect(line(ps())).toBe("Move-Item -Path a.txt -Destination b.txt");
  });

  it("comma-joins multiple sources under -Path only", () => {
    expect(line(ps({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe(
      "Move-Item -Path a.txt, b.txt -Destination dest/",
    );
  });

  it("-Force renders at the end", () => {
    expect(line(ps({ flags: { forcePs: true } }))).toBe("Move-Item -Path a.txt -Destination b.txt -Force");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(ps({ flags: { force: true } }))).toBe("Move-Item -Path a.txt -Destination b.txt");
  });
});
