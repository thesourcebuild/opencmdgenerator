import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type BlkidSpec } from "@cmdgen/blkid";

const line = (spec: BlkidSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<BlkidSpec> = {}): BlkidSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("device and flags", () => {
  it("a bare blkid with no device scans every block device", () => {
    expect(line(spec())).toBe("blkid");
  });

  it("appends a device after the flags", () => {
    expect(line(spec({ device: "/dev/sda1" }))).toBe("blkid /dev/sda1");
  });

  it("renders -s as a detached text value", () => {
    expect(line(spec({ device: "/dev/sda1", flags: { matchTag: "UUID" } }))).toBe("blkid -s UUID /dev/sda1");
  });

  it("renders -o value/device/list/udev", () => {
    expect(line(spec({ flags: { output: "value" } }))).toBe("blkid -o value");
    expect(line(spec({ flags: { output: "device" } }))).toBe("blkid -o device");
    expect(line(spec({ flags: { output: "list" } }))).toBe("blkid -o list");
    expect(line(spec({ flags: { output: "udev" } }))).toBe("blkid -o udev");
  });

  it("the 'none' output sentinel renders nothing (full output, the default)", () => {
    expect(line(spec({ flags: { output: "none" } }))).toBe("blkid");
  });

  it("combines -s and -o together, in catalogue order, before the device", () => {
    expect(line(spec({ device: "/dev/sda1", flags: { matchTag: "UUID", output: "value" } }))).toBe(
      "blkid -s UUID -o value /dev/sda1",
    );
  });

  it("trims whitespace from the device", () => {
    expect(line(spec({ device: "  /dev/sda1  " }))).toBe("blkid /dev/sda1");
  });
});

describe("lint", () => {
  it("has no rules — nothing about this command's flags can conflict", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ device: "/dev/sda1", flags: { matchTag: "UUID", output: "value" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'List every block device'", () => {
    expect(line(getPreset("list-everything")!.apply(spec()))).toBe("blkid");
  });

  it("'Get a device's UUID'", () => {
    expect(line(getPreset("device-uuid")!.apply(spec()))).toBe("blkid -s UUID -o value /dev/sda1");
  });

  it("'udev-style key=value output'", () => {
    expect(line(getPreset("udev-style")!.apply(spec()))).toBe("blkid -o udev /dev/sda1");
  });
});

describe("describeSpec", () => {
  it("describes the default case scanning every block device", () => {
    expect(describeSpec(spec())).toBe("Report filesystem/partition attributes for every block device.");
  });

  it("describes a specific device", () => {
    expect(describeSpec(spec({ device: "/dev/sda1" }))).toBe(
      "Report filesystem/partition attributes for /dev/sda1.",
    );
  });

  it("mentions matchTag and output as trailing clauses", () => {
    expect(describeSpec(spec({ device: "/dev/sda1", flags: { matchTag: "UUID" } }))).toBe(
      "Report filesystem/partition attributes for /dev/sda1, showing only the UUID tag.",
    );
    expect(describeSpec(spec({ device: "/dev/sda1", flags: { output: "udev" } }))).toBe(
      "Report filesystem/partition attributes for /dev/sda1, formatted as udev-style KEY=VALUE pairs.",
    );
  });
});
