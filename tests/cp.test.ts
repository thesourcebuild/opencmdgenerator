import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CpSpec } from "@cmdgen/cp";

const line = (spec: CpSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<CpSpec> = {}): CpSpec => ({
  ...createSpec({ id: "test-spec" }),
  sources: ["a.txt"],
  destination: "b.txt",
  ...partial,
});

describe("POSIX (cp)", () => {
  it("a single source and destination", () => {
    expect(line(spec())).toBe("cp a.txt b.txt");
  });

  it("multiple sources, space-separated", () => {
    expect(line(spec({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("cp a.txt b.txt dest/");
  });

  it("renders -r, -a, -f, -i, -n, -l, -s, -p, -u, -v", () => {
    expect(line(spec({ flags: { recursive: true } }))).toBe("cp -r a.txt b.txt");
    expect(line(spec({ flags: { archive: true } }))).toBe("cp -a a.txt b.txt");
    expect(line(spec({ flags: { force: true } }))).toBe("cp -f a.txt b.txt");
    expect(line(spec({ flags: { interactive: true } }))).toBe("cp -i a.txt b.txt");
    expect(line(spec({ flags: { noClobber: true } }))).toBe("cp -n a.txt b.txt");
    expect(line(spec({ flags: { link: true } }))).toBe("cp -l a.txt b.txt");
    expect(line(spec({ flags: { symbolicLink: true } }))).toBe("cp -s a.txt b.txt");
    expect(line(spec({ flags: { preserve: true } }))).toBe("cp -p a.txt b.txt");
    expect(line(spec({ flags: { update: true } }))).toBe("cp -u a.txt b.txt");
    expect(line(spec({ flags: { verbose: true } }))).toBe("cp -v a.txt b.txt");
  });
});

describe("lint", () => {
  it("CP001 catches no sources", () => {
    expect(lint(spec({ sources: [] })).diagnostics.map((d) => d.code)).toContain("CP001");
  });

  it("CP002 catches no destination", () => {
    expect(lint(spec({ destination: "" })).diagnostics.map((d) => d.code)).toContain("CP002");
  });

  it("CP003 catches -i and -n together", () => {
    const s = spec({ flags: { interactive: true, noClobber: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CP003");
    const fix = result.diagnostics.find((d) => d.code === "CP003")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CP003");
  });

  it("CP004 catches multiple sources on cmd.exe — the concatenation trap", () => {
    const s = spec({ platform: "windows-cmd", sources: ["a.txt", "b.txt"] });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CP004");
  });

  it("CP004 does not fire for a single source on cmd.exe", () => {
    const s = spec({ platform: "windows-cmd", sources: ["a.txt"] });
    expect(lint(s).diagnostics.map((d) => d.code)).not.toContain("CP004");
  });

  it("CP004 does not fire for multiple sources on POSIX or PowerShell", () => {
    expect(lint(spec({ sources: ["a.txt", "b.txt"] })).diagnostics.map((d) => d.code)).not.toContain("CP004");
    expect(
      lint(spec({ platform: "windows-powershell", sources: ["a.txt", "b.txt"] })).diagnostics.map((d) => d.code),
    ).not.toContain("CP004");
  });

  it("CP006 notes --force has no effect with --no-clobber, and the fix removes --force", () => {
    const s = spec({ flags: { force: true, noClobber: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CP006");
    const fix = result.diagnostics.find((d) => d.code === "CP006")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CP006");
  });

  it("a plain copy has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Copy a file' is a single source/destination pair", () => {
    expect(line(getPreset("copy-file")!.apply(spec()))).toBe("cp a.txt b.txt");
  });

  it("'Copy a directory recursively' is -r on POSIX, -Recurse on PowerShell", () => {
    expect(line(getPreset("copy-directory-recursively")!.apply(spec()))).toBe("cp -r src/ dest/");
    expect(line(getPreset("copy-directory-recursively")!.apply(spec({ platform: "windows-powershell" })))).toBe(
      "Copy-Item -Path src/ -Destination dest/ -Recurse",
    );
  });

  it("'Copy a directory recursively' is not applicable on cmd.exe", () => {
    expect(getPreset("copy-directory-recursively")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });

  it("'Archive copy' is -a, POSIX only", () => {
    expect(line(getPreset("archive-copy")!.apply(spec()))).toBe("cp -a src/ dest/");
    expect(getPreset("archive-copy")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes a plain copy", () => {
    expect(describeSpec(spec())).toBe("Copy a.txt to b.txt on Linux.");
  });

  it("describes an archive copy without double-reporting recursive/preserve", () => {
    expect(describeSpec(spec({ flags: { archive: true } }))).toBe(
      "Copy a.txt to b.txt on Linux, preserving mode, ownership, timestamps, and copying recursively.",
    );
  });
});

describe("cmd.exe (copy) — deliberately does NOT comma-join multiple sources", () => {
  const cmd = (partial: Partial<CpSpec> = {}): CpSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses copy as the binary", () => {
    expect(line(cmd())).toBe("copy a.txt b.txt");
  });

  it("multiple sources render space-separated, not comma-joined like mv's move", () => {
    expect(line(cmd({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("copy a.txt b.txt dest\\");
  });

  it("renders /Y", () => {
    expect(line(cmd({ flags: { noPromptCmd: true } }))).toBe("copy /Y a.txt b.txt");
  });

  it("recursive is unavailable — silently dropped", () => {
    expect(line(cmd({ flags: { recursive: true } }))).toBe("copy a.txt b.txt");
  });

  it("converts forward slashes to backslashes — cmd.exe's copy misreads embedded \"/\" as a switch attempt", () => {
    // Real-world bug: a forward slash mid-argument (e.g. "dest/sub") makes cmd.exe's
    // legacy internal-command parser try to read "/s" as a switch, producing
    // "The syntax of the command is incorrect." instead of copying anything.
    expect(line(cmd({ sources: ["dir/a.txt"], destination: "dest/sub" }))).toBe("copy dir\\a.txt dest\\sub");
  });
});

describe("cygwin/msys/wsl (cp) — same real binary and flags as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<CpSpec> = {}): CpSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<CpSpec> = {}): CpSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<CpSpec> = {}): CpSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses cp (not copy or Copy-Item) as the binary", () => {
    expect(line(cygwin())).toBe("cp a.txt b.txt");
    expect(line(msys())).toBe("cp a.txt b.txt");
    expect(line(wsl())).toBe("cp a.txt b.txt");
  });

  it("multiple sources render space-separated, matching linux/mac, not comma-joined like PowerShell", () => {
    expect(line(cygwin({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("cp a.txt b.txt dest/");
    expect(line(msys({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("cp a.txt b.txt dest/");
    expect(line(wsl({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe("cp a.txt b.txt dest/");
  });

  it("renders -r and -a identically to linux/mac", () => {
    expect(line(cygwin({ flags: { recursive: true } }))).toBe("cp -r a.txt b.txt");
    expect(line(msys({ flags: { archive: true } }))).toBe("cp -a a.txt b.txt");
    expect(line(wsl({ flags: { archive: true } }))).toBe("cp -a a.txt b.txt");
  });

  it("CP004 does not fire for multiple sources on cygwin/msys/wsl — no concatenation trap there, unlike cmd.exe", () => {
    expect(
      lint(cygwin({ sources: ["a.txt", "b.txt"] })).diagnostics.map((d) => d.code),
    ).not.toContain("CP004");
    expect(
      lint(msys({ sources: ["a.txt", "b.txt"] })).diagnostics.map((d) => d.code),
    ).not.toContain("CP004");
    expect(
      lint(wsl({ sources: ["a.txt", "b.txt"] })).diagnostics.map((d) => d.code),
    ).not.toContain("CP004");
  });

  it("converts a Windows-style absolute path to the dialect's own bash spelling, for both source and destination", () => {
    expect(line(cygwin({ sources: ["C:\\Users\\me\\a.txt"], destination: "dest/" }))).toBe(
      "cp /cygdrive/c/Users/me/a.txt dest/",
    );
    expect(line(msys({ sources: ["C:\\Users\\me\\a.txt"], destination: "dest/" }))).toBe(
      "cp /c/Users/me/a.txt dest/",
    );
    expect(line(wsl({ sources: ["C:\\Users\\me\\a.txt"], destination: "dest/" }))).toBe(
      "cp /mnt/c/Users/me/a.txt dest/",
    );
  });

  it("'Copy a directory recursively' and 'Archive copy' are now applicable — they're POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("copy-directory-recursively")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("archive-copy")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("archive-copy")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("archive-copy")!.apply(cygwin()))).toBe("cp -a src/ dest/");
    expect(line(getPreset("archive-copy")!.apply(wsl()))).toBe("cp -a src/ dest/");
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin())).toBe("Copy a.txt to b.txt on Windows (Cygwin).");
    expect(describeSpec(msys())).toBe("Copy a.txt to b.txt on Windows (MSYS2).");
    expect(describeSpec(wsl())).toBe("Copy a.txt to b.txt on Windows (WSL).");
  });
});

describe("PowerShell (Copy-Item)", () => {
  const ps = (partial: Partial<CpSpec> = {}): CpSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses -Path and -Destination", () => {
    expect(line(ps())).toBe("Copy-Item -Path a.txt -Destination b.txt");
  });

  it("comma-joins multiple sources correctly, unlike cmd.exe", () => {
    expect(line(ps({ sources: ["a.txt", "b.txt"], destination: "dest/" }))).toBe(
      "Copy-Item -Path a.txt, b.txt -Destination dest/",
    );
  });

  it("-Recurse and -Force render at the end", () => {
    expect(line(ps({ flags: { recursivePs: true, forcePs: true } }))).toBe(
      "Copy-Item -Path a.txt -Destination b.txt -Recurse -Force",
    );
  });
});
