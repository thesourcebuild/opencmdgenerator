import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type FdiskSpec } from "@cmdgen/fdisk";

const line = (spec: FdiskSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<FdiskSpec> = {}): FdiskSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("device and -l", () => {
  it("createSpec defaults -l to true — the only mode this generator supports", () => {
    expect(line(spec())).toBe("fdisk -l");
  });

  it("-l with a device lists that device's partition table", () => {
    expect(line(spec({ device: "/dev/sda" }))).toBe("fdisk -l /dev/sda");
  });

  it("turning off -l with no device renders a bare fdisk", () => {
    expect(line(spec({ flags: { list: false } }))).toBe("fdisk");
  });

  it("turning off -l with a device renders just the device (the dangerous, unrepresentable interactive form)", () => {
    expect(line(spec({ device: "/dev/sda", flags: { list: false } }))).toBe("fdisk /dev/sda");
  });

  it("trims whitespace from the device", () => {
    expect(line(spec({ device: "  /dev/sda  " }))).toBe("fdisk -l /dev/sda");
  });
});

describe("lint", () => {
  it("FDK001 fires as info when a device is set but -l is off, and its fix silences it", () => {
    const s = spec({ device: "/dev/sda", flags: { list: false } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("FDK001");
    const diag = result.diagnostics.find((d) => d.code === "FDK001")!;
    expect(diag.level).toBe("info");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("FDK001");
    expect(fixed.flags.list).toBe(true);
  });

  it("FDK001 does not fire when -l is on", () => {
    expect(lint(spec({ device: "/dev/sda", flags: { list: true } })).diagnostics).toEqual([]);
  });

  it("FDK001 does not fire when there's no device at all", () => {
    expect(lint(spec({ device: "", flags: { list: false } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'List every device's partition table'", () => {
    expect(line(getPreset("list-all-devices")!.apply(spec()))).toBe("fdisk -l");
  });

  it("'List one disk's partition table'", () => {
    expect(line(getPreset("list-one-disk")!.apply(spec()))).toBe("fdisk -l /dev/sda");
  });

  it("'List one NVMe disk's partition table'", () => {
    expect(line(getPreset("list-one-nvme-disk")!.apply(spec()))).toBe("fdisk -l /dev/nvme0n1");
  });
});

describe("describeSpec", () => {
  it("describes listing every device when -l is on with no device", () => {
    expect(describeSpec(spec())).toBe("List the partition table for every device fdisk can find.");
  });

  it("describes listing one device", () => {
    expect(describeSpec(spec({ device: "/dev/sda" }))).toBe("List the partition table for /dev/sda.");
  });

  it("describes the unrepresentable interactive case when -l is off", () => {
    expect(describeSpec(spec({ flags: { list: false } }))).toBe(
      "Open an interactive partitioning session (not representable as a single generated command — this generator only supports the read-only -l form).",
    );
    expect(describeSpec(spec({ device: "/dev/sda", flags: { list: false } }))).toBe(
      "Open an interactive partitioning session for /dev/sda (not representable as a single generated command — this generator only supports the read-only -l form).",
    );
  });
});
