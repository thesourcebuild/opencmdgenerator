import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type GroupaddSpec } from "@cmdgen/groupadd";

const line = (spec: GroupaddSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<GroupaddSpec> = {}): GroupaddSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("groupname and flags", () => {
  it("a bare groupname with no flags", () => {
    expect(line(spec({ groupname: "developers" }))).toBe("groupadd developers");
  });

  it("renders -g as a detached short-form text value", () => {
    expect(line(spec({ groupname: "developers", flags: { gid: "5000" } }))).toBe("groupadd -g 5000 developers");
  });

  it("renders -r as a boolean flag", () => {
    expect(line(spec({ groupname: "docker", flags: { system: true } }))).toBe("groupadd -r docker");
  });

  it("renders -f as a boolean flag", () => {
    expect(line(spec({ groupname: "developers", flags: { force: true } }))).toBe("groupadd -f developers");
  });

  it("renders -K as a detached short-form text value", () => {
    expect(line(spec({ groupname: "developers", flags: { key: "GID_MIN=5000" } }))).toBe(
      "groupadd -K GID_MIN=5000 developers",
    );
  });

  it("combines multiple flags with the groupname last, in catalogue order", () => {
    expect(line(spec({ groupname: "developers", flags: { force: true, gid: "5000" } }))).toBe(
      "groupadd -g 5000 -f developers",
    );
  });
});

describe("lint", () => {
  it("GRA001 catches no groupname", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("GRA001");
  });

  it("GRA001 also catches a whitespace-only groupname", () => {
    expect(lint(spec({ groupname: "   " })).diagnostics.map((d) => d.code)).toContain("GRA001");
  });

  it("GRA002 fires when -f and -g are both set", () => {
    expect(
      lint(spec({ groupname: "developers", flags: { force: true, gid: "5000" } })).diagnostics.map((d) => d.code),
    ).toContain("GRA002");
  });

  it("GRA002 does not fire with only -f or only -g", () => {
    expect(lint(spec({ groupname: "developers", flags: { force: true } })).diagnostics).toEqual([]);
    expect(lint(spec({ groupname: "developers", flags: { gid: "5000" } })).diagnostics).toEqual([]);
  });

  it("a plain groupadd has no diagnostics", () => {
    expect(lint(spec({ groupname: "developers" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Basic group' is a bare groupadd developers", () => {
    expect(line(getPreset("basic-group")!.apply(spec()))).toBe("groupadd developers");
  });

  it("'Group with a specific GID' is -g 5000 developers", () => {
    expect(line(getPreset("group-with-gid")!.apply(spec()))).toBe("groupadd -g 5000 developers");
  });

  it("'System group' is -r docker", () => {
    expect(line(getPreset("system-group")!.apply(spec()))).toBe("groupadd -r docker");
  });

  it("'Idempotent create' is -g 5000 -f developers", () => {
    expect(line(getPreset("idempotent-create")!.apply(spec()))).toBe("groupadd -g 5000 -f developers");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ groupname: "developers" }))).toBe("Create a new group named developers.");
  });

  it("describes an empty groupname with the SOME_GROUPNAME placeholder", () => {
    expect(describeSpec(spec())).toBe("Create a new group named SOME_GROUPNAME.");
  });

  it("describes -r, -g, -f, and -K as trailing clauses", () => {
    const described = describeSpec(
      spec({ groupname: "developers", flags: { system: true, gid: "5000", force: true, key: "GID_MIN=5000" } }),
    );
    expect(described).toContain("as a system group");
    expect(described).toContain("using GID 5000");
    expect(described).toContain("succeeding without error if it already exists");
    expect(described).toContain("overriding the login.defs setting GID_MIN=5000 for this invocation");
  });
});
