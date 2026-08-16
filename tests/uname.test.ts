import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UnameSpec } from "@cmdgen/uname";

const line = (spec: UnameSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UnameSpec> = {}): UnameSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare uname with no flags", () => {
    expect(line(spec())).toBe("uname");
  });

  it("renders -a, -s, -n, -r, -v, -m, -p, -o", () => {
    expect(line(spec({ flags: { all: true } }))).toBe("uname -a");
    expect(line(spec({ flags: { kernelName: true } }))).toBe("uname -s");
    expect(line(spec({ flags: { nodename: true } }))).toBe("uname -n");
    expect(line(spec({ flags: { kernelRelease: true } }))).toBe("uname -r");
    expect(line(spec({ flags: { kernelVersion: true } }))).toBe("uname -v");
    expect(line(spec({ flags: { machine: true } }))).toBe("uname -m");
    expect(line(spec({ flags: { processor: true } }))).toBe("uname -p");
    expect(line(spec({ flags: { operatingSystem: true } }))).toBe("uname -o");
  });

  it("combines multiple flags freely, no conflicts", () => {
    expect(line(spec({ flags: { kernelName: true, kernelRelease: true } }))).toBe("uname -s -r");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { all: true, machine: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Show kernel name' is a bare uname", () => {
    expect(line(getPreset("kernel-name")!.apply(spec()))).toBe("uname");
  });

  it("'Show everything' is -a", () => {
    expect(line(getPreset("show-everything")!.apply(spec()))).toBe("uname -a");
  });

  it("'Show kernel name explicitly' is -s", () => {
    expect(line(getPreset("show-kernel-name")!.apply(spec()))).toBe("uname -s");
  });

  it("'Show network node hostname' is -n", () => {
    expect(line(getPreset("show-nodename")!.apply(spec()))).toBe("uname -n");
  });

  it("'Show kernel release' is -r", () => {
    expect(line(getPreset("show-kernel-release")!.apply(spec()))).toBe("uname -r");
  });

  it("'Show kernel version' is -v", () => {
    expect(line(getPreset("show-kernel-version")!.apply(spec()))).toBe("uname -v");
  });

  it("'Show architecture' is -m", () => {
    expect(line(getPreset("show-architecture")!.apply(spec()))).toBe("uname -m");
  });

  it("'Show processor type' is -p", () => {
    expect(line(getPreset("show-processor")!.apply(spec()))).toBe("uname -p");
  });

  it("'Show operating system' is -o", () => {
    expect(line(getPreset("show-operating-system")!.apply(spec()))).toBe("uname -o");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Print the kernel name (the default with no flags).");
  });

  it("describes -a", () => {
    expect(describeSpec(spec({ flags: { all: true } }))).toBe("Print every piece of system information.");
  });

  it("describes a combination", () => {
    expect(describeSpec(spec({ flags: { machine: true, kernelRelease: true } }))).toBe(
      "Print the kernel release, the hardware architecture.",
    );
  });
});
