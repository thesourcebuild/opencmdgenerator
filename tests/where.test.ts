import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WhereSpec } from "@cmdgen/where";

const line = (spec: WhereSpec) => renderOneLine(buildArgv(spec), { shell: spec.platform });

const spec = (partial: Partial<WhereSpec> = {}): WhereSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("patterns and flags", () => {
  it("a bare pattern with no flags, on cmd", () => {
    expect(line(spec({ patterns: ["notepad.exe"] }))).toBe("where notepad.exe");
  });

  it("renders as where.exe on the powershell platform — bypasses PowerShell's built-in where alias", () => {
    expect(line(spec({ patterns: ["notepad.exe"], platform: "powershell" }))).toBe("where.exe notepad.exe");
  });

  it("renders multiple patterns in order", () => {
    expect(line(spec({ patterns: ["notepad.exe", "git.exe", "node.exe"] }))).toBe("where notepad.exe git.exe node.exe");
  });

  it("renders /Q, /F, /T as boolean flags", () => {
    expect(line(spec({ patterns: ["git.exe"], flags: { quiet: true } }))).toBe("where /Q git.exe");
    expect(line(spec({ patterns: ["git.exe"], flags: { quotedFilenames: true } }))).toBe("where /F git.exe");
    expect(line(spec({ patterns: ["git.exe"], flags: { showDetails: true } }))).toBe("where /T git.exe");
  });

  it("renders /R as a detached text value, before the pattern", () => {
    // "*.exe" is quoted by the shared cmd quoter — same conservative
    // wildcard-quoting precedent as @cmdgen/unzip's "*.log" exclude pattern.
    // Harmless in practice: where.exe receives the de-quoted text either way.
    expect(line(spec({ patterns: ["*.exe"], flags: { recursive: "C:\\" } }))).toBe('where /R C:\\ "*.exe"');
  });

  it("combines flags with patterns last", () => {
    expect(line(spec({ patterns: ["git.exe"], flags: { recursive: "C:\\", quiet: true } }))).toBe(
      "where /R C:\\ /Q git.exe",
    );
  });

  it("renders just the binary with no patterns", () => {
    expect(line(spec({ patterns: [] }))).toBe("where");
  });

  it("trims whitespace and skips blank entries", () => {
    expect(line(spec({ patterns: ["  notepad.exe  ", "  ", "git.exe"] }))).toBe("where notepad.exe git.exe");
  });
});

describe("lint", () => {
  it("WHR001 catches no search patterns", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("WHR001");
  });

  it("WHR001 also catches whitespace-only patterns", () => {
    expect(lint(spec({ patterns: ["   "] })).diagnostics.map((d) => d.code)).toContain("WHR001");
  });

  it("a plain where has no diagnostics", () => {
    expect(lint(spec({ patterns: ["git.exe"] })).diagnostics).toEqual([]);
  });

  it("WHR002 flags /Q with /F as redundant, with a working fix", () => {
    const s = spec({ patterns: ["git.exe"], flags: { quiet: true, quotedFilenames: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("WHR002");
    const diag = result.diagnostics.find((d) => d.code === "WHR002")!;
    expect(diag.level).toBe("info");
    const fix = diag.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("WHR002");
  });

  it("WHR002 flags /Q with /T as redundant", () => {
    const s = spec({ patterns: ["git.exe"], flags: { quiet: true, showDetails: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("WHR002");
  });

  it("WHR002 does not fire without /Q", () => {
    expect(
      lint(spec({ patterns: ["git.exe"], flags: { quotedFilenames: true, showDetails: true } })).diagnostics,
    ).toEqual([]);
  });
});

describe("presets", () => {
  it("'Locate an executable' is a bare where", () => {
    expect(line(getPreset("locate-an-executable")!.apply(spec()))).toBe("where notepad.exe");
  });

  it("'Recursively search a directory' is /R C:\\", () => {
    expect(line(getPreset("recursive-search")!.apply(spec()))).toBe('where /R C:\\ "*.exe"');
  });

  it("'Silent existence check' is /Q", () => {
    expect(line(getPreset("silent-check")!.apply(spec()))).toBe("where /Q git.exe");
  });

  it("'Show size and last-modified time' is /T", () => {
    expect(line(getPreset("show-details")!.apply(spec()))).toBe("where /T git.exe");
  });

  it("'Check multiple patterns' looks up several names at once", () => {
    expect(line(getPreset("check-multiple")!.apply(spec()))).toBe("where notepad.exe git.exe node.exe");
  });
});

describe("describeSpec", () => {
  it("describes a single pattern", () => {
    expect(describeSpec(spec({ patterns: ["git.exe"] }))).toBe("Search for git.exe along PATH.");
  });

  it("describes an empty list with the SOME_PATTERN placeholder", () => {
    expect(describeSpec(spec())).toBe("Search for SOME_PATTERN along PATH.");
  });

  it("describes multiple patterns by count", () => {
    expect(describeSpec(spec({ patterns: ["git.exe", "node.exe", "npm.exe"] }))).toBe("Search for 3 patterns along PATH.");
  });

  it("mentions /R as a trailing clause", () => {
    expect(describeSpec(spec({ patterns: ["*.exe"], flags: { recursive: "C:\\" } }))).toBe(
      "Search for *.exe along PATH, recursively under C:\\.",
    );
  });

  it("mentions /F and /T when set", () => {
    expect(describeSpec(spec({ patterns: ["git.exe"], flags: { quotedFilenames: true } }))).toBe(
      "Search for git.exe along PATH, quoting each matched filename.",
    );
    expect(describeSpec(spec({ patterns: ["git.exe"], flags: { showDetails: true } }))).toBe(
      "Search for git.exe along PATH, showing file size and last-modified time for each match.",
    );
  });

  it("/Q takes priority over /F and /T in the description when both are set", () => {
    expect(
      describeSpec(spec({ patterns: ["git.exe"], flags: { quiet: true, quotedFilenames: true, showDetails: true } })),
    ).toBe("Search for git.exe along PATH, printing nothing and only setting the exit code.");
  });
});
