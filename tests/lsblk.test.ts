import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type LsblkSpec } from "@cmdgen/lsblk";

const line = (spec: LsblkSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<LsblkSpec> = {}): LsblkSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare lsblk with no flags", () => {
    expect(line(spec())).toBe("lsblk");
  });

  it("renders -f, -a, -p", () => {
    expect(line(spec({ flags: { fs: true } }))).toBe("lsblk -f");
    expect(line(spec({ flags: { all: true } }))).toBe("lsblk -a");
    expect(line(spec({ flags: { paths: true } }))).toBe("lsblk -p");
  });

  it("renders -o as a detached text value", () => {
    expect(line(spec({ flags: { output: "NAME,SIZE,TYPE" } }))).toBe("lsblk -o NAME,SIZE,TYPE");
  });

  it("combines multiple flags in catalogue order", () => {
    expect(line(spec({ flags: { fs: true, all: true, paths: true } }))).toBe("lsblk -f -a -p");
  });
});

describe("lint", () => {
  it("has no rules — every flag is independent", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { fs: true, all: true, paths: true, output: "NAME" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'List block devices' is a bare lsblk", () => {
    expect(line(getPreset("default-listing")!.apply(spec()))).toBe("lsblk");
  });

  it("'Show filesystem info' is -f", () => {
    expect(line(getPreset("filesystem-info")!.apply(spec()))).toBe("lsblk -f");
  });

  it("'Show full device paths' is -a -p (catalogue order: all before paths)", () => {
    expect(line(getPreset("full-device-paths")!.apply(spec()))).toBe("lsblk -a -p");
  });

  it("'Choose custom columns' sets -o", () => {
    expect(line(getPreset("custom-columns")!.apply(spec()))).toBe("lsblk -o NAME,SIZE,TYPE,MOUNTPOINT");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("List block devices.");
  });

  it("mentions all, fs, output, and paths as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { all: true } }))).toBe("List block devices, including empty ones.");
    expect(describeSpec(spec({ flags: { fs: true } }))).toBe(
      "List block devices, showing filesystem info (type, label, UUID, mountpoint).",
    );
    expect(describeSpec(spec({ flags: { output: "NAME,SIZE" } }))).toBe(
      "List block devices, showing columns NAME,SIZE.",
    );
    expect(describeSpec(spec({ flags: { paths: true } }))).toBe("List block devices, using full device paths.");
  });
});
