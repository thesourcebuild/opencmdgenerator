import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type AptSpec } from "@cmdgen/apt";

const line = (spec: AptSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<AptSpec> = {}): AptSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action, packages, and flags", () => {
  it("a bare install with no packages renders just the action", () => {
    expect(line(spec())).toBe("apt install");
  });

  it("renders update with no packages, even if packages has entries", () => {
    expect(line(spec({ action: "update", packages: ["nginx"] }))).toBe("apt update");
  });

  it("renders upgrade with no packages, even if packages has entries", () => {
    expect(line(spec({ action: "upgrade", packages: ["nginx"] }))).toBe("apt upgrade");
  });

  it("renders list with no packages, even if packages has entries", () => {
    expect(line(spec({ action: "list", packages: ["nginx"] }))).toBe("apt list");
  });

  it("renders install with a single package", () => {
    expect(line(spec({ action: "install", packages: ["nginx"] }))).toBe("apt install nginx");
  });

  it("renders remove with a single package", () => {
    expect(line(spec({ action: "remove", packages: ["nginx"] }))).toBe("apt remove nginx");
  });

  it("renders search with a single package", () => {
    expect(line(spec({ action: "search", packages: ["nginx"] }))).toBe("apt search nginx");
  });

  it("renders install with multiple packages, in order", () => {
    expect(line(spec({ action: "install", packages: ["nginx", "curl"] }))).toBe("apt install nginx curl");
  });

  it("skips blank package entries", () => {
    expect(line(spec({ action: "install", packages: ["", "nginx", "  "] }))).toBe("apt install nginx");
  });

  it("renders -y, --purge, -s, --fix-broken as bare boolean flags", () => {
    expect(line(spec({ flags: { assumeYes: true } }))).toBe("apt install -y");
    expect(line(spec({ action: "remove", packages: ["nginx"], flags: { purge: true } }))).toBe(
      "apt remove --purge nginx",
    );
    expect(line(spec({ flags: { simulate: true } }))).toBe("apt install -s");
    expect(line(spec({ flags: { fixBroken: true } }))).toBe("apt install --fix-broken");
  });

  it("renders flags between the action and the package names, in catalogue order", () => {
    expect(line(spec({ action: "install", packages: ["nginx"], flags: { assumeYes: true } }))).toBe(
      "apt install -y nginx",
    );
  });
});

describe("lint", () => {
  it("APT001 catches install with no packages", () => {
    const result = lint(spec({ action: "install" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("APT001");
    const diag = result.diagnostics.find((d) => d.code === "APT001")!;
    expect(diag.level).toBe("error");
    expect(diag.message).toBe("apt install needs at least one package name.");
    expect(diag.field).toBe("packages");
  });

  it("APT001 catches remove with no packages", () => {
    const result = lint(spec({ action: "remove" }));
    const diag = result.diagnostics.find((d) => d.code === "APT001")!;
    expect(diag.message).toBe("apt remove needs at least one package name.");
  });

  it("APT001 catches search with no packages", () => {
    const result = lint(spec({ action: "search" }));
    const diag = result.diagnostics.find((d) => d.code === "APT001")!;
    expect(diag.message).toBe("apt search needs at least one package name.");
  });

  it("APT001 does not fire for update, upgrade, or list with no packages", () => {
    expect(lint(spec({ action: "update" })).diagnostics.map((d) => d.code)).not.toContain("APT001");
    expect(lint(spec({ action: "upgrade" })).diagnostics.map((d) => d.code)).not.toContain("APT001");
    expect(lint(spec({ action: "list" })).diagnostics.map((d) => d.code)).not.toContain("APT001");
  });

  it("APT002 warns when --purge is set without the remove action", () => {
    const result = lint(spec({ action: "install", packages: ["nginx"], flags: { purge: true } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("APT002");
    const diag = result.diagnostics.find((d) => d.code === "APT002")!;
    expect(diag.level).toBe("warning");
    expect(diag.message).toBe("--purge only has an effect when removing a package.");
  });

  it("APT002 does not fire when --purge is set with the remove action", () => {
    const result = lint(spec({ action: "remove", packages: ["nginx"], flags: { purge: true } }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("APT002");
  });

  it("a valid install spec has no diagnostics", () => {
    expect(lint(spec({ action: "install", packages: ["nginx"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Refresh the package list' is apt update", () => {
    expect(line(getPreset("update-package-list")!.apply(spec()))).toBe("apt update");
  });

  it("'Install a package' is apt install -y nginx", () => {
    expect(line(getPreset("install-a-package")!.apply(spec()))).toBe("apt install -y nginx");
  });

  it("'Remove a package and its config' is apt remove --purge nginx", () => {
    expect(line(getPreset("remove-and-purge")!.apply(spec()))).toBe("apt remove --purge nginx");
  });
});

describe("describeSpec", () => {
  it("describes update", () => {
    expect(describeSpec(spec({ action: "update" }))).toBe(
      "Refresh the local package list from configured repositories.",
    );
  });

  it("describes upgrade", () => {
    expect(describeSpec(spec({ action: "upgrade" }))).toBe(
      "Upgrade every installed package to its latest available version.",
    );
  });

  it("describes list", () => {
    expect(describeSpec(spec({ action: "list" }))).toBe("List packages.");
  });

  it("describes install with a package", () => {
    expect(describeSpec(spec({ action: "install", packages: ["nginx"] }))).toBe("Install nginx.");
  });

  it("describes remove with multiple packages as a comma-joined list", () => {
    expect(describeSpec(spec({ action: "remove", packages: ["nginx", "curl"] }))).toBe("Remove nginx, curl.");
  });

  it("describes search with a package", () => {
    expect(describeSpec(spec({ action: "search", packages: ["nginx"] }))).toBe("Search for nginx.");
  });

  it("uses a placeholder when install/remove/search have no packages", () => {
    expect(describeSpec(spec({ action: "install" }))).toBe("Install SOME_PACKAGE.");
    expect(describeSpec(spec({ action: "remove" }))).toBe("Remove SOME_PACKAGE.");
    expect(describeSpec(spec({ action: "search" }))).toBe("Search for SOME_PACKAGE.");
  });

  it("mentions -y, --purge, -s, and --fix-broken as trailing clauses when set", () => {
    expect(describeSpec(spec({ action: "install", packages: ["nginx"], flags: { assumeYes: true } }))).toBe(
      "Install nginx, automatically answering yes to all prompts.",
    );
    expect(describeSpec(spec({ action: "remove", packages: ["nginx"], flags: { purge: true } }))).toBe(
      "Remove nginx, also removing configuration files.",
    );
    expect(describeSpec(spec({ action: "install", packages: ["nginx"], flags: { simulate: true } }))).toBe(
      "Install nginx, only simulating, without actually doing it.",
    );
    expect(describeSpec(spec({ action: "install", packages: ["nginx"], flags: { fixBroken: true } }))).toBe(
      "Install nginx, attempting to fix broken dependencies first.",
    );
  });
});
