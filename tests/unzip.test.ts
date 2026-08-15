import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UnzipSpec } from "@cmdgen/unzip";

const line = (spec: UnzipSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UnzipSpec> = {}): UnzipSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("archiveName, files, and flags", () => {
  it("renders just the archive when there are no files or flags", () => {
    expect(line(spec({ archiveName: "backup.zip" }))).toBe("unzip backup.zip");
  });

  it("renders specific files after the archive, in order", () => {
    expect(line(spec({ archiveName: "backup.zip", files: ["a.txt", "b.txt"] }))).toBe(
      "unzip backup.zip a.txt b.txt",
    );
  });

  it("renders -l, -o, -q as boolean flags", () => {
    expect(line(spec({ archiveName: "backup.zip", flags: { list: true } }))).toBe("unzip -l backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { overwrite: true } }))).toBe("unzip -o backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { quiet: true } }))).toBe("unzip -q backup.zip");
  });

  it("renders every mode flag (-t, -v, -p, -f, -u, -z) as a boolean", () => {
    expect(line(spec({ archiveName: "backup.zip", flags: { test: true } }))).toBe("unzip -t backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { verboseList: true } }))).toBe("unzip -v backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { extractToPipe: true } }))).toBe("unzip -p backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { freshen: true } }))).toBe("unzip -f backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { update: true } }))).toBe("unzip -u backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { commentOnly: true } }))).toBe("unzip -z backup.zip");
  });

  it("renders the new option booleans (-n, -qq, -j, -C, -L)", () => {
    expect(line(spec({ archiveName: "backup.zip", flags: { neverOverwrite: true } }))).toBe("unzip -n backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { veryQuiet: true } }))).toBe("unzip -qq backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { junkPaths: true } }))).toBe("unzip -j backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { caseInsensitive: true } }))).toBe("unzip -C backup.zip");
    expect(line(spec({ archiveName: "backup.zip", flags: { lowercaseNames: true } }))).toBe("unzip -L backup.zip");
  });

  it("renders -d, -x, and -P as detached text values", () => {
    expect(line(spec({ archiveName: "backup.zip", flags: { directory: "output/" } }))).toBe(
      "unzip -d output/ backup.zip",
    );
    expect(line(spec({ archiveName: "backup.zip", flags: { exclude: "*.log" } }))).toBe(
      "unzip -x '*.log' backup.zip",
    );
    expect(line(spec({ archiveName: "backup.zip", flags: { password: "secret" } }))).toBe(
      "unzip -P secret backup.zip",
    );
  });

  it("renders flags before the archive and files", () => {
    expect(
      line(spec({ archiveName: "backup.zip", files: ["a.txt"], flags: { overwrite: true, directory: "output/" } })),
    ).toBe("unzip -o -d output/ backup.zip a.txt");
  });

  it("trims whitespace from archiveName and skips blank entries in files", () => {
    expect(line(spec({ archiveName: "  backup.zip  ", files: ["  a.txt  ", "  ", ""] }))).toBe(
      "unzip backup.zip a.txt",
    );
  });
});

describe("lint", () => {
  it("UNZIP001 catches an empty archiveName", () => {
    const s = spec({ archiveName: "" });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("UNZIP001");
  });

  it("UNZIP001 catches a whitespace-only archiveName", () => {
    const s = spec({ archiveName: "   " });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("UNZIP001");
  });

  it("UNZIP002 catches -l with -t, with a working fix", () => {
    const s = spec({ archiveName: "backup.zip", flags: { list: true, test: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("UNZIP002");
    const diag = result.diagnostics.find((d) => d.code === "UNZIP002")!;
    expect(diag.level).toBe("error");
    const fix = diag.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("UNZIP002");
  });

  it("-l and -o do NOT conflict — real unzip just ignores -o in list mode rather than erroring", () => {
    expect(lint(spec({ archiveName: "backup.zip", flags: { list: true, overwrite: true } })).diagnostics).toEqual([]);
  });

  it("UNZIP002 catches any two mode flags together, not just -l/-o", () => {
    const pairs: [string, string][] = [
      ["test", "verboseList"],
      ["extractToPipe", "freshen"],
      ["update", "commentOnly"],
      ["list", "update"],
    ];
    for (const [a, b] of pairs) {
      const s = spec({ archiveName: "backup.zip", flags: { [a]: true, [b]: true } });
      expect(lint(s).diagnostics.map((d) => d.code), `${a} + ${b}`).toContain("UNZIP002");
    }
  });

  it("UNZIP002 catches -o with -n (overwrite vs never-overwrite)", () => {
    const s = spec({ archiveName: "backup.zip", flags: { overwrite: true, neverOverwrite: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("UNZIP002");
  });

  it("UNZIP002 catches -q with -qq (quiet vs quieter)", () => {
    const s = spec({ archiveName: "backup.zip", flags: { quiet: true, veryQuiet: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("UNZIP002");
  });

  it("a valid archiveName with no conflicting flags has no diagnostics", () => {
    expect(lint(spec({ archiveName: "backup.zip", flags: { list: true } })).diagnostics).toEqual([]);
  });

  it("unrelated new flags (-j, -C, -L, -P) don't conflict with anything", () => {
    expect(
      lint(
        spec({
          archiveName: "backup.zip",
          flags: { junkPaths: true, caseInsensitive: true, lowercaseNames: true, password: "secret" },
        }),
      ).diagnostics,
    ).toEqual([]);
  });

  it("empty files has no diagnostics — extracting everything is valid, not an error", () => {
    expect(lint(spec({ archiveName: "backup.zip", files: [] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Extract everything' is a bare unzip of the archive", () => {
    expect(line(getPreset("extract-everything")!.apply(spec()))).toBe("unzip backup.zip");
  });

  it("'List contents without extracting' is -l", () => {
    expect(line(getPreset("list-contents")!.apply(spec()))).toBe("unzip -l backup.zip");
  });

  it("'Extract to a specific directory' is -o -d output/", () => {
    expect(line(getPreset("extract-to-directory")!.apply(spec()))).toBe("unzip -o -d output/ backup.zip");
  });

  it("'Test archive integrity' is -t", () => {
    expect(line(getPreset("test-archive")!.apply(spec()))).toBe("unzip -t backup.zip");
  });

  it("'Update only out-of-date files' is -u", () => {
    expect(line(getPreset("update-existing")!.apply(spec()))).toBe("unzip -u backup.zip");
  });

  it("'Never overwrite existing files' is -n", () => {
    expect(line(getPreset("never-overwrite")!.apply(spec()))).toBe("unzip -n backup.zip");
  });
});

describe("describeSpec", () => {
  it("describes extracting everything by default", () => {
    expect(describeSpec(spec({ archiveName: "backup.zip" }))).toBe("Extract every entry from backup.zip.");
  });

  it("describes extracting specific files", () => {
    expect(describeSpec(spec({ archiveName: "backup.zip", files: ["a.txt", "b.txt"] }))).toBe(
      "Extract a.txt, b.txt from backup.zip.",
    );
  });

  it("uses a placeholder archive name when archiveName is empty", () => {
    expect(describeSpec(spec())).toBe("Extract every entry from SOME_ARCHIVE.zip.");
  });

  it("mentions list-only mode, overwrite, target directory, quiet, and exclusion pattern as trailing clauses", () => {
    const description = describeSpec(
      spec({
        archiveName: "backup.zip",
        flags: { overwrite: true, directory: "output/", quiet: true, exclude: "*.log" },
      }),
    );
    expect(description).toContain("overwriting existing files without prompting");
    expect(description).toContain("into output/");
    expect(description).toContain("suppressing most output");
    expect(description).toContain("excluding entries matching *.log");

    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { list: true } }))).toContain(
      "only listing the contents rather than extracting",
    );
  });

  it("mentions the new mode flags", () => {
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { test: true } }))).toContain(
      "only testing the archive's integrity rather than extracting",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { verboseList: true } }))).toContain(
      "listing the contents verbosely rather than extracting",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { extractToPipe: true } }))).toContain(
      "writing to stdout instead of to disk",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { freshen: true } }))).toContain(
      "only freshening files that already exist on disk",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { update: true } }))).toContain(
      "updating out-of-date files and creating any that are missing",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { commentOnly: true } }))).toContain(
      "only displaying the archive's comment",
    );
  });

  it("mentions the new option flags", () => {
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { neverOverwrite: true } }))).toContain(
      "never overwriting existing files",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { veryQuiet: true } }))).toContain(
      "suppressing nearly all output",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { junkPaths: true } }))).toContain(
      "junking paths, flattening every entry into one directory",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { caseInsensitive: true } }))).toContain(
      "matching names case-insensitively",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { lowercaseNames: true } }))).toContain(
      "lowercasing extracted filenames",
    );
    expect(describeSpec(spec({ archiveName: "backup.zip", flags: { password: "secret" } }))).toContain(
      "decrypting entries with the password secret",
    );
  });
});
