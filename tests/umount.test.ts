import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UmountSpec } from "@cmdgen/umount";

const line = (spec: UmountSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UmountSpec> = {}): UmountSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("target and flags", () => {
  it("a bare target", () => {
    expect(line(spec({ target: "/mnt/data" }))).toBe("umount /mnt/data");
  });

  it("renders -f, -l, -a", () => {
    expect(line(spec({ target: "/mnt/data", flags: { force: true } }))).toBe("umount -f /mnt/data");
    expect(line(spec({ target: "/mnt/data", flags: { lazy: true } }))).toBe("umount -l /mnt/data");
    expect(line(spec({ flags: { all: true } }))).toBe("umount -a");
  });

  it("renders -t as a detached text value", () => {
    expect(line(spec({ flags: { all: true, types: "nfs,cifs" } }))).toBe("umount -a -t nfs,cifs");
  });

  it("trims whitespace from target", () => {
    expect(line(spec({ target: "  /mnt/data  " }))).toBe("umount /mnt/data");
  });

  it("a bare umount with no target and no --all", () => {
    expect(line(spec())).toBe("umount");
  });
});

describe("lint", () => {
  it("UMT001 catches no target and no --all", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("UMT001");
  });

  it("a target alone has no UMT001", () => {
    expect(lint(spec({ target: "/mnt/data" })).diagnostics.map((d) => d.code)).not.toContain("UMT001");
  });

  it("--all alone has no UMT001", () => {
    expect(lint(spec({ flags: { all: true } })).diagnostics.map((d) => d.code)).not.toContain("UMT001");
  });

  it("UMT002 catches target given together with --all, and the fix clears the target", () => {
    const s = spec({ target: "/mnt/data", flags: { all: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("UMT002");
    const fix = result.diagnostics.find((d) => d.code === "UMT002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("UMT002");
  });

  it("UMT003 notes --types without --all", () => {
    const s = spec({ target: "/mnt/data", flags: { types: "ext4" } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("UMT003");
  });

  it("--types together with --all has no UMT003", () => {
    const s = spec({ flags: { all: true, types: "ext4" } });
    expect(lint(s).diagnostics.map((d) => d.code)).not.toContain("UMT003");
  });

  it("a plain unmount has no diagnostics", () => {
    expect(lint(spec({ target: "/mnt/data" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Unmount a device or mount point'", () => {
    expect(line(getPreset("unmount-a-device")!.apply(spec()))).toBe("umount /mnt/data");
  });

  it("'Force-unmount a busy filesystem'", () => {
    expect(line(getPreset("force-unmount-busy")!.apply(spec()))).toBe("umount -f /mnt/data");
  });

  it("'Lazily detach a filesystem'", () => {
    expect(line(getPreset("lazy-unmount")!.apply(spec()))).toBe("umount -l /mnt/data");
  });

  it("'Unmount every filesystem of a given type'", () => {
    expect(line(getPreset("unmount-everything-of-type")!.apply(spec()))).toBe("umount -a -t nfs,cifs");
  });
});

describe("describeSpec", () => {
  it("describes unmounting a target", () => {
    expect(describeSpec(spec({ target: "/mnt/data" }))).toBe("Unmount /mnt/data.");
  });

  it("describes --all", () => {
    expect(describeSpec(spec({ flags: { all: true } }))).toBe("Unmount every currently mounted filesystem.");
  });

  it("mentions types, force, and lazy as trailing clauses", () => {
    const description = describeSpec(spec({ flags: { all: true, types: "nfs", force: true, lazy: true } }));
    expect(description).toContain("restricted to filesystem type(s) nfs");
    expect(description).toContain("forcing it even if the filesystem is busy");
    expect(description).toContain("detaching it lazily");
  });

  it("handles no target given without crashing", () => {
    expect(describeSpec(spec())).toBe("Unmount (no target given).");
  });
});
