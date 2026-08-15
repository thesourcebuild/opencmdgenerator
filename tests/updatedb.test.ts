import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UpdatedbSpec } from "@cmdgen/updatedb";

const line = (spec: UpdatedbSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UpdatedbSpec> = {}): UpdatedbSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare updatedb with no flags", () => {
    expect(line(spec())).toBe("updatedb");
  });

  it("renders --localpaths attached with =", () => {
    expect(line(spec({ flags: { localpaths: "/home /srv" } }))).toBe("updatedb --localpaths='/home /srv'");
  });

  it("renders --prunepaths attached with =", () => {
    expect(line(spec({ flags: { prunepaths: "/tmp /var/tmp" } }))).toBe("updatedb --prunepaths='/tmp /var/tmp'");
  });

  it("renders both together", () => {
    expect(line(spec({ flags: { localpaths: "/home", prunepaths: "/tmp" } }))).toBe(
      "updatedb --localpaths=/home --prunepaths=/tmp",
    );
  });
});

describe("lint", () => {
  it("has no diagnostics ever, since there's nothing to get wrong", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { localpaths: "/home", prunepaths: "/tmp" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Rebuild the database' is a bare updatedb", () => {
    expect(line(getPreset("rebuild-default")!.apply(spec()))).toBe("updatedb");
  });

  it("'Scan only specific paths'", () => {
    expect(line(getPreset("scan-specific-paths")!.apply(spec()))).toBe("updatedb --localpaths='/home /srv'");
  });

  it("'Skip temporary directories'", () => {
    expect(line(getPreset("skip-temp-paths")!.apply(spec()))).toBe("updatedb --prunepaths='/tmp /var/tmp'");
  });
});

describe("describeSpec", () => {
  it("describes the default rebuild", () => {
    expect(describeSpec(spec())).toBe("Rebuild the database that locate searches.");
  });

  it("mentions localpaths and prunepaths as trailing clauses", () => {
    const description = describeSpec(spec({ flags: { localpaths: "/home", prunepaths: "/tmp" } }));
    expect(description).toContain("scanning only /home");
    expect(description).toContain("skipping /tmp");
  });
});
