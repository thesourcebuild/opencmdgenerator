import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SortSpec } from "@cmdgen/sort";

const line = (spec: SortSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<SortSpec> = {}): SortSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["names.txt"],
  ...partial,
});

describe("POSIX (sort)", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("sort names.txt");
  });

  it("renders -n, -h, -r, -u, -f, -b, -R, -c", () => {
    expect(line(spec({ flags: { numeric: true } }))).toBe("sort -n names.txt");
    expect(line(spec({ flags: { humanNumeric: true } }))).toBe("sort -h names.txt");
    expect(line(spec({ flags: { reverse: true } }))).toBe("sort -r names.txt");
    expect(line(spec({ flags: { unique: true } }))).toBe("sort -u names.txt");
    expect(line(spec({ flags: { ignoreCase: true } }))).toBe("sort -f names.txt");
    expect(line(spec({ flags: { ignoreLeadingBlanks: true } }))).toBe("sort -b names.txt");
    expect(line(spec({ flags: { randomSort: true } }))).toBe("sort -R names.txt");
    expect(line(spec({ flags: { check: true } }))).toBe("sort -c names.txt");
  });

  it("renders identically on mac as on linux", () => {
    expect(line(spec({ platform: "mac", flags: { numeric: true, reverse: true } }))).toBe(
      "sort -n -r names.txt",
    );
    expect(line(spec({ platform: "mac" }))).toBe(line(spec({ platform: "linux" })));
  });
});

describe("lint", () => {
  it("SORT001 catches no files", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).toContain("SORT001");
  });

  it("SORT002 catches -n and -R together", () => {
    const s = spec({ flags: { numeric: true, randomSort: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("SORT002");
    const fix = result.diagnostics.find((d) => d.code === "SORT002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("SORT002");
  });

  it("a plain sort has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Sort alphabetically' is a bare sort", () => {
    expect(line(getPreset("sort-alphabetically")!.apply(spec()))).toBe("sort names.txt");
  });

  it("'Sort numerically' is -n, POSIX only", () => {
    expect(line(getPreset("sort-numerically")!.apply(spec()))).toBe("sort -n numbers.txt");
    expect(getPreset("sort-numerically")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });

  it("'Reverse sort' is -r on POSIX, /R on cmd.exe", () => {
    expect(line(getPreset("reverse-sort")!.apply(spec()))).toBe("sort -r names.txt");
    expect(line(getPreset("reverse-sort")!.apply(spec({ platform: "windows-cmd" })))).toBe("sort /R names.txt");
  });

  it("'Unique values only' is POSIX only", () => {
    expect(line(getPreset("unique-only")!.apply(spec()))).toBe("sort -u names.txt");
    expect(getPreset("unique-only")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes a plain sort", () => {
    expect(describeSpec(spec())).toBe("Sort the lines of names.txt lexically.");
  });

  it("describes -n -r -u together", () => {
    expect(describeSpec(spec({ flags: { numeric: true, reverse: true, unique: true } }))).toBe(
      "Sort the lines of names.txt numerically, in reverse order, keeping only the first of each set of equal lines.",
    );
  });

  it("describes -R", () => {
    expect(describeSpec(spec({ flags: { randomSort: true } }))).toBe("Shuffle the lines of names.txt into random order.");
  });

  it("describes -c", () => {
    expect(describeSpec(spec({ flags: { check: true } }))).toBe("Check whether names.txt is already sorted.");
  });
});

describe("cygwin/msys/wsl — same GNU sort binary and flags as linux/mac, only path spelling differs", () => {
  const cygwin = (partial: Partial<SortSpec> = {}): SortSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<SortSpec> = {}): SortSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<SortSpec> = {}): SortSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses sort as the binary", () => {
    expect(line(cygwin())).toBe("sort names.txt");
    expect(line(msys())).toBe("sort names.txt");
    expect(line(wsl())).toBe("sort names.txt");
  });

  it("renders -n, -r, -u identically to linux/mac", () => {
    expect(line(cygwin({ flags: { numeric: true } }))).toBe("sort -n names.txt");
    expect(line(msys({ flags: { numeric: true } }))).toBe("sort -n names.txt");
    expect(line(wsl({ flags: { numeric: true } }))).toBe("sort -n names.txt");
    expect(line(cygwin({ flags: { reverse: true } }))).toBe("sort -r names.txt");
    expect(line(msys({ flags: { reverse: true } }))).toBe("sort -r names.txt");
    expect(line(wsl({ flags: { reverse: true } }))).toBe("sort -r names.txt");
    expect(line(cygwin({ flags: { unique: true } }))).toBe("sort -u names.txt");
    expect(line(msys({ flags: { unique: true } }))).toBe("sort -u names.txt");
    expect(line(wsl({ flags: { unique: true } }))).toBe("sort -u names.txt");
  });

  it("drops the cmd-only /R flag, same as plain linux/mac", () => {
    expect(line(cygwin({ flags: { reverseCmd: true } }))).toBe("sort names.txt");
    expect(line(msys({ flags: { reverseCmd: true } }))).toBe("sort names.txt");
    expect(line(wsl({ flags: { reverseCmd: true } }))).toBe("sort names.txt");
  });

  it("converts a Windows-style path to bash spelling", () => {
    expect(line(cygwin({ files: ["C:\\Users\\me\\names.txt"] }))).toBe(
      "sort /cygdrive/c/Users/me/names.txt",
    );
    expect(line(msys({ files: ["C:\\Users\\me\\names.txt"] }))).toBe("sort /c/Users/me/names.txt");
    expect(line(wsl({ files: ["C:\\Users\\me\\names.txt"] }))).toBe("sort /mnt/c/Users/me/names.txt");
  });

  it("'Reverse sort' preset renders -r (the POSIX flag), not /R, under cygwin, msys, and wsl", () => {
    expect(line(getPreset("reverse-sort")!.apply(cygwin()))).toBe("sort -r names.txt");
    expect(line(getPreset("reverse-sort")!.apply(msys()))).toBe("sort -r names.txt");
    expect(line(getPreset("reverse-sort")!.apply(wsl()))).toBe("sort -r names.txt");
  });

  it("'Sort numerically' and 'Unique values only' are applicable under cygwin, msys, and wsl", () => {
    expect(getPreset("sort-numerically")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("sort-numerically")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("sort-numerically")!.isApplicable?.(wsl())).toBe(true);
    expect(getPreset("unique-only")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("unique-only")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("unique-only")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("sort-numerically")!.apply(cygwin()))).toBe("sort -n numbers.txt");
    expect(line(getPreset("sort-numerically")!.apply(msys()))).toBe("sort -n numbers.txt");
    expect(line(getPreset("sort-numerically")!.apply(wsl()))).toBe("sort -n numbers.txt");
    expect(line(getPreset("unique-only")!.apply(cygwin()))).toBe("sort -u names.txt");
    expect(line(getPreset("unique-only")!.apply(msys()))).toBe("sort -u names.txt");
    expect(line(getPreset("unique-only")!.apply(wsl()))).toBe("sort -u names.txt");
  });
});

describe("cmd.exe (sort)", () => {
  const cmd = (partial: Partial<SortSpec> = {}): SortSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses sort as the binary", () => {
    expect(line(cmd())).toBe("sort names.txt");
  });

  it("renders /R", () => {
    expect(line(cmd({ flags: { reverseCmd: true } }))).toBe("sort /R names.txt");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ flags: { numeric: true, unique: true } }))).toBe("sort names.txt");
  });
});
