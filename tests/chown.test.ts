import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ChownSpec } from "@cmdgen/chown";

const line = (spec: ChownSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ChownSpec> = {}): ChownSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("owner and files", () => {
  it("owner only", () => {
    expect(line(spec({ owner: "alice", files: ["file.txt"] }))).toBe("chown alice file.txt");
  });

  it("owner:group", () => {
    expect(line(spec({ owner: "alice:staff", files: ["file.txt"] }))).toBe("chown alice:staff file.txt");
  });

  it(":group only", () => {
    expect(line(spec({ owner: ":staff", files: ["file.txt"] }))).toBe("chown :staff file.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ owner: "alice", files: ["a.txt", "b.txt"] }))).toBe("chown alice a.txt b.txt");
  });

  it("renders -c, -v, -f, -R", () => {
    expect(line(spec({ owner: "alice", files: ["f"], flags: { changes: true } }))).toBe("chown -c alice f");
    expect(line(spec({ owner: "alice", files: ["f"], flags: { verbose: true } }))).toBe("chown -v alice f");
    expect(line(spec({ owner: "alice", files: ["f"], flags: { silent: true } }))).toBe("chown -f alice f");
    expect(line(spec({ owner: "alice", files: ["f"], flags: { recursive: true } }))).toBe("chown -R alice f");
  });

  it("--reference skips the owner positional entirely", () => {
    expect(line(spec({ owner: "alice", files: ["f"], flags: { reference: "template" } }))).toBe(
      "chown --reference=template f",
    );
  });

  it("--from is attached with =", () => {
    expect(line(spec({ owner: "alice", files: ["f"], flags: { from: "bob:staff" } }))).toBe(
      "chown --from=bob:staff alice f",
    );
  });
});

describe("lint", () => {
  it("CHOWN001 catches no files", () => {
    expect(lint(spec({ owner: "alice" })).diagnostics.map((d) => d.code)).toContain("CHOWN001");
  });

  it("CHOWN002 catches no owner and no --reference", () => {
    expect(lint(spec({ files: ["f"] })).diagnostics.map((d) => d.code)).toContain("CHOWN002");
  });

  it("CHOWN003 catches owner and --reference together, and the fix clears the owner", () => {
    const s = spec({ files: ["f"], owner: "alice", flags: { reference: "template" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CHOWN003");
    const fix = result.diagnostics.find((d) => d.code === "CHOWN003")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CHOWN003");
  });

  it("CHOWN004 warns about --dereference + --recursive", () => {
    const s = spec({ files: ["f"], owner: "alice", flags: { recursive: true, dereference: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CHOWN004");
  });

  it("CHOWN004 warns about -L + --recursive too", () => {
    const s = spec({ files: ["f"], owner: "alice", flags: { recursive: true, traversalMode: "L" } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CHOWN004");
  });

  it("CHOWN005 notes traversal mode without --recursive", () => {
    const s = spec({ files: ["f"], owner: "alice", flags: { traversalMode: "H" } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CHOWN005");
  });

  it("CHOWN006 notes --preserve-root without --recursive", () => {
    const s = spec({ files: ["f"], owner: "alice", flags: { preserveRoot: true } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CHOWN006");
  });

  it("CHOWN007 catches --dereference and --no-dereference together", () => {
    const s = spec({ files: ["f"], owner: "alice", flags: { dereference: true, noDereference: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CHOWN007");
    const fix = result.diagnostics.find((d) => d.code === "CHOWN007")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CHOWN007");
  });

  it("a plain ownership change has no diagnostics", () => {
    expect(lint(spec({ owner: "alice", files: ["f"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Change owner' sets owner only", () => {
    expect(line(getPreset("change-owner")!.apply(spec()))).toBe("chown alice file.txt");
  });

  it("'Change owner and group'", () => {
    expect(line(getPreset("change-owner-and-group")!.apply(spec()))).toBe("chown alice:staff file.txt");
  });

  it("'Change group only'", () => {
    expect(line(getPreset("change-group-only")!.apply(spec()))).toBe("chown :staff file.txt");
  });

  it("'Recursive ownership change'", () => {
    expect(line(getPreset("recursive-ownership-change")!.apply(spec()))).toBe("chown -R alice:staff dir");
  });

  it("'Copy ownership from another file'", () => {
    expect(line(getPreset("copy-ownership")!.apply(spec()))).toBe("chown --reference=template.conf target.conf");
  });
});

describe("describeSpec", () => {
  it("describes a plain ownership change", () => {
    expect(describeSpec(spec({ owner: "alice", files: ["f"] }))).toBe("Change the owner of f to alice.");
  });

  it("describes --reference", () => {
    expect(describeSpec(spec({ files: ["f"], flags: { reference: "template" } }))).toBe(
      "Copy the owner and group from template onto f.",
    );
  });
});
