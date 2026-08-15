import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type YumSpec } from "@cmdgen/yum";

const line = (spec: YumSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<YumSpec> = {}): YumSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action, packages, and flags", () => {
  it("a bare yum with the default action and no packages renders just the action token", () => {
    expect(line(spec())).toBe("yum install");
  });

  it("renders install with packages", () => {
    expect(line(spec({ action: "install", packages: ["nginx"] }))).toBe("yum install nginx");
  });

  it("renders remove with packages", () => {
    expect(line(spec({ action: "remove", packages: ["nginx"] }))).toBe("yum remove nginx");
  });

  it("renders search with packages", () => {
    expect(line(spec({ action: "search", packages: ["nginx"] }))).toBe("yum search nginx");
  });

  it("renders update with no packages as a bare action token", () => {
    expect(line(spec({ action: "update", packages: [] }))).toBe("yum update");
  });

  it("renders update with packages, unlike apt's update", () => {
    expect(line(spec({ action: "update", packages: ["nginx"] }))).toBe("yum update nginx");
  });

  it("renders multiple packages in order", () => {
    expect(line(spec({ action: "install", packages: ["nginx", "vim"] }))).toBe("yum install nginx vim");
  });

  it("renders -y as a bare boolean flag", () => {
    expect(line(spec({ action: "install", packages: ["nginx"], flags: { assumeYes: true } }))).toBe(
      "yum install -y nginx",
    );
  });

  it("renders --enablerepo and --disablerepo as attached long-form text values", () => {
    expect(line(spec({ action: "install", packages: ["nginx"], flags: { enableRepo: "epel" } }))).toBe(
      "yum install --enablerepo=epel nginx",
    );
    expect(line(spec({ action: "remove", packages: ["nginx"], flags: { disableRepo: "updates" } }))).toBe(
      "yum remove --disablerepo=updates nginx",
    );
  });

  it("renders flags before packages, in catalogue order", () => {
    expect(
      line(
        spec({
          action: "install",
          packages: ["nginx"],
          flags: { assumeYes: true, enableRepo: "epel" },
        }),
      ),
    ).toBe("yum install -y --enablerepo=epel nginx");
  });
});

describe("lint", () => {
  it("YUM001 catches install with no packages", () => {
    const result = lint(spec({ action: "install", packages: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("YUM001");
    const diag = result.diagnostics.find((d) => d.code === "YUM001")!;
    expect(diag.level).toBe("error");
    expect(diag.field).toBe("packages");
    expect(diag.message).toBe("yum install needs at least one package name.");
  });

  it("YUM001 catches remove with no packages", () => {
    const result = lint(spec({ action: "remove", packages: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("YUM001");
  });

  it("YUM001 catches search with no packages", () => {
    const result = lint(spec({ action: "search", packages: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("YUM001");
  });

  it("YUM001 does not apply to update with no packages", () => {
    const result = lint(spec({ action: "update", packages: [] }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("YUM001");
  });

  it("install with a package has no diagnostics", () => {
    expect(lint(spec({ action: "install", packages: ["nginx"] })).diagnostics).toEqual([]);
  });

  it("update with a package has no diagnostics", () => {
    expect(lint(spec({ action: "update", packages: ["nginx"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Install a package' is install -y nginx", () => {
    expect(line(getPreset("install-a-package")!.apply(spec()))).toBe("yum install -y nginx");
  });

  it("'Update every package' is update with no packages", () => {
    expect(line(getPreset("update-everything")!.apply(spec()))).toBe("yum update");
  });

  it("'Remove a package' is remove nginx", () => {
    expect(line(getPreset("remove-a-package")!.apply(spec()))).toBe("yum remove nginx");
  });
});

describe("describeSpec", () => {
  it("describes install with a package", () => {
    expect(describeSpec(spec({ action: "install", packages: ["nginx"] }))).toBe("Install nginx.");
  });

  it("describes remove with a package", () => {
    expect(describeSpec(spec({ action: "remove", packages: ["nginx"] }))).toBe("Remove nginx.");
  });

  it("describes search with a package", () => {
    expect(describeSpec(spec({ action: "search", packages: ["nginx"] }))).toBe("Search for nginx.");
  });

  it("describes update with no packages as updating everything", () => {
    expect(describeSpec(spec({ action: "update", packages: [] }))).toBe("Update every installed package.");
  });

  it("describes update with packages as updating those packages", () => {
    expect(describeSpec(spec({ action: "update", packages: ["nginx", "vim"] }))).toBe("Update nginx, vim.");
  });

  it("uses a placeholder when install has no packages", () => {
    expect(describeSpec(spec({ action: "install", packages: [] }))).toBe("Install SOME_PACKAGE.");
  });

  it("mentions -y, --enablerepo, and --disablerepo as trailing clauses", () => {
    const base = { action: "install" as const, packages: ["nginx"] };
    expect(describeSpec(spec({ ...base, flags: { assumeYes: true } }))).toBe(
      "Install nginx, automatically answering yes to all prompts.",
    );
    expect(describeSpec(spec({ ...base, flags: { enableRepo: "epel" } }))).toBe(
      'Install nginx, enabling the "epel" repository for this run.',
    );
    expect(describeSpec(spec({ ...base, flags: { disableRepo: "updates" } }))).toBe(
      'Install nginx, disabling the "updates" repository for this run.',
    );
  });
});
