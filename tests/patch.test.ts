import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PatchSpec } from "@cmdgen/patch";

const line = (spec: PatchSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PatchSpec> = {}): PatchSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("targetFile, patchFile, and flags", () => {
  it("a bare patch with neither file", () => {
    expect(line(spec())).toBe("patch");
  });

  it("target and patch file", () => {
    expect(line(spec({ targetFile: "app.c", patchFile: "changes.patch" }))).toBe("patch app.c changes.patch");
  });

  it("patch file alone (reads target from diff headers)", () => {
    expect(line(spec({ patchFile: "changes.patch" }))).toBe("patch changes.patch");
  });

  it("renders -p as a detached number value", () => {
    expect(line(spec({ patchFile: "changes.patch", flags: { strip: 1 } }))).toBe("patch -p 1 changes.patch");
  });

  it("renders -R, -b, --dry-run", () => {
    expect(line(spec({ patchFile: "changes.patch", flags: { reverse: true } }))).toBe("patch -R changes.patch");
    expect(line(spec({ patchFile: "changes.patch", flags: { backup: true } }))).toBe("patch -b changes.patch");
    expect(line(spec({ patchFile: "changes.patch", flags: { dryRun: true } }))).toBe("patch --dry-run changes.patch");
  });

  it("-i skips the positional patch file entirely", () => {
    expect(line(spec({ patchFile: "ignored.patch", flags: { input: "changes.patch" } }))).toBe(
      "patch -i changes.patch",
    );
  });

  it("trims whitespace from both files", () => {
    expect(line(spec({ targetFile: "  app.c  ", patchFile: "  changes.patch  " }))).toBe("patch app.c changes.patch");
  });
});

describe("lint", () => {
  it("PAT001 catches patchFile and -i together, and the fix clears patchFile", () => {
    const s = spec({ patchFile: "changes.patch", flags: { input: "other.patch" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("PAT001");
    const fix = result.diagnostics.find((d) => d.code === "PAT001")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("PAT001");
  });

  it("PAT002 warns when neither --dry-run nor --backup is set", () => {
    expect(lint(spec({ patchFile: "changes.patch" })).diagnostics.map((d) => d.code)).toContain("PAT002");
  });

  it("PAT002 is silenced by --dry-run", () => {
    expect(
      lint(spec({ patchFile: "changes.patch", flags: { dryRun: true } })).diagnostics.map((d) => d.code),
    ).not.toContain("PAT002");
  });

  it("PAT002 is silenced by --backup", () => {
    expect(
      lint(spec({ patchFile: "changes.patch", flags: { backup: true } })).diagnostics.map((d) => d.code),
    ).not.toContain("PAT002");
  });

  it("PAT002's fix adds --dry-run", () => {
    const s = spec({ patchFile: "changes.patch" });
    const result = lint(s);
    const fix = result.diagnostics.find((d) => d.code === "PAT002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("PAT002");
  });
});

describe("presets", () => {
  it("'Apply a patch file'", () => {
    expect(line(getPreset("apply-patch")!.apply(spec()))).toBe("patch changes.patch");
  });

  it("'Apply from stdin, with a backup'", () => {
    expect(line(getPreset("apply-from-stdin-with-backup")!.apply(spec()))).toBe("patch -b");
  });

  it("'Check a patch with --dry-run'", () => {
    expect(line(getPreset("dry-run-check")!.apply(spec()))).toBe("patch --dry-run changes.patch");
  });

  it("'Reverse (un-apply) a patch'", () => {
    expect(line(getPreset("reverse-a-patch")!.apply(spec()))).toBe("patch -R -b changes.patch");
  });

  it("'Strip one leading path component'", () => {
    expect(line(getPreset("strip-one-level")!.apply(spec()))).toBe("patch -p 1 changes.patch");
  });
});

describe("describeSpec", () => {
  it("describes applying a patch", () => {
    expect(describeSpec(spec({ targetFile: "app.c", patchFile: "changes.patch" }))).toBe(
      "Apply the patch from changes.patch to app.c.",
    );
  });

  it("describes reading from stdin when no patch file or -i is given", () => {
    expect(describeSpec(spec({ targetFile: "app.c" }))).toBe("Apply the patch from stdin to app.c.");
  });

  it("describes reversing", () => {
    expect(describeSpec(spec({ targetFile: "app.c", patchFile: "changes.patch", flags: { reverse: true } }))).toBe(
      "Un-apply the patch from changes.patch to app.c.",
    );
  });

  it("mentions strip, backup, and dry run as trailing clauses", () => {
    const description = describeSpec(
      spec({ targetFile: "app.c", patchFile: "changes.patch", flags: { strip: 1, backup: true, dryRun: true } }),
    );
    expect(description).toContain("stripping 1 leading path component");
    expect(description).toContain("keeping a backup of the original");
    expect(description).toContain("as a dry run only");
  });
});
