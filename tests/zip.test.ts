import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ZipSpec } from "@cmdgen/zip";

const line = (spec: ZipSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ZipSpec> = {}): ZipSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("archiveName, files, and flags", () => {
  it("a bare zip with no archive name and no files renders just the binary", () => {
    expect(line(spec())).toBe("zip");
  });

  it("renders the archive name alone", () => {
    expect(line(spec({ archiveName: "backup.zip" }))).toBe("zip backup.zip");
  });

  it("renders files alone when the archive name is empty", () => {
    expect(line(spec({ files: ["project/"] }))).toBe("zip project/");
  });

  it("renders the archive name followed by every file, in order", () => {
    expect(line(spec({ archiveName: "backup.zip", files: ["project/", "notes.txt"] }))).toBe(
      "zip backup.zip project/ notes.txt",
    );
  });

  it("renders -9, -0, -q, -v as bare boolean flags", () => {
    expect(line(spec({ flags: { bestCompression: true } }))).toBe("zip -9");
    expect(line(spec({ flags: { noCompression: true } }))).toBe("zip -0");
    expect(line(spec({ flags: { quiet: true } }))).toBe("zip -q");
    expect(line(spec({ flags: { verbose: true } }))).toBe("zip -v");
  });

  it("renders -x with its pattern as a separate token", () => {
    expect(line(spec({ archiveName: "backup.zip", files: ["project/"], flags: { exclude: "*.log" } }))).toBe(
      "zip -x '*.log' backup.zip project/",
    );
  });

  it("renders -e for encryption", () => {
    expect(line(spec({ archiveName: "backup.zip", files: ["project/"], flags: { encrypt: true } }))).toBe(
      "zip -e backup.zip project/",
    );
  });

  it("renders flags before the archive name and files, in catalogue order", () => {
    expect(
      line(spec({ archiveName: "backup.zip", files: ["project/"], flags: { recursive: true, bestCompression: true } })),
    ).toBe("zip -9 -r backup.zip project/");
  });
});

describe("lint", () => {
  it("ZIP001 catches an empty archive name", () => {
    const result = lint(spec({ files: ["project/"] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("ZIP001");
    const diag = result.diagnostics.find((d) => d.code === "ZIP001")!;
    expect(diag.level).toBe("error");
    expect(diag.field).toBe("archiveName");
  });

  it("ZIP002 catches an empty file list", () => {
    const result = lint(spec({ archiveName: "backup.zip" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("ZIP002");
    const diag = result.diagnostics.find((d) => d.code === "ZIP002")!;
    expect(diag.level).toBe("error");
    expect(diag.field).toBe("files");
  });

  it("ZIP003 catches -9 with -0, and its fix clears -0", () => {
    const s = spec({
      archiveName: "backup.zip",
      files: ["project/"],
      flags: { bestCompression: true, noCompression: true },
    });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("ZIP003");
    const diag = result.diagnostics.find((d) => d.code === "ZIP003")!;
    expect(diag.level).toBe("error");
    const fix = diag.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("ZIP003");
  });

  it("a valid archive name, file list, and non-conflicting flags has no diagnostics", () => {
    expect(lint(spec({ archiveName: "backup.zip", files: ["project/"], flags: { recursive: true } })).diagnostics).toEqual(
      [],
    );
  });
});

describe("presets", () => {
  it("'Archive a folder recursively' is -r", () => {
    expect(line(getPreset("archive-a-folder")!.apply(spec()))).toBe("zip -r backup.zip project/");
  });

  it("'Maximum compression' is -9 -r", () => {
    expect(line(getPreset("max-compression")!.apply(spec()))).toBe("zip -9 -r backup.zip project/");
  });

  it("'Exclude log files' is -r -x *.log", () => {
    expect(line(getPreset("exclude-logs")!.apply(spec()))).toBe("zip -r -x '*.log' backup.zip project/");
  });
});

describe("describeSpec", () => {
  it("describes the default case with an archive name and one file", () => {
    expect(describeSpec(spec({ archiveName: "backup.zip", files: ["project/"] }))).toBe(
      "Add project/ to backup.zip.",
    );
  });

  it("describes multiple files as a comma-joined list", () => {
    expect(describeSpec(spec({ archiveName: "backup.zip", files: ["project/", "notes.txt"] }))).toBe(
      "Add project/, notes.txt to backup.zip.",
    );
  });

  it("uses placeholders when the archive name and files are both empty", () => {
    expect(describeSpec(spec())).toBe("Add SOME_FILES to SOME_ARCHIVE.zip.");
  });

  it("mentions recursion, compression, exclusion, verbosity, and encryption as trailing clauses", () => {
    const base = { archiveName: "backup.zip", files: ["project/"] };
    expect(describeSpec(spec({ ...base, flags: { recursive: true } }))).toBe(
      "Add project/ to backup.zip, recursing into directories.",
    );
    expect(describeSpec(spec({ ...base, flags: { bestCompression: true } }))).toBe(
      "Add project/ to backup.zip, using maximum compression.",
    );
    expect(describeSpec(spec({ ...base, flags: { noCompression: true } }))).toBe(
      "Add project/ to backup.zip, storing with no compression.",
    );
    expect(describeSpec(spec({ ...base, flags: { exclude: "*.log" } }))).toBe(
      'Add project/ to backup.zip, excluding files matching "*.log".',
    );
    expect(describeSpec(spec({ ...base, flags: { quiet: true } }))).toBe(
      "Add project/ to backup.zip, suppressing most output.",
    );
    expect(describeSpec(spec({ ...base, flags: { verbose: true } }))).toBe(
      "Add project/ to backup.zip, printing detailed progress for each file added.",
    );
    expect(describeSpec(spec({ ...base, flags: { encrypt: true } }))).toBe(
      "Add project/ to backup.zip, encrypting archive entries with a password.",
    );
  });
});
