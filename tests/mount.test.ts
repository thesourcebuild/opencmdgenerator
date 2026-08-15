import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type MountSpec } from "@cmdgen/mount";

const line = (spec: MountSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<MountSpec> = {}): MountSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("device/mountPoint and flags", () => {
  it("a bare mount with neither device nor mountPoint", () => {
    expect(line(spec())).toBe("mount");
  });

  it("mounts a device at a mount point", () => {
    expect(line(spec({ device: "/dev/sdb1", mountPoint: "/mnt/data" }))).toBe("mount /dev/sdb1 /mnt/data");
  });

  it("renders -t and -o as detached text values", () => {
    expect(line(spec({ device: "/dev/sdb1", mountPoint: "/mnt/data", flags: { type: "ext4" } }))).toBe(
      "mount -t ext4 /dev/sdb1 /mnt/data",
    );
    expect(line(spec({ device: "/dev/sdb1", mountPoint: "/mnt/data", flags: { options: "ro,noexec" } }))).toBe(
      "mount -o ro,noexec /dev/sdb1 /mnt/data",
    );
  });

  it("renders -r, --bind, -v", () => {
    expect(line(spec({ device: "/dev/sdb1", mountPoint: "/mnt/data", flags: { readOnly: true } }))).toBe(
      "mount -r /dev/sdb1 /mnt/data",
    );
    expect(line(spec({ device: "/srv/data", mountPoint: "/var/www/data", flags: { bind: true } }))).toBe(
      "mount --bind /srv/data /var/www/data",
    );
    expect(line(spec({ device: "/dev/sdb1", mountPoint: "/mnt/data", flags: { verbose: true } }))).toBe(
      "mount -v /dev/sdb1 /mnt/data",
    );
  });

  it("trims whitespace from device and mountPoint", () => {
    expect(line(spec({ device: "  /dev/sdb1  ", mountPoint: "  /mnt/data  " }))).toBe("mount /dev/sdb1 /mnt/data");
  });
});

describe("lint", () => {
  it("MOUNT001 catches device given but mountPoint empty", () => {
    const s = spec({ device: "/dev/sdb1", mountPoint: "" });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("MOUNT001");
  });

  it("MOUNT001 catches mountPoint given but device empty", () => {
    const s = spec({ device: "", mountPoint: "/mnt/data" });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("MOUNT001");
  });

  it("both set is valid, no diagnostics", () => {
    const s = spec({ device: "/dev/sdb1", mountPoint: "/mnt/data" });
    expect(lint(s).diagnostics).toEqual([]);
  });

  it("neither set is valid (lists mounted filesystems), no diagnostics", () => {
    const s = spec();
    expect(lint(s).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'List mounted filesystems' is a bare mount", () => {
    expect(line(getPreset("list-mounted")!.apply(spec()))).toBe("mount");
  });

  it("'Mount a device with an explicit type' is -t ext4 -o ro", () => {
    expect(line(getPreset("mount-a-device")!.apply(spec()))).toBe("mount -t ext4 -o ro /dev/sdb1 /mnt/data");
  });

  it("'Bind-mount a directory' is --bind", () => {
    expect(line(getPreset("bind-mount")!.apply(spec()))).toBe("mount --bind /srv/data /var/www/data");
  });
});

describe("describeSpec", () => {
  it("describes listing mounted filesystems when both are empty", () => {
    expect(describeSpec(spec())).toBe("List every currently mounted filesystem.");
  });

  it("describes mounting a device at a mount point when both are set", () => {
    expect(describeSpec(spec({ device: "/dev/sdb1", mountPoint: "/mnt/data" }))).toBe(
      "Mount /dev/sdb1 at /mnt/data.",
    );
  });

  it("mentions type, options, read-only, bind, and verbose as trailing clauses", () => {
    const description = describeSpec(
      spec({
        device: "/dev/sdb1",
        mountPoint: "/mnt/data",
        flags: { type: "ext4", options: "ro", readOnly: true, bind: true, verbose: true },
      }),
    );
    expect(description).toContain("using filesystem type ext4");
    expect(description).toContain("with options ro");
    expect(description).toContain("read-only");
    expect(description).toContain("as a bind mount");
    expect(description).toContain("describing each step as it goes");
  });

  it("handles the invalid half-specified case without crashing", () => {
    expect(describeSpec(spec({ device: "/dev/sdb1", mountPoint: "" }))).toBe("Mount /dev/sdb1 at (unspecified).");
    expect(describeSpec(spec({ device: "", mountPoint: "/mnt/data" }))).toBe("Mount (unspecified) at /mnt/data.");
  });
});
