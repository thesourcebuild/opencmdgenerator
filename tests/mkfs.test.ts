import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type MkfsSpec } from "@cmdgen/mkfs";

const line = (spec: MkfsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<MkfsSpec> = {}): MkfsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("device, filesystem type, and flags", () => {
  it("a bare mkfs with nothing set", () => {
    expect(line(spec())).toBe("mkfs");
  });

  it("renders -t TYPE before the device", () => {
    expect(line(spec({ device: "/dev/sdb1", filesystemType: "ext4" }))).toBe("mkfs -t ext4 /dev/sdb1");
  });

  it("renders -c, -L, -F", () => {
    expect(line(spec({ device: "/dev/sdb1", flags: { check: true } }))).toBe("mkfs -c /dev/sdb1");
    expect(line(spec({ device: "/dev/sdb1", flags: { label: "DATA" } }))).toBe("mkfs -L DATA /dev/sdb1");
    expect(line(spec({ device: "/dev/sdb1", flags: { force: true } }))).toBe("mkfs -F /dev/sdb1");
  });

  it("combines -t, catalogue flags, and the device in that order", () => {
    expect(
      line(spec({ device: "/dev/sdb1", filesystemType: "ext4", flags: { check: true, label: "DATA", force: true } })),
    ).toBe("mkfs -t ext4 -c -L DATA -F /dev/sdb1");
  });

  it("trims whitespace from device and filesystemType", () => {
    expect(line(spec({ device: "  /dev/sdb1  ", filesystemType: "  ext4  " }))).toBe("mkfs -t ext4 /dev/sdb1");
  });
});

describe("lint", () => {
  it("MKF001 catches a missing device", () => {
    expect(lint(spec({ device: "" })).diagnostics.map((d) => d.code)).toContain("MKF001");
  });

  it("MKF001 does not fire once a device is set", () => {
    expect(lint(spec({ device: "/dev/sdb1" })).diagnostics.map((d) => d.code)).not.toContain("MKF001");
  });

  it("MKF002 (always destructive) fires unconditionally, regardless of device or flags, with no fix", () => {
    const bare = lint(spec());
    expect(bare.diagnostics.map((d) => d.code)).toContain("MKF002");
    const withDevice = lint(spec({ device: "/dev/sdb1" }));
    expect(withDevice.diagnostics.map((d) => d.code)).toContain("MKF002");
    const withEverything = lint(
      spec({ device: "/dev/sdb1", filesystemType: "ext4", flags: { check: true, label: "DATA", force: true } }),
    );
    expect(withEverything.diagnostics.map((d) => d.code)).toContain("MKF002");

    const diag = withEverything.diagnostics.find((d) => d.code === "MKF002")!;
    expect(diag.level).toBe("destructive");
    expect(diag.fix).toBeUndefined();
  });

  it("the preview's isDestructive signal is always on for mkfs", () => {
    expect(lint(spec()).counts.destructive).toBeGreaterThan(0);
    expect(lint(spec({ device: "/dev/sdb1" })).counts.destructive).toBeGreaterThan(0);
  });
});

describe("presets", () => {
  it("'Format as ext4'", () => {
    expect(line(getPreset("format-ext4")!.apply(spec()))).toBe("mkfs -t ext4 /dev/sdb1");
  });

  it("'Format as ext4 with a label'", () => {
    expect(line(getPreset("format-ext4-with-label")!.apply(spec()))).toBe("mkfs -t ext4 -L DATA /dev/sdb1");
  });

  it("'Format and check for bad blocks'", () => {
    expect(line(getPreset("format-check-bad-blocks")!.apply(spec()))).toBe("mkfs -t ext4 -c /dev/sdb1");
  });

  it("'Force-format as xfs'", () => {
    expect(line(getPreset("force-format-xfs")!.apply(spec()))).toBe("mkfs -t xfs -F /dev/sdb1");
  });
});

describe("describeSpec", () => {
  it("describes formatting with an explicit type", () => {
    expect(describeSpec(spec({ device: "/dev/sdb1", filesystemType: "ext4" }))).toBe(
      "Format /dev/sdb1 as ext4, erasing all existing data on it.",
    );
  });

  it("describes formatting with mkfs's own default type when none is given", () => {
    expect(describeSpec(spec({ device: "/dev/sdb1" }))).toBe(
      "Format /dev/sdb1 with mkfs's own default filesystem type, erasing all existing data on it.",
    );
  });

  it("uses a SOME_DEVICE placeholder when device is empty", () => {
    expect(describeSpec(spec())).toContain("SOME_DEVICE");
  });

  it("mentions check, label, and force as trailing clauses", () => {
    const description = describeSpec(
      spec({ device: "/dev/sdb1", filesystemType: "ext4", flags: { check: true, label: "DATA", force: true } }),
    );
    expect(description).toContain("checking for bad blocks first");
    expect(description).toContain('labeling it "DATA"');
    expect(description).toContain("bypassing mkfs's own safety checks");
  });
});
