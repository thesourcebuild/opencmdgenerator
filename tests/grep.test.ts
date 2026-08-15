import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type GrepSpec } from "@cmdgen/grep";

const line = (spec: GrepSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<GrepSpec> = {}): GrepSpec => ({
  ...createSpec({ id: "test-spec" }),
  pattern: "TODO",
  files: ["notes.txt"],
  ...partial,
});

describe("POSIX (grep)", () => {
  it("a bare pattern and file", () => {
    expect(line(spec())).toBe("grep TODO notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("grep TODO a.txt b.txt");
  });

  it("quotes a pattern with spaces/regex metacharacters", () => {
    expect(line(spec({ pattern: "foo bar" }))).toBe("grep 'foo bar' notes.txt");
  });

  it("renders -i, -v, -w, -x, -E, -F, -r, -c, -n, -l, -L, -o, -C", () => {
    expect(line(spec({ flags: { ignoreCase: true } }))).toBe("grep -i TODO notes.txt");
    expect(line(spec({ flags: { invertMatch: true } }))).toBe("grep -v TODO notes.txt");
    expect(line(spec({ flags: { wordRegexp: true } }))).toBe("grep -w TODO notes.txt");
    expect(line(spec({ flags: { lineRegexp: true } }))).toBe("grep -x TODO notes.txt");
    expect(line(spec({ flags: { extendedRegexp: true } }))).toBe("grep -E TODO notes.txt");
    expect(line(spec({ flags: { fixedStrings: true } }))).toBe("grep -F TODO notes.txt");
    expect(line(spec({ flags: { recursive: true } }))).toBe("grep -r TODO notes.txt");
    expect(line(spec({ flags: { count: true } }))).toBe("grep -c TODO notes.txt");
    expect(line(spec({ flags: { lineNumber: true } }))).toBe("grep -n TODO notes.txt");
    expect(line(spec({ flags: { filesWithMatches: true } }))).toBe("grep -l TODO notes.txt");
    expect(line(spec({ flags: { filesWithoutMatch: true } }))).toBe("grep -L TODO notes.txt");
    expect(line(spec({ flags: { onlyMatching: true } }))).toBe("grep -o TODO notes.txt");
    expect(line(spec({ flags: { context: 3 } }))).toBe("grep -C 3 TODO notes.txt");
  });
});

describe("lint", () => {
  it("GREP001 catches no pattern", () => {
    expect(lint(spec({ pattern: "" })).diagnostics.map((d) => d.code)).toContain("GREP001");
  });

  it("GREP002 catches -E and -F together, and -l and -L together", () => {
    expect(lint(spec({ flags: { extendedRegexp: true, fixedStrings: true } })).diagnostics.map((d) => d.code)).toContain(
      "GREP002",
    );
    expect(
      lint(spec({ flags: { filesWithMatches: true, filesWithoutMatch: true } })).diagnostics.map((d) => d.code),
    ).toContain("GREP002");
  });

  it("a plain search has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Search a file' is a bare grep", () => {
    expect(line(getPreset("search-file")!.apply(spec()))).toBe("grep TODO notes.txt");
  });

  it("'Case-insensitive search' is -i on POSIX, /I on cmd.exe", () => {
    expect(line(getPreset("case-insensitive")!.apply(spec()))).toBe("grep -i error log.txt");
    expect(line(getPreset("case-insensitive")!.apply(spec({ platform: "windows-cmd" })))).toBe(
      "findstr /I error log.txt",
    );
  });

  it("'Recursive search in a directory' is not applicable on PowerShell", () => {
    expect(getPreset("recursive-search")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });

  it("'Count matches' is POSIX only", () => {
    expect(line(getPreset("count-matches")!.apply(spec()))).toBe("grep -c TODO notes.txt");
    expect(getPreset("count-matches")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes a plain search", () => {
    expect(describeSpec(spec())).toBe('Search notes.txt for lines matching "TODO" on Linux.');
  });

  it("describes an inverted search", () => {
    expect(describeSpec(spec({ flags: { invertMatch: true } }))).toBe(
      'Search notes.txt for lines that do NOT match "TODO" on Linux.',
    );
  });
});

describe("cmd.exe (findstr)", () => {
  const cmd = (partial: Partial<GrepSpec> = {}): GrepSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses findstr as the binary", () => {
    expect(line(cmd())).toBe("findstr TODO notes.txt");
  });

  it("renders /I, /V, /R, /S, /N", () => {
    expect(line(cmd({ flags: { ignoreCaseCmd: true } }))).toBe("findstr /I TODO notes.txt");
    expect(line(cmd({ flags: { regexCmd: true, recursiveCmd: true } }))).toBe("findstr /R /S TODO notes.txt");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ flags: { ignoreCase: true, extendedRegexp: true } }))).toBe("findstr TODO notes.txt");
  });
});

describe("PowerShell (Select-String)", () => {
  const ps = (partial: Partial<GrepSpec> = {}): GrepSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses -Pattern and -Path", () => {
    expect(line(ps())).toBe("Select-String -Pattern TODO -Path notes.txt");
  });

  it("comma-joins multiple files", () => {
    expect(line(ps({ files: ["a.txt", "b.txt"] }))).toBe("Select-String -Pattern TODO -Path a.txt, b.txt");
  });

  it("renders -CaseSensitive, -NotMatch, -SimpleMatch, -Context at the end", () => {
    expect(line(ps({ flags: { caseSensitivePs: true, contextPs: 2 } }))).toBe(
      "Select-String -Pattern TODO -Path notes.txt -CaseSensitive -Context 2",
    );
  });
});

describe("cygwin/msys/wsl (grep) — same real GNU grep as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<GrepSpec> = {}): GrepSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<GrepSpec> = {}): GrepSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<GrepSpec> = {}): GrepSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses grep as the binary, not findstr or Select-String", () => {
    expect(line(cygwin())).toBe("grep TODO notes.txt");
    expect(line(msys())).toBe("grep TODO notes.txt");
    expect(line(wsl())).toBe("grep TODO notes.txt");
  });

  it("renders POSIX flags identically to linux/mac", () => {
    expect(line(cygwin({ flags: { ignoreCase: true } }))).toBe("grep -i TODO notes.txt");
    expect(line(msys({ flags: { recursive: true } }))).toBe("grep -r TODO notes.txt");
    expect(line(wsl({ flags: { context: 3 } }))).toBe("grep -C 3 TODO notes.txt");
    expect(line(cygwin({ flags: { extendedRegexp: true } }))).toBe("grep -E TODO notes.txt");
    expect(line(msys({ flags: { filesWithMatches: true } }))).toBe("grep -l TODO notes.txt");
  });

  it("drops cmd.exe/PowerShell-only flags entirely", () => {
    expect(
      line(cygwin({ flags: { ignoreCaseCmd: true, regexCmd: true, caseSensitivePs: true, contextPs: 2 } })),
    ).toBe("grep TODO notes.txt");
    expect(line(wsl({ flags: { recursiveCmd: true, notMatchPs: true } }))).toBe("grep TODO notes.txt");
  });

  it("translates a Windows-style file-path argument to the dialect's own bash spelling", () => {
    expect(line(cygwin({ files: ["C:\\Users\\me\\notes.txt"] }))).toBe(
      "grep TODO /cygdrive/c/Users/me/notes.txt",
    );
    expect(line(msys({ files: ["C:\\Users\\me\\notes.txt"] }))).toBe("grep TODO /c/Users/me/notes.txt");
    expect(line(wsl({ files: ["C:\\Users\\me\\notes.txt"] }))).toBe("grep TODO /mnt/c/Users/me/notes.txt");
  });

  it("still quotes a translated path that contains a space", () => {
    expect(line(cygwin({ files: ["C:\\Program Files\\notes.txt"] }))).toBe(
      "grep TODO '/cygdrive/c/Program Files/notes.txt'",
    );
    expect(line(wsl({ files: ["C:\\Program Files\\notes.txt"] }))).toBe(
      "grep TODO '/mnt/c/Program Files/notes.txt'",
    );
  });

  it("does NOT translate the search pattern, even when it looks like a Windows path", () => {
    expect(line(cygwin({ pattern: "C:\\Users\\me" }))).toBe("grep 'C:\\Users\\me' notes.txt");
    expect(line(msys({ pattern: "C:\\Users\\me" }))).toBe("grep 'C:\\Users\\me' notes.txt");
    expect(line(wsl({ pattern: "C:\\Users\\me" }))).toBe("grep 'C:\\Users\\me' notes.txt");
  });

  it("leaves a relative forward-slash file path untouched — nothing to rewrite without a drive letter", () => {
    expect(line(cygwin({ files: ["sub/dir/notes.txt"] }))).toBe("grep TODO sub/dir/notes.txt");
    expect(line(wsl({ files: ["sub/dir/notes.txt"] }))).toBe("grep TODO sub/dir/notes.txt");
  });

  it("describes the platform correctly", () => {
    expect(describeSpec(cygwin())).toBe('Search notes.txt for lines matching "TODO" on Windows (Cygwin).');
    expect(describeSpec(msys())).toBe('Search notes.txt for lines matching "TODO" on Windows (MSYS2).');
    expect(describeSpec(wsl())).toBe('Search notes.txt for lines matching "TODO" on Windows (WSL).');
  });

  it("'Case-insensitive search' applies -i, same as linux/mac", () => {
    expect(line(getPreset("case-insensitive")!.apply(cygwin()))).toBe("grep -i error log.txt");
    expect(line(getPreset("case-insensitive")!.apply(msys()))).toBe("grep -i error log.txt");
    expect(line(getPreset("case-insensitive")!.apply(wsl()))).toBe("grep -i error log.txt");
  });

  it("'Recursive search in a directory' is applicable and applies -r, same as linux/mac", () => {
    expect(getPreset("recursive-search")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("recursive-search")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("recursive-search")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("recursive-search")!.apply(msys()))).toBe("grep -r TODO src/");
  });

  it("'Count matches' is applicable and applies -c, same as linux/mac", () => {
    expect(getPreset("count-matches")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("count-matches")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("count-matches")!.apply(cygwin()))).toBe("grep -c TODO notes.txt");
  });
});
