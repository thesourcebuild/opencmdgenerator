import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PacmanSpec } from "@cmdgen/pacman";

const line = (spec: PacmanSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PacmanSpec> = {}): PacmanSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("operation, packages, and flags", () => {
  it("a bare sync with no packages renders just the operation token", () => {
    expect(line(spec())).toBe("pacman -S");
  });

  it("renders sync with one or multiple packages, in order", () => {
    expect(line(spec({ packages: ["nginx"] }))).toBe("pacman -S nginx");
    expect(line(spec({ packages: ["nginx", "git"] }))).toBe("pacman -S nginx git");
  });

  it("renders remove with a package", () => {
    expect(line(spec({ operation: "remove", packages: ["nginx"] }))).toBe("pacman -R nginx");
  });

  it("renders remove with --cascade", () => {
    expect(line(spec({ operation: "remove", packages: ["nginx"], flags: { cascade: true } }))).toBe(
      "pacman -R --cascade nginx",
    );
  });

  it("renders searchSync with a package", () => {
    expect(line(spec({ operation: "searchSync", packages: ["nginx"] }))).toBe("pacman -Ss nginx");
  });

  it("renders refreshUpgrade as a bare -Syu and ignores packages entirely, but still applies flags", () => {
    expect(line(spec({ operation: "refreshUpgrade" }))).toBe("pacman -Syu");
    expect(line(spec({ operation: "refreshUpgrade", packages: ["nginx", "git"] }))).toBe("pacman -Syu");
    expect(line(spec({ operation: "refreshUpgrade", packages: ["nginx"], flags: { noConfirm: true } }))).toBe(
      "pacman -Syu --noconfirm",
    );
  });

  it("renders --noconfirm and --needed before the package list, in catalogue order", () => {
    expect(line(spec({ packages: ["nginx"], flags: { needed: true, noConfirm: true } }))).toBe(
      "pacman -S --noconfirm --needed nginx",
    );
  });
});

describe("lint", () => {
  it("PACMAN001 catches sync/remove/searchSync with no packages, interpolating the operation's own token", () => {
    const syncDiag = lint(spec()).diagnostics.find((d) => d.code === "PACMAN001")!;
    expect(syncDiag.level).toBe("error");
    expect(syncDiag.field).toBe("packages");
    expect(syncDiag.message).toBe("pacman -S needs at least one package name.");

    const removeDiag = lint(spec({ operation: "remove" })).diagnostics.find((d) => d.code === "PACMAN001")!;
    expect(removeDiag.message).toBe("pacman -R needs at least one package name.");

    const searchDiag = lint(spec({ operation: "searchSync" })).diagnostics.find((d) => d.code === "PACMAN001")!;
    expect(searchDiag.message).toBe("pacman -Ss needs at least one package name.");
  });

  it("PACMAN001 never fires for refreshUpgrade, regardless of packages", () => {
    expect(lint(spec({ operation: "refreshUpgrade" })).diagnostics.map((d) => d.code)).not.toContain("PACMAN001");
    expect(
      lint(spec({ operation: "refreshUpgrade", packages: ["nginx"] })).diagnostics.map((d) => d.code),
    ).not.toContain("PACMAN001");
  });

  it("PACMAN002 warns when --needed is set without the sync operation, but not with it", () => {
    const withRemove = lint(spec({ operation: "remove", packages: ["nginx"], flags: { needed: true } }));
    expect(withRemove.diagnostics.map((d) => d.code)).toContain("PACMAN002");
    const diag = withRemove.diagnostics.find((d) => d.code === "PACMAN002")!;
    expect(diag.level).toBe("warning");
    expect(diag.message).toBe("--needed only has an effect with the sync (-S) operation.");

    const withSync = lint(spec({ packages: ["nginx"], flags: { needed: true } }));
    expect(withSync.diagnostics.map((d) => d.code)).not.toContain("PACMAN002");
  });

  it("PACMAN003 warns when --cascade is set without the remove operation, but not with it", () => {
    const withSync = lint(spec({ packages: ["nginx"], flags: { cascade: true } }));
    expect(withSync.diagnostics.map((d) => d.code)).toContain("PACMAN003");
    const diag = withSync.diagnostics.find((d) => d.code === "PACMAN003")!;
    expect(diag.level).toBe("warning");
    expect(diag.message).toBe("--cascade only has an effect with the remove (-R) operation.");

    const withRemove = lint(spec({ operation: "remove", packages: ["nginx"], flags: { cascade: true } }));
    expect(withRemove.diagnostics.map((d) => d.code)).not.toContain("PACMAN003");
  });

  it("a valid sync with a package and no conflicting flags has no diagnostics", () => {
    expect(lint(spec({ packages: ["nginx"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Install a package' is -S nginx", () => {
    expect(line(getPreset("install-a-package")!.apply(spec()))).toBe("pacman -S nginx");
  });

  it("'Refresh and upgrade everything' is -Syu", () => {
    expect(line(getPreset("refresh-and-upgrade")!.apply(spec()))).toBe("pacman -Syu");
  });

  it("'Remove a package and its dependents' is -R --cascade nginx", () => {
    expect(line(getPreset("remove-with-dependents")!.apply(spec()))).toBe("pacman -R --cascade nginx");
  });
});

describe("describeSpec", () => {
  it("describes sync, remove, and searchSync with a package", () => {
    expect(describeSpec(spec({ packages: ["nginx"] }))).toBe("Install nginx.");
    expect(describeSpec(spec({ operation: "remove", packages: ["nginx"] }))).toBe("Remove nginx.");
    expect(describeSpec(spec({ operation: "searchSync", packages: ["nginx"] }))).toBe("Search for nginx.");
  });

  it("describes multiple packages as a comma-joined list", () => {
    expect(describeSpec(spec({ packages: ["nginx", "git"] }))).toBe("Install nginx, git.");
  });

  it("describes refreshUpgrade without mentioning any packages, even when packages is non-empty", () => {
    expect(describeSpec(spec({ operation: "refreshUpgrade", packages: ["nginx"] }))).toBe(
      "Refresh the package database and upgrade every installed package.",
    );
  });

  it("uses a SOME_PACKAGE placeholder when sync/remove/searchSync have no packages", () => {
    expect(describeSpec(spec())).toBe("Install SOME_PACKAGE.");
    expect(describeSpec(spec({ operation: "remove" }))).toBe("Remove SOME_PACKAGE.");
    expect(describeSpec(spec({ operation: "searchSync" }))).toBe("Search for SOME_PACKAGE.");
  });

  it("mentions --noconfirm, --needed, and --cascade as trailing clauses", () => {
    expect(describeSpec(spec({ packages: ["nginx"], flags: { noConfirm: true } }))).toBe(
      "Install nginx, skipping all confirmation prompts.",
    );
    expect(describeSpec(spec({ packages: ["nginx"], flags: { needed: true } }))).toBe(
      "Install nginx, skipping packages already up to date.",
    );
    expect(describeSpec(spec({ operation: "remove", packages: ["nginx"], flags: { cascade: true } }))).toBe(
      "Remove nginx, also removing every dependent package.",
    );
    expect(describeSpec(spec({ operation: "refreshUpgrade", flags: { noConfirm: true } }))).toBe(
      "Refresh the package database and upgrade every installed package, skipping all confirmation prompts.",
    );
  });
});
