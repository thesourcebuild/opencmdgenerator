import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type AptGetSpec } from "@cmdgen/apt-get";

const line = (spec: AptGetSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<AptGetSpec> = {}): AptGetSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action, packages, and flags", () => {
  it("a bare install with no packages renders just the action", () => {
    expect(line(spec())).toBe("apt-get install");
  });

  it("renders update/upgrade/autoremove with no packages, even if packages has entries", () => {
    expect(line(spec({ action: "update", packages: ["nginx"] }))).toBe("apt-get update");
    expect(line(spec({ action: "upgrade", packages: ["nginx"] }))).toBe("apt-get upgrade");
    expect(line(spec({ action: "autoremove", packages: ["nginx"] }))).toBe("apt-get autoremove");
  });

  it("renders install, remove, and purge with packages", () => {
    expect(line(spec({ action: "install", packages: ["nginx"] }))).toBe("apt-get install nginx");
    expect(line(spec({ action: "remove", packages: ["nginx"] }))).toBe("apt-get remove nginx");
    expect(line(spec({ action: "purge", packages: ["nginx"] }))).toBe("apt-get purge nginx");
  });

  it("renders multiple packages in order and skips blank entries", () => {
    expect(line(spec({ action: "install", packages: ["nginx", "curl"] }))).toBe("apt-get install nginx curl");
    expect(line(spec({ action: "install", packages: ["", "nginx", "  "] }))).toBe("apt-get install nginx");
  });

  it("renders -y/--yes, --purge, -s/--simulate, --fix-broken, --fix-missing, -d/--download-only, --allow-unauthenticated, -q/--quiet", () => {
    expect(line(spec({ flags: { assumeYes: true } }))).toBe("apt-get install -y");
    expect(line(spec({ action: "remove", packages: ["nginx"], flags: { purge: true } }))).toBe(
      "apt-get remove --purge nginx",
    );
    expect(line(spec({ flags: { simulate: true } }))).toBe("apt-get install -s");
    expect(line(spec({ flags: { fixBroken: true } }))).toBe("apt-get install --fix-broken");
    expect(line(spec({ flags: { fixMissing: true } }))).toBe("apt-get install --fix-missing");
    expect(line(spec({ flags: { downloadOnly: true } }))).toBe("apt-get install -d");
    expect(line(spec({ flags: { allowUnauthenticated: true } }))).toBe("apt-get install --allow-unauthenticated");
    expect(line(spec({ flags: { quiet: true } }))).toBe("apt-get install -q");
  });

  it("renders flags between the action and the package names, in catalogue order", () => {
    expect(line(spec({ action: "install", packages: ["nginx"], flags: { assumeYes: true } }))).toBe(
      "apt-get install -y nginx",
    );
  });
});

describe("lint", () => {
  it("APG001 catches install/remove/purge with no packages", () => {
    expect(lint(spec({ action: "install" })).diagnostics.map((d) => d.code)).toContain("APG001");
    expect(lint(spec({ action: "remove" })).diagnostics.map((d) => d.code)).toContain("APG001");
    expect(lint(spec({ action: "purge" })).diagnostics.map((d) => d.code)).toContain("APG001");
    const diag = lint(spec({ action: "purge" })).diagnostics.find((d) => d.code === "APG001")!;
    expect(diag.message).toBe("apt-get purge needs at least one package name.");
  });

  it("APG001 does not fire for update, upgrade, or autoremove with no packages", () => {
    expect(lint(spec({ action: "update" })).diagnostics.map((d) => d.code)).not.toContain("APG001");
    expect(lint(spec({ action: "upgrade" })).diagnostics.map((d) => d.code)).not.toContain("APG001");
    expect(lint(spec({ action: "autoremove" })).diagnostics.map((d) => d.code)).not.toContain("APG001");
  });

  it("APG002 warns when --purge is set without the remove action", () => {
    const result = lint(spec({ action: "install", packages: ["nginx"], flags: { purge: true } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("APG002");
    expect(
      lint(spec({ action: "remove", packages: ["nginx"], flags: { purge: true } })).diagnostics.map((d) => d.code),
    ).not.toContain("APG002");
  });

  it("APG003 warns about --allow-unauthenticated", () => {
    expect(
      lint(spec({ action: "install", packages: ["nginx"], flags: { allowUnauthenticated: true } })).diagnostics.map(
        (d) => d.code,
      ),
    ).toContain("APG003");
  });

  it("APG004 notes --purge is redundant with the purge action, and the fix clears it", () => {
    const s = spec({ action: "purge", packages: ["nginx"], flags: { purge: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("APG004");
    const fix = result.diagnostics.find((d) => d.code === "APG004")!.fix!;
    expect(fix.apply(s).flags.purge).toBeUndefined();
  });

  it("a valid install spec has no diagnostics", () => {
    expect(lint(spec({ action: "install", packages: ["nginx"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Refresh the package list' is apt-get update", () => {
    expect(line(getPreset("update-package-list")!.apply(spec()))).toBe("apt-get update");
  });

  it("'Install a package' is apt-get install -y nginx", () => {
    expect(line(getPreset("install-a-package")!.apply(spec()))).toBe("apt-get install -y nginx");
  });

  it("'Purge a package and its config' uses the purge action directly", () => {
    expect(line(getPreset("purge-a-package")!.apply(spec()))).toBe("apt-get purge nginx");
  });

  it("'Simulate an upgrade' is apt-get upgrade -s", () => {
    expect(line(getPreset("simulate-an-upgrade")!.apply(spec()))).toBe("apt-get upgrade -s");
  });

  it("'Remove unused dependencies' is apt-get autoremove -y", () => {
    expect(line(getPreset("remove-unused-dependencies")!.apply(spec()))).toBe("apt-get autoremove -y");
  });
});

describe("describeSpec", () => {
  it("describes update, upgrade, and autoremove", () => {
    expect(describeSpec(spec({ action: "update" }))).toBe(
      "Refresh the local package list from configured repositories.",
    );
    expect(describeSpec(spec({ action: "upgrade" }))).toBe(
      "Upgrade every installed package to its latest available version.",
    );
    expect(describeSpec(spec({ action: "autoremove" }))).toBe(
      "Remove packages that were automatically installed and are no longer needed.",
    );
  });

  it("describes install/remove with a package", () => {
    expect(describeSpec(spec({ action: "install", packages: ["nginx"] }))).toBe("Install nginx.");
    expect(describeSpec(spec({ action: "remove", packages: ["nginx"] }))).toBe("Remove nginx.");
  });

  it("describes purge distinctly, mentioning config files", () => {
    expect(describeSpec(spec({ action: "purge", packages: ["nginx"] }))).toBe("Purge nginx and its configuration files.");
  });

  it("uses a placeholder when install/remove/purge have no packages", () => {
    expect(describeSpec(spec({ action: "install" }))).toBe("Install SOME_PACKAGE.");
    expect(describeSpec(spec({ action: "purge" }))).toBe("Purge SOME_PACKAGE and its configuration files.");
  });

  it("mentions each flag as a trailing clause when set", () => {
    expect(describeSpec(spec({ action: "install", packages: ["nginx"], flags: { assumeYes: true } }))).toBe(
      "Install nginx, automatically answering yes to all prompts.",
    );
    expect(describeSpec(spec({ action: "remove", packages: ["nginx"], flags: { purge: true } }))).toBe(
      "Remove nginx, also removing configuration files.",
    );
    expect(describeSpec(spec({ action: "install", packages: ["nginx"], flags: { allowUnauthenticated: true } }))).toBe(
      "Install nginx, without verifying package signatures.",
    );
  });
});
