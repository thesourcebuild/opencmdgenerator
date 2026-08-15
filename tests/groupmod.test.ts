import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type GroupmodSpec } from "@cmdgen/groupmod";

const line = (spec: GroupmodSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<GroupmodSpec> = {}): GroupmodSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("groupname and flags", () => {
  it("a bare groupname with no flags", () => {
    expect(line(spec({ groupname: "developers" }))).toBe("groupmod developers");
  });

  it("renders -g as a detached short-form text value", () => {
    expect(line(spec({ groupname: "developers", flags: { gid: "5000" } }))).toBe("groupmod -g 5000 developers");
  });

  it("renders -n as a detached short-form text value", () => {
    expect(line(spec({ groupname: "developers", flags: { newName: "engineering" } }))).toBe(
      "groupmod -n engineering developers",
    );
  });

  it("renders -o as a boolean flag", () => {
    expect(line(spec({ groupname: "developers", flags: { gid: "5000", nonUnique: true } }))).toBe(
      "groupmod -g 5000 -o developers",
    );
  });

  it("combines multiple flags with the groupname last, in catalogue order", () => {
    expect(
      line(spec({ groupname: "developers", flags: { gid: "5000", newName: "engineering", nonUnique: true } })),
    ).toBe("groupmod -g 5000 -n engineering -o developers");
  });
});

describe("lint", () => {
  it("GRM001 catches no groupname", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("GRM001");
  });

  it("GRM001 also catches a whitespace-only groupname", () => {
    expect(lint(spec({ groupname: "   " })).diagnostics.map((d) => d.code)).toContain("GRM001");
  });

  it("GRM002 fires when -o is set without -g", () => {
    expect(lint(spec({ groupname: "developers", flags: { nonUnique: true } })).diagnostics.map((d) => d.code)).toContain(
      "GRM002",
    );
  });

  it("GRM002 does not fire when -o is combined with -g", () => {
    expect(
      lint(spec({ groupname: "developers", flags: { gid: "5000", nonUnique: true } })).diagnostics.map((d) => d.code),
    ).not.toContain("GRM002");
  });

  it("a plain groupmod has no diagnostics", () => {
    expect(lint(spec({ groupname: "developers" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Rename a group' is -n engineering developers", () => {
    expect(line(getPreset("rename-group")!.apply(spec()))).toBe("groupmod -n engineering developers");
  });

  it("'Change a group's GID' is -g 5000 developers", () => {
    expect(line(getPreset("change-gid")!.apply(spec()))).toBe("groupmod -g 5000 developers");
  });

  it("'Change GID, allowing duplicates' is -g 5000 -o developers", () => {
    expect(line(getPreset("change-gid-non-unique")!.apply(spec()))).toBe("groupmod -g 5000 -o developers");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ groupname: "developers" }))).toBe("Modify the developers group.");
  });

  it("describes an empty groupname with the SOME_GROUPNAME placeholder", () => {
    expect(describeSpec(spec())).toBe("Modify the SOME_GROUPNAME group.");
  });

  it("describes -g, -n, and -o as trailing clauses", () => {
    const described = describeSpec(
      spec({ groupname: "developers", flags: { gid: "5000", newName: "engineering", nonUnique: true } }),
    );
    expect(described).toContain("changing its GID to 5000");
    expect(described).toContain("renaming it to engineering");
    expect(described).toContain("allowing that GID to duplicate another group's");
  });
});
