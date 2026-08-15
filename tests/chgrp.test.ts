import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ChgrpSpec } from "@cmdgen/chgrp";

const line = (spec: ChgrpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ChgrpSpec> = {}): ChgrpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("group and paths", () => {
  it("group and one file", () => {
    expect(line(spec({ group: "staff", paths: ["file.txt"] }))).toBe("chgrp staff file.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ group: "staff", paths: ["a.txt", "b.txt"] }))).toBe("chgrp staff a.txt b.txt");
  });

  it("renders -v and -R", () => {
    expect(line(spec({ group: "staff", paths: ["f"], flags: { verbose: true } }))).toBe("chgrp -v staff f");
    expect(line(spec({ group: "staff", paths: ["f"], flags: { recursive: true } }))).toBe("chgrp -R staff f");
  });

  it("--reference skips the group positional entirely", () => {
    expect(line(spec({ group: "staff", paths: ["f"], flags: { reference: "template" } }))).toBe(
      "chgrp --reference=template f",
    );
  });
});

describe("lint", () => {
  it("CGP001 catches no paths", () => {
    expect(lint(spec({ group: "staff" })).diagnostics.map((d) => d.code)).toContain("CGP001");
  });

  it("CGP002 catches no group and no --reference", () => {
    expect(lint(spec({ paths: ["f"] })).diagnostics.map((d) => d.code)).toContain("CGP002");
  });

  it("CGP003 catches group and --reference together, and the fix clears the group", () => {
    const s = spec({ paths: ["f"], group: "staff", flags: { reference: "template" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CGP003");
    const fix = result.diagnostics.find((d) => d.code === "CGP003")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CGP003");
  });

  it("a plain group change has no diagnostics", () => {
    expect(lint(spec({ group: "staff", paths: ["f"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Change group'", () => {
    expect(line(getPreset("change-group")!.apply(spec()))).toBe("chgrp staff file.txt");
  });

  it("'Recursive group change'", () => {
    expect(line(getPreset("recursive-group-change")!.apply(spec()))).toBe("chgrp -R staff dir");
  });

  it("'Verbose group change'", () => {
    expect(line(getPreset("verbose-group-change")!.apply(spec()))).toBe("chgrp -v staff file.txt");
  });

  it("'Copy group from another file'", () => {
    expect(line(getPreset("copy-group")!.apply(spec()))).toBe("chgrp --reference=template.conf target.conf");
  });
});

describe("describeSpec", () => {
  it("describes a plain group change", () => {
    expect(describeSpec(spec({ group: "staff", paths: ["f"] }))).toBe("Change the group of f to staff.");
  });

  it("describes --reference", () => {
    expect(describeSpec(spec({ paths: ["f"], flags: { reference: "template" } }))).toBe(
      "Copy the group from template onto f.",
    );
  });
});
