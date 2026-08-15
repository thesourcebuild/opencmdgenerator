import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type DiffSpec } from "@cmdgen/diff";

const line = (spec: DiffSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<DiffSpec> = {}): DiffSpec => ({
  ...createSpec({ id: "test-spec" }),
  file1: "old.txt",
  file2: "new.txt",
  ...partial,
});

describe("POSIX (diff)", () => {
  it("a bare pair of files", () => {
    expect(line(spec())).toBe("diff old.txt new.txt");
  });

  it("renders -u, -c, -q, -r, -i, -w, -b, -B, -N", () => {
    expect(line(spec({ flags: { unified: true } }))).toBe("diff -u old.txt new.txt");
    expect(line(spec({ flags: { context: true } }))).toBe("diff -c old.txt new.txt");
    expect(line(spec({ flags: { brief: true } }))).toBe("diff -q old.txt new.txt");
    expect(line(spec({ flags: { recursive: true } }))).toBe("diff -r old.txt new.txt");
    expect(line(spec({ flags: { ignoreCase: true } }))).toBe("diff -i old.txt new.txt");
    expect(line(spec({ flags: { ignoreAllSpace: true } }))).toBe("diff -w old.txt new.txt");
    expect(line(spec({ flags: { ignoreSpaceChange: true } }))).toBe("diff -b old.txt new.txt");
    expect(line(spec({ flags: { ignoreBlankLines: true } }))).toBe("diff -B old.txt new.txt");
    expect(line(spec({ flags: { newFile: true } }))).toBe("diff -N old.txt new.txt");
  });

  it("renders identically on mac as on linux", () => {
    expect(line(spec({ platform: "mac", flags: { unified: true } }))).toBe("diff -u old.txt new.txt");
    expect(buildArgv(spec({ platform: "mac" })).binary).toBe("diff");
  });
});

describe("lint", () => {
  it("DIFF001 catches missing file1 and file2, separately", () => {
    expect(lint(spec({ file1: "" })).diagnostics.filter((d) => d.code === "DIFF001")).toHaveLength(1);
    expect(lint(spec({ file1: "", file2: "" })).diagnostics.filter((d) => d.code === "DIFF001")).toHaveLength(2);
  });

  it("DIFF002 catches -u and -c together", () => {
    const s = spec({ flags: { unified: true, context: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("DIFF002");
    const fix = result.diagnostics.find((d) => d.code === "DIFF002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("DIFF002");
  });

  it("a plain diff has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Unified diff' is -u, POSIX only", () => {
    expect(line(getPreset("unified-diff")!.apply(spec()))).toBe("diff -u old.txt new.txt");
    expect(getPreset("unified-diff")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });

  it("'Just check if they differ' is -q", () => {
    expect(line(getPreset("just-check")!.apply(spec()))).toBe("diff -q old.txt new.txt");
  });

  it("'Compare directories recursively' is -r", () => {
    expect(line(getPreset("compare-directories")!.apply(spec()))).toBe("diff -r dir1/ dir2/");
  });
});

describe("describeSpec", () => {
  it("describes a plain comparison", () => {
    expect(describeSpec(spec())).toBe("Compare old.txt and new.txt, showing differences in plain format.");
  });

  it("describes -q", () => {
    expect(describeSpec(spec({ flags: { brief: true } }))).toBe("Report only whether old.txt and new.txt differ.");
  });

  it("describes -u", () => {
    expect(describeSpec(spec({ flags: { unified: true } }))).toBe(
      "Compare old.txt and new.txt, showing differences in unified format.",
    );
  });
});

describe("cygwin/msys/wsl — same GNU diff binary and flags as posix, only path spelling differs", () => {
  it("renders -u, -q, -r the same as posix", () => {
    expect(line(spec({ platform: "windows-cygwin", flags: { unified: true } }))).toBe("diff -u old.txt new.txt");
    expect(line(spec({ platform: "windows-msys", flags: { unified: true } }))).toBe("diff -u old.txt new.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { unified: true } }))).toBe("diff -u old.txt new.txt");
    expect(line(spec({ platform: "windows-cygwin", flags: { brief: true } }))).toBe("diff -q old.txt new.txt");
    expect(line(spec({ platform: "windows-msys", flags: { brief: true } }))).toBe("diff -q old.txt new.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { brief: true } }))).toBe("diff -q old.txt new.txt");
    expect(line(spec({ platform: "windows-cygwin", flags: { recursive: true } }))).toBe("diff -r old.txt new.txt");
    expect(line(spec({ platform: "windows-msys", flags: { recursive: true } }))).toBe("diff -r old.txt new.txt");
    expect(line(spec({ platform: "windows-wsl", flags: { recursive: true } }))).toBe("diff -r old.txt new.txt");
  });

  it("cmd-only flags are silently dropped under cygwin/msys/wsl", () => {
    expect(
      line(
        spec({
          platform: "windows-cygwin",
          flags: { caseInsensitiveCmd: true, lineNumbersCmd: true, abbreviatedCmd: true, binaryCmd: true },
        }),
      ),
    ).toBe("diff old.txt new.txt");
    expect(
      line(
        spec({
          platform: "windows-msys",
          flags: { caseInsensitiveCmd: true, lineNumbersCmd: true, abbreviatedCmd: true, binaryCmd: true },
        }),
      ),
    ).toBe("diff old.txt new.txt");
    expect(
      line(
        spec({
          platform: "windows-wsl",
          flags: { caseInsensitiveCmd: true, lineNumbersCmd: true, abbreviatedCmd: true, binaryCmd: true },
        }),
      ),
    ).toBe("diff old.txt new.txt");
  });

  it("binary stays 'diff' (not 'fc') under cygwin/msys/wsl", () => {
    expect(buildArgv(spec({ platform: "windows-cygwin" })).binary).toBe("diff");
    expect(buildArgv(spec({ platform: "windows-msys" })).binary).toBe("diff");
    expect(buildArgv(spec({ platform: "windows-wsl" })).binary).toBe("diff");
  });

  it("converts Windows-style paths to the shell's own spelling", () => {
    expect(
      line(
        spec({
          platform: "windows-cygwin",
          file1: "C:\\Users\\me\\old.txt",
          file2: "C:\\Users\\me\\new.txt",
        }),
      ),
    ).toBe("diff /cygdrive/c/Users/me/old.txt /cygdrive/c/Users/me/new.txt");
    expect(
      line(
        spec({
          platform: "windows-msys",
          file1: "C:\\Users\\me\\old.txt",
          file2: "C:\\Users\\me\\new.txt",
        }),
      ),
    ).toBe("diff /c/Users/me/old.txt /c/Users/me/new.txt");
    expect(
      line(
        spec({
          platform: "windows-wsl",
          file1: "C:\\Users\\me\\old.txt",
          file2: "C:\\Users\\me\\new.txt",
        }),
      ),
    ).toBe("diff /mnt/c/Users/me/old.txt /mnt/c/Users/me/new.txt");
  });

  it("all three presets are applicable and render with the 'diff' binary under cygwin/msys/wsl", () => {
    for (const platform of ["windows-cygwin", "windows-msys", "windows-wsl"] as const) {
      for (const id of ["unified-diff", "just-check", "compare-directories"]) {
        const preset = getPreset(id)!;
        expect(preset.isApplicable?.(spec({ platform }))).toBe(true);
        expect(buildArgv(preset.apply(spec({ platform }))).binary).toBe("diff");
      }
    }

    expect(line(getPreset("unified-diff")!.apply(spec({ platform: "windows-cygwin" })))).toBe("diff -u old.txt new.txt");
    expect(line(getPreset("unified-diff")!.apply(spec({ platform: "windows-msys" })))).toBe("diff -u old.txt new.txt");
    expect(line(getPreset("unified-diff")!.apply(spec({ platform: "windows-wsl" })))).toBe("diff -u old.txt new.txt");
    expect(line(getPreset("just-check")!.apply(spec({ platform: "windows-cygwin" })))).toBe("diff -q old.txt new.txt");
    expect(line(getPreset("compare-directories")!.apply(spec({ platform: "windows-msys" })))).toBe(
      "diff -r dir1/ dir2/",
    );
    expect(line(getPreset("compare-directories")!.apply(spec({ platform: "windows-wsl" })))).toBe(
      "diff -r dir1/ dir2/",
    );
  });
});

describe("cmd.exe (fc)", () => {
  const cmd = (partial: Partial<DiffSpec> = {}): DiffSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses fc as the binary", () => {
    expect(line(cmd())).toBe("fc old.txt new.txt");
  });

  it("renders /C, /N, /A, /B", () => {
    expect(line(cmd({ flags: { caseInsensitiveCmd: true } }))).toBe("fc /C old.txt new.txt");
    expect(line(cmd({ flags: { binaryCmd: true } }))).toBe("fc /B old.txt new.txt");
  });

  it("POSIX-only flags are silently dropped", () => {
    expect(line(cmd({ flags: { unified: true, recursive: true } }))).toBe("fc old.txt new.txt");
  });
});
