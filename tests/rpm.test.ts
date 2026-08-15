import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type RpmSpec } from "@cmdgen/rpm";

const line = (spec: RpmSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<RpmSpec> = {}): RpmSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("operation and target rendering", () => {
  it("install with a target renders -i then the file path", () => {
    expect(line(spec({ operation: "install", target: "package.rpm" }))).toBe("rpm -i package.rpm");
  });

  it("erase with a target renders -e then the package name", () => {
    expect(line(spec({ operation: "erase", target: "package-name" }))).toBe("rpm -e package-name");
  });

  it("query with a target renders -q then the package name", () => {
    expect(line(spec({ operation: "query", target: "package-name" }))).toBe("rpm -q package-name");
  });

  it("queryAll renders bare -qa and ignores target entirely", () => {
    expect(line(spec({ operation: "queryAll", target: "package-name" }))).toBe("rpm -qa");
    expect(line(spec({ operation: "queryAll", target: "" }))).toBe("rpm -qa");
  });

  it("an empty target is simply omitted for install/erase/query", () => {
    expect(line(spec({ operation: "install", target: "" }))).toBe("rpm -i");
    expect(line(spec({ operation: "erase", target: "   " }))).toBe("rpm -e");
  });
});

describe("flags", () => {
  it("renders -v and -h", () => {
    expect(line(spec({ operation: "install", target: "package.rpm", flags: { verbose: true } }))).toBe(
      "rpm -i -v package.rpm",
    );
    expect(line(spec({ operation: "install", target: "package.rpm", flags: { hash: true } }))).toBe(
      "rpm -i -h package.rpm",
    );
  });

  it("renders --force and --nodeps", () => {
    expect(line(spec({ operation: "erase", target: "package-name", flags: { force: true } }))).toBe(
      "rpm -e --force package-name",
    );
    expect(line(spec({ operation: "erase", target: "package-name", flags: { noDeps: true } }))).toBe(
      "rpm -e --nodeps package-name",
    );
  });

  it("combines multiple flags with the operation flag first and target last", () => {
    expect(
      line(spec({ operation: "install", target: "package.rpm", flags: { verbose: true, hash: true } })),
    ).toBe("rpm -i -v -h package.rpm");
  });
});

describe("lint", () => {
  it("RPM001 catches an empty target for install, with an install-specific message", () => {
    const result = lint(spec({ operation: "install", target: "" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("RPM001");
    expect(result.diagnostics.find((d) => d.code === "RPM001")?.message).toBe("rpm -i needs a .rpm file to install.");
  });

  it("RPM001 catches an empty target for erase, with an erase-specific message", () => {
    const result = lint(spec({ operation: "erase", target: "   " }));
    expect(result.diagnostics.map((d) => d.code)).toContain("RPM001");
    expect(result.diagnostics.find((d) => d.code === "RPM001")?.message).toBe("rpm -e needs a package name to erase.");
  });

  it("RPM001 catches an empty target for query, with a query-specific message", () => {
    const result = lint(spec({ operation: "query", target: "" }));
    expect(result.diagnostics.map((d) => d.code)).toContain("RPM001");
    expect(result.diagnostics.find((d) => d.code === "RPM001")?.message).toBe("rpm -q needs a package name to query.");
  });

  it("RPM001 never fires for queryAll, even with an empty target", () => {
    expect(lint(spec({ operation: "queryAll", target: "" })).diagnostics.map((d) => d.code)).not.toContain("RPM001");
  });

  it("RPM002 warns when hash is set but the operation isn't install", () => {
    const result = lint(spec({ operation: "erase", target: "package-name", flags: { hash: true } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("RPM002");
  });

  it("RPM002 does not fire when hash is set during install", () => {
    const result = lint(spec({ operation: "install", target: "package.rpm", flags: { hash: true } }));
    expect(result.diagnostics.map((d) => d.code)).not.toContain("RPM002");
  });

  it("a well-formed install and a well-formed queryAll have no diagnostics", () => {
    expect(lint(spec({ operation: "install", target: "package.rpm" })).diagnostics).toEqual([]);
    expect(lint(spec({ operation: "queryAll", target: "" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Install with progress hashes' is -i -v -h package.rpm", () => {
    expect(line(getPreset("install-with-progress")!.apply(spec()))).toBe("rpm -i -v -h package.rpm");
  });

  it("'Remove an installed package' is -e package-name", () => {
    expect(line(getPreset("remove-a-package")!.apply(spec()))).toBe("rpm -e package-name");
  });

  it("'List everything installed' is bare -qa", () => {
    expect(line(getPreset("list-all-installed")!.apply(spec()))).toBe("rpm -qa");
  });
});

describe("describeSpec", () => {
  it("describes install with a target, and with no target using the SOME_FILE.rpm placeholder", () => {
    expect(describeSpec(spec({ operation: "install", target: "package.rpm" }))).toBe("Install package.rpm.");
    expect(describeSpec(spec({ operation: "install", target: "" }))).toBe("Install SOME_FILE.rpm.");
  });

  it("describes erase with a target, and with no target using the SOME_PACKAGE placeholder", () => {
    expect(describeSpec(spec({ operation: "erase", target: "package-name" }))).toBe("Remove package-name.");
    expect(describeSpec(spec({ operation: "erase", target: "" }))).toBe("Remove SOME_PACKAGE.");
  });

  it("describes query with a target, and with no target using the SOME_PACKAGE placeholder", () => {
    expect(describeSpec(spec({ operation: "query", target: "package-name" }))).toBe(
      "Show details for package-name.",
    );
    expect(describeSpec(spec({ operation: "query", target: "" }))).toBe("Show details for SOME_PACKAGE.");
  });

  it("describes queryAll regardless of target", () => {
    expect(describeSpec(spec({ operation: "queryAll", target: "ignored" }))).toBe("List every installed package.");
  });

  it("describes verbose, hash, force, and noDeps as trailing clauses", () => {
    const described = describeSpec(
      spec({
        operation: "install",
        target: "package.rpm",
        flags: { verbose: true, hash: true, force: true, noDeps: true },
      }),
    );
    expect(described).toContain("printing verbose output");
    expect(described).toContain("showing hash marks as a progress indicator");
    expect(described).toContain("forcing the install even over a newer package or conflicting files");
    expect(described).toContain("skipping dependency checks");
  });
});
