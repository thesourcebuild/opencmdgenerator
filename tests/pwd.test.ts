import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PwdSpec } from "@cmdgen/pwd";

const line = (spec: PwdSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<PwdSpec> = {}): PwdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("bare pwd with no flags", () => {
    expect(line(spec())).toBe("pwd");
  });

  it("renders -L and -P", () => {
    expect(line(spec({ flags: { symlinkMode: "logical" } }))).toBe("pwd -L");
    expect(line(spec({ flags: { symlinkMode: "physical" } }))).toBe("pwd -P");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { symlinkMode: "physical" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Resolve symlinks' is -P", () => {
    expect(line(getPreset("resolve-symlinks")!.apply(spec()))).toBe("pwd -P");
  });

  it("'Show $PWD as set' is -L", () => {
    expect(line(getPreset("show-as-tracked")!.apply(spec()))).toBe("pwd -L");
  });
});

describe("describeSpec", () => {
  it("describes the default (logical) case", () => {
    expect(describeSpec(spec())).toContain("symlinks and all");
  });

  it("describes the physical case", () => {
    expect(describeSpec(spec({ flags: { symlinkMode: "physical" } }))).toContain("resolving");
  });
});

describe("mac — renders identically to linux", () => {
  it("bare pwd with no flags", () => {
    expect(line(spec({ platform: "mac" }))).toBe(line(spec({ platform: "linux" })));
    expect(line(spec({ platform: "mac" }))).toBe("pwd");
  });

  it("renders -L and -P identically to linux", () => {
    expect(line(spec({ platform: "mac", flags: { symlinkMode: "logical" } }))).toBe(
      line(spec({ platform: "linux", flags: { symlinkMode: "logical" } })),
    );
    expect(line(spec({ platform: "mac", flags: { symlinkMode: "physical" } }))).toBe(
      line(spec({ platform: "linux", flags: { symlinkMode: "physical" } })),
    );
  });
});

describe("cygwin/msys/wsl — identical to posix, no path arguments to convert", () => {
  for (const platform of ["windows-cygwin", "windows-msys", "windows-wsl"] as const) {
    it(`${platform}: renders bare pwd with no flags`, () => {
      expect(line(spec({ platform }))).toBe("pwd");
    });

    it(`${platform}: renders -L and -P identically to posix`, () => {
      expect(line(spec({ platform, flags: { symlinkMode: "logical" } }))).toBe("pwd -L");
      expect(line(spec({ platform, flags: { symlinkMode: "physical" } }))).toBe("pwd -P");
    });

    it(`${platform}: 'Resolve symlinks' preset is applicable and renders -P`, () => {
      expect(getPreset("resolve-symlinks")!.isApplicable?.(spec({ platform }))).toBe(true);
      expect(line(getPreset("resolve-symlinks")!.apply(spec({ platform })))).toBe("pwd -P");
    });

    it(`${platform}: 'Show $PWD as set' preset is applicable and renders -L`, () => {
      expect(getPreset("show-as-tracked")!.isApplicable?.(spec({ platform }))).toBe(true);
      expect(line(getPreset("show-as-tracked")!.apply(spec({ platform })))).toBe("pwd -L");
    });

    it(`${platform}: binary stays "pwd", not "Get-Location"`, () => {
      expect(buildArgv(spec({ platform })).binary).toBe("pwd");
    });
  }
});

describe("PowerShell (Get-Location)", () => {
  const ps = (partial: Partial<PwdSpec> = {}): PwdSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Get-Location as the binary, with no flags", () => {
    expect(line(ps())).toBe("Get-Location");
  });

  it("POSIX-only flags are silently dropped on PowerShell", () => {
    expect(line(ps({ flags: { symlinkMode: "physical" } }))).toBe("Get-Location");
  });

  it("presets are POSIX-only", () => {
    expect(getPreset("resolve-symlinks")!.isApplicable?.(ps())).toBe(false);
    expect(line(getPreset("resolve-symlinks")!.apply(ps()))).toBe("Get-Location");
  });

  it("describeSpec has no symlink-mode branch on PowerShell", () => {
    expect(describeSpec(ps())).toBe("Print the current working directory.");
  });
});
