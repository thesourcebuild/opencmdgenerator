import { describe, expect, it } from "vitest";
import { RULES, lint, validateCatalogue } from "@cmdgen/rsync";
import { localToLocal, localToSsh } from "./rsync-fixtures";

/**
 * The lint rules are what make this more useful than a man page, so each one has
 * a positive and a negative case, and every rule offering a fix is checked to
 * actually silence itself when the fix is applied.
 */
const codes = (spec: Parameters<typeof lint>[0]) => lint(spec).diagnostics.map((d) => d.code);
const has = (spec: Parameters<typeof lint>[0], code: string) => codes(spec).includes(code);

describe("catalogue integrity", () => {
  it("has no duplicate ids, orders, or dangling references", () => {
    expect(validateCatalogue()).toEqual([]);
  });

  it("has no duplicate rule codes", () => {
    const seen = new Set<string>();
    const dupes = RULES.map((r) => r.code).filter((c) =>
      seen.has(c) ? true : (seen.add(c), false),
    );
    expect(dupes).toEqual([]);
  });
});

describe("RS001 delete without recursion", () => {
  it("fires and offers --archive as the fix", () => {
    const spec = localToLocal({ flags: { delete: "during" } });
    expect(has(spec, "RS001")).toBe(true);

    const fix = lint(spec).diagnostics.find((d) => d.code === "RS001")?.fix;
    expect(fix).toBeDefined();
    expect(has(fix!.apply(spec), "RS001")).toBe(false);
  });

  it("stays quiet when recursion is on", () => {
    expect(has(localToLocal({ flags: { archive: true, delete: "during" } }), "RS001")).toBe(false);
  });
});

describe("RS002 remote to remote", () => {
  it("fires when neither side is local", () => {
    const spec = localToSsh({
      source: {
        kind: "ssh",
        host: "a.example.com",
        path: "/data",
        batchMode: false,
        sshOptions: [],
      },
    });
    expect(has(spec, "RS002")).toBe(true);
  });

  it("stays quiet for a normal push", () => {
    expect(has(localToSsh({ flags: { archive: true } }), "RS002")).toBe(false);
  });
});

describe("RS004 contradictory flags", () => {
  it("catches --checksum with --size-only", () => {
    expect(
      has(localToLocal({ flags: { archive: true, checksum: true, sizeOnly: true } }), "RS004"),
    ).toBe(true);
  });

  it("catches --inplace with --partial-dir", () => {
    const spec = localToLocal({
      flags: { archive: true, inplace: true, partialDir: ".partial" },
    });
    expect(has(spec, "RS004")).toBe(true);
  });
});

describe("RS007 flags missing from the target rsync", () => {
  it("fires for --mkpath against protocol 30", () => {
    expect(
      has(localToLocal({ targetProtocol: 30, flags: { archive: true, mkpath: true } }), "RS007"),
    ).toBe(true);
  });
});

describe("RS008 disallowed passthrough", () => {
  it("fires for --rsync-path smuggled through extraArgs", () => {
    const spec = localToLocal({ flags: { archive: true }, extraArgs: ["--rsync-path=/tmp/x"] });
    expect(has(spec, "RS008")).toBe(true);
  });
});

describe("destructive diagnostics", () => {
  it("RS010 flags any live delete, and the dry-run fix silences it", () => {
    const spec = localToLocal({ flags: { archive: true, delete: "after", maxDelete: 10 } });
    const result = lint(spec);
    expect(result.isDestructive).toBe(true);

    const fix = result.diagnostics.find((d) => d.code === "RS010")?.fix;
    expect(has(fix!.apply(spec), "RS010")).toBe(false);
  });

  it("RS011 demands a --max-delete circuit breaker", () => {
    const spec = localToLocal({ flags: { archive: true, delete: "after" } });
    expect(has(spec, "RS011")).toBe(true);
    expect(
      has(localToLocal({ flags: { archive: true, delete: "after", maxDelete: 50 } }), "RS011"),
    ).toBe(false);
  });

  it("RS012 warns that --delete-excluded removes the files excludes protect", () => {
    const spec = localToLocal({
      flags: { archive: true, delete: "after", deleteExcluded: true },
      filters: [{ id: "1", kind: "exclude", pattern: "*.log", enabled: true, comment: "" }],
    });
    expect(has(spec, "RS012")).toBe(true);
  });

  it("RS013 catches a destination nested inside the source", () => {
    const spec = localToLocal({
      source: { kind: "local", path: "/data" },
      destination: { kind: "local", path: "/data/backup" },
      flags: { archive: true },
    });
    expect(has(spec, "RS013")).toBe(true);
  });

  it("RS013 does not fire for sibling paths sharing a prefix", () => {
    const spec = localToLocal({
      source: { kind: "local", path: "/data" },
      destination: { kind: "local", path: "/database" },
      flags: { archive: true },
    });
    expect(has(spec, "RS013")).toBe(false);
  });

  it("RS015 pushes --append towards --append-verify", () => {
    const spec = localToLocal({ flags: { archive: true, append: "append" } });
    expect(has(spec, "RS015")).toBe(true);
    expect(has(localToLocal({ flags: { archive: true, append: "verify" } }), "RS015")).toBe(false);
  });
});

describe("warnings", () => {
  it("RS020 spots flags already covered by --archive", () => {
    const spec = localToLocal({ flags: { archive: true, recursive: true, times: true } });
    const diag = lint(spec).diagnostics.find((d) => d.code === "RS020");
    expect(diag).toBeDefined();
    expect(has(diag!.fix!.apply(spec), "RS020")).toBe(false);
  });

  it("RS021 spots -z on a local copy but not on a remote one", () => {
    expect(has(localToLocal({ flags: { archive: true, compress: true } }), "RS021")).toBe(true);
    expect(has(localToSsh({ flags: { archive: true, compress: true } }), "RS021")).toBe(false);
  });

  it("RS023 warns that -r changes what --files-from means", () => {
    const spec = localToLocal({
      flags: { archive: true, filesFrom: "/tmp/list.txt", recursive: true },
    });
    expect(has(spec, "RS023")).toBe(true);
  });

  it("RS024 spots an include shadowed by an earlier catch-all exclude", () => {
    const spec = localToLocal({
      flags: { archive: true },
      filters: [
        { id: "1", kind: "exclude", pattern: "*", enabled: true, comment: "" },
        { id: "2", kind: "include", pattern: "*.jpg", enabled: true, comment: "" },
      ],
    });
    expect(has(spec, "RS024")).toBe(true);
  });

  it("RS024 stays quiet when the include comes first", () => {
    const spec = localToLocal({
      flags: { archive: true },
      filters: [
        { id: "1", kind: "include", pattern: "*.jpg", enabled: true, comment: "" },
        { id: "2", kind: "exclude", pattern: "*", enabled: true, comment: "" },
      ],
    });
    expect(has(spec, "RS024")).toBe(false);
  });

  it("RS026 warns when timestamps are not preserved", () => {
    expect(has(localToLocal({ flags: { recursive: true } }), "RS026")).toBe(true);
    expect(has(localToLocal({ flags: { archive: true } }), "RS026")).toBe(false);
  });

  it("RS027 catches a Windows path emitted verbatim", () => {
    const spec = localToLocal({
      pathFlavor: "unix",
      source: { kind: "local", path: "C:\\Data" },
      flags: { archive: true },
    });
    expect(has(spec, "RS027")).toBe(true);
    expect(has({ ...spec, pathFlavor: "cygwin" }, "RS027")).toBe(false);
  });

  it("RS028 pushes --partial towards --partial-dir", () => {
    expect(has(localToLocal({ flags: { archive: true, partial: true } }), "RS028")).toBe(true);
    expect(
      has(localToLocal({ flags: { archive: true, partial: true, partialDir: ".p" } }), "RS028"),
    ).toBe(false);
  });
});

describe("clean specs", () => {
  it("a plain additive backup produces no errors and nothing destructive", () => {
    const spec = localToLocal({
      flags: { archive: true, humanReadable: true, partial: true, partialDir: ".rsync-partial" },
    });
    const result = lint(spec);
    expect(result.hasErrors).toBe(false);
    expect(result.isDestructive).toBe(false);
  });

  it("an incomplete spec reports RS006 rather than throwing", () => {
    const result = lint(localToLocal({ source: { kind: "local", path: "" } }));
    expect(result.diagnostics.map((d) => d.code)).toContain("RS006");
  });
});
