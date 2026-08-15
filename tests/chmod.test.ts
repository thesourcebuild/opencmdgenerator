import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  emptyOctalMode,
  formatOctalMode,
  getPreset,
  lint,
  parseOctalMode,
  renderOneLine,
  type ChmodSpec,
} from "@cmdgen/chmod";

const line = (spec: ChmodSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ChmodSpec> = {}): ChmodSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("mode and files", () => {
  it("renders an octal mode before the file list", () => {
    expect(line(spec({ mode: "644", files: ["a.txt"] }))).toBe("chmod 644 a.txt");
  });

  it("renders a symbolic mode", () => {
    expect(line(spec({ mode: "a+x", files: ["script.sh"] }))).toBe("chmod a+x script.sh");
  });

  it("renders multiple files after the mode", () => {
    expect(line(spec({ mode: "644", files: ["a.txt", "b.txt", "c.txt"] }))).toBe("chmod 644 a.txt b.txt c.txt");
  });

  it("skips a blank mode entirely", () => {
    expect(line(spec({ mode: "", files: ["a.txt"] }))).toBe("chmod a.txt");
  });

  it("suppresses the mode positional when --reference is set, so it can't be misread as a file", () => {
    const s = spec({ mode: "644", files: ["a.txt"], flags: { reference: "b.txt" } });
    expect(line(s)).toBe("chmod --reference=b.txt a.txt");
    expect(line(s)).not.toContain("644");
  });
});

describe("flags", () => {
  it("renders -c, -v, -f", () => {
    expect(line(spec({ mode: "644", files: ["a"], flags: { changes: true } }))).toBe("chmod -c 644 a");
    expect(line(spec({ mode: "644", files: ["a"], flags: { verbose: true } }))).toBe("chmod -v 644 a");
    expect(line(spec({ mode: "644", files: ["a"], flags: { silent: true } }))).toBe("chmod -f 644 a");
  });

  it("renders --dereference and -h", () => {
    expect(line(spec({ mode: "644", files: ["a"], flags: { dereference: true } }))).toBe("chmod --dereference 644 a");
    expect(line(spec({ mode: "644", files: ["a"], flags: { noDereference: true } }))).toBe("chmod -h 644 a");
  });

  it("renders --preserve-root and -R", () => {
    expect(line(spec({ mode: "644", files: ["a"], flags: { preserveRoot: true } }))).toBe("chmod --preserve-root 644 a");
    expect(line(spec({ mode: "644", files: ["a"], flags: { recursive: true } }))).toBe("chmod -R 644 a");
  });

  it("renders -H/-L/-P as a mutually exclusive enum", () => {
    expect(line(spec({ mode: "644", files: ["a"], flags: { traversalMode: "H" } }))).toBe("chmod -H 644 a");
    expect(line(spec({ mode: "644", files: ["a"], flags: { traversalMode: "L" } }))).toBe("chmod -L 644 a");
    expect(line(spec({ mode: "644", files: ["a"], flags: { traversalMode: "P" } }))).toBe("chmod -P 644 a");
  });

  it("renders --reference=RFILE as one attached token", () => {
    const argv = buildArgv(spec({ files: ["a"], flags: { reference: "b" } }));
    expect(argv.args.map((a) => a.text)).toEqual(["--reference=b", "a"]);
  });
});

describe("lint", () => {
  it("CHMOD001 fires when there are no files", () => {
    expect(lint(spec({ mode: "644" })).diagnostics.map((d) => d.code)).toContain("CHMOD001");
    expect(lint(spec({ mode: "644", files: ["a"] })).diagnostics.map((d) => d.code)).not.toContain("CHMOD001");
  });

  it("CHMOD002 fires when neither mode nor --reference is given", () => {
    expect(lint(spec({ files: ["a"] })).diagnostics.map((d) => d.code)).toContain("CHMOD002");
    expect(lint(spec({ files: ["a"], mode: "644" })).diagnostics.map((d) => d.code)).not.toContain("CHMOD002");
    expect(
      lint(spec({ files: ["a"], flags: { reference: "b" } })).diagnostics.map((d) => d.code),
    ).not.toContain("CHMOD002");
  });

  it("CHMOD003 fires when both mode and --reference are given, and its fix clears the mode", () => {
    const s = spec({ files: ["a"], mode: "644", flags: { reference: "b" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CHMOD003");
    const fixed = result.diagnostics.find((d) => d.code === "CHMOD003")!.fix!.apply(s);
    expect(fixed.mode).toBe("");
  });

  it("CHMOD004 warns about --dereference or -L combined with --recursive", () => {
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { recursive: true, dereference: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("CHMOD004");
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { recursive: true, traversalMode: "L" } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("CHMOD004");
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { recursive: true, traversalMode: "H" } })).diagnostics.map(
        (d) => d.code,
      ),
    ).not.toContain("CHMOD004");
  });

  it("CHMOD005 notes -H/-L/-P only matter with --recursive", () => {
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { traversalMode: "H" } })).diagnostics.map((d) => d.code),
    ).toContain("CHMOD005");
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { traversalMode: "H", recursive: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).not.toContain("CHMOD005");
  });

  it("CHMOD006 notes --preserve-root has no effect without --recursive", () => {
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { preserveRoot: true } })).diagnostics.map((d) => d.code),
    ).toContain("CHMOD006");
    expect(
      lint(spec({ files: ["a"], mode: "644", flags: { preserveRoot: true, recursive: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).not.toContain("CHMOD006");
  });

  it("CHMOD007 flags --dereference and -h as contradictory", () => {
    expect(
      lint(
        spec({ files: ["a"], mode: "644", flags: { dereference: true, noDereference: true } }),
      ).diagnostics.map((d) => d.code),
    ).toContain("CHMOD007");
  });

  it("a clean spec has no diagnostics", () => {
    expect(lint(spec({ files: ["a"], mode: "644" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Make executable' matches its own commandExample", () => {
    const preset = getPreset("make-executable")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'Secure private file' matches its own commandExample", () => {
    const preset = getPreset("secure-private-file")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'World-readable' matches its own commandExample", () => {
    const preset = getPreset("world-readable")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'Standard directory permissions' matches its own commandExample", () => {
    const preset = getPreset("standard-directory")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'Recursive world-readable tree' matches its own commandExample", () => {
    const preset = getPreset("recursive-world-readable")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("'Copy permissions from another file' matches its own commandExample", () => {
    const preset = getPreset("copy-permissions")!;
    expect(line(preset.apply(spec()))).toBe(preset.commandExample);
  });

  it("picking presets in sequence never leaks flags from an unrelated, previously-picked preset", () => {
    let s = spec();
    s = getPreset("recursive-world-readable")!.apply(s);
    s = getPreset("world-readable")!.apply(s);
    expect(line(s)).toBe("chmod 644 document.txt");
    expect(s.flags.recursive).toBeUndefined();
  });
});

describe("describeSpec", () => {
  it("describes a plain mode change", () => {
    expect(describeSpec(spec({ mode: "644", files: ["a.txt"] }))).toBe("Change the permissions of a.txt to 644.");
  });

  it("describes copying permissions via --reference", () => {
    expect(describeSpec(spec({ files: ["a.txt"], flags: { reference: "b.txt" } }))).toBe(
      "Copy the permissions from b.txt onto a.txt.",
    );
  });

  it("mentions recursion and traversal mode", () => {
    const text = describeSpec(spec({ mode: "644", files: ["dir"], flags: { recursive: true, traversalMode: "H" } }));
    expect(text).toMatch(/recursively/);
    expect(text).toMatch(/traversing symlinks per -H/);
  });
});

describe("octal mode helpers", () => {
  it("round-trips a plain 3-digit mode", () => {
    const parsed = parseOctalMode("755")!;
    expect(parsed.owner).toEqual({ read: true, write: true, execute: true });
    expect(parsed.group).toEqual({ read: true, write: false, execute: true });
    expect(parsed.other).toEqual({ read: true, write: false, execute: true });
    expect(formatOctalMode(parsed)).toBe("755");
  });

  it("round-trips a 4-digit mode with setuid", () => {
    const parsed = parseOctalMode("4755")!;
    expect(parsed.setuid).toBe(true);
    expect(parsed.setgid).toBe(false);
    expect(parsed.sticky).toBe(false);
    expect(formatOctalMode(parsed)).toBe("4755");
  });

  it("omits the special digit entirely when no special bit is set", () => {
    expect(formatOctalMode(emptyOctalMode())).toBe("000");
  });

  it("returns undefined for a symbolic (non-octal) mode string", () => {
    expect(parseOctalMode("a+x")).toBeUndefined();
    expect(parseOctalMode("u=rwx,go=rx")).toBeUndefined();
    expect(parseOctalMode("")).toBeUndefined();
  });
});
