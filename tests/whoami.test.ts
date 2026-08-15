import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WhoamiSpec } from "@cmdgen/whoami";

const line = (spec: WhoamiSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<WhoamiSpec> = {}): WhoamiSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("the same binary everywhere", () => {
  it("is bare whoami with no flags on POSIX", () => {
    expect(line(spec())).toBe("whoami");
  });

  it("is bare whoami on Windows too", () => {
    expect(line(spec({ platform: "windows-cmd" }))).toBe("whoami");
    expect(line(spec({ platform: "windows-powershell" }))).toBe("whoami");
  });

  it("POSIX has no flags to offer at all", () => {
    expect(line(spec({ platform: "posix", flags: { allInfo: true } }))).toBe("whoami");
  });

  it("Windows renders /ALL, /GROUPS, /PRIV", () => {
    expect(line(spec({ platform: "windows-cmd", flags: { allInfo: true } }))).toBe("whoami /ALL");
    expect(line(spec({ platform: "windows-powershell", flags: { groups: true } }))).toBe("whoami /GROUPS");
    expect(line(spec({ platform: "windows-cmd", flags: { privileges: true } }))).toBe("whoami /PRIV");
  });
});

describe("Cygwin/MSYS2/WSL behave like posix, not like windows-cmd/windows-powershell", () => {
  it("is bare whoami on Cygwin, MSYS2, and WSL", () => {
    expect(line(spec({ platform: "windows-cygwin" }))).toBe("whoami");
    expect(line(spec({ platform: "windows-msys" }))).toBe("whoami");
    expect(line(spec({ platform: "windows-wsl" }))).toBe("whoami");
  });

  it("drops /ALL, /GROUPS, /PRIV even when explicitly set, same as plain posix", () => {
    expect(line(spec({ platform: "windows-cygwin", flags: { allInfo: true } }))).toBe(
      line(spec({ platform: "posix", flags: { allInfo: true } })),
    );
    expect(line(spec({ platform: "windows-msys", flags: { groups: true } }))).toBe(
      line(spec({ platform: "posix", flags: { groups: true } })),
    );
    expect(line(spec({ platform: "windows-wsl", flags: { privileges: true } }))).toBe(
      line(spec({ platform: "posix", flags: { privileges: true } })),
    );
    expect(line(spec({ platform: "windows-cygwin", flags: { allInfo: true } }))).toBe("whoami");
    expect(line(spec({ platform: "windows-msys", flags: { privileges: true } }))).toBe("whoami");
    expect(line(spec({ platform: "windows-wsl", flags: { allInfo: true } }))).toBe("whoami");
  });

  it("the binary is still the literal whoami binary, same as every other platform", () => {
    expect(buildArgv(spec({ platform: "windows-cygwin" })).binary).toBe("whoami");
    expect(buildArgv(spec({ platform: "windows-msys" })).binary).toBe("whoami");
    expect(buildArgv(spec({ platform: "windows-wsl" })).binary).toBe("whoami");
  });
});

describe("lint", () => {
  it("WHOAMI001 catches /ALL and /GROUPS together", () => {
    const s = spec({ platform: "windows-cmd", flags: { allInfo: true, groups: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("WHOAMI001");
    const fix = result.diagnostics.find((d) => d.code === "WHOAMI001")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("WHOAMI001");
  });

  it("a plain whoami has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Show current user'", () => {
    expect(line(getPreset("show-current-user")!.apply(spec()))).toBe("whoami");
  });

  it("'Show all info' is Windows only", () => {
    expect(line(getPreset("show-all-info")!.apply(spec({ platform: "windows-cmd" })))).toBe("whoami /ALL");
    expect(getPreset("show-all-info")!.isApplicable?.(spec())).toBe(false);
  });

  it("'Show group memberships' is Windows only", () => {
    expect(line(getPreset("show-groups")!.apply(spec({ platform: "windows-powershell" })))).toBe("whoami /GROUPS");
    expect(getPreset("show-groups")!.isApplicable?.(spec())).toBe(false);
  });

  it("'Show all info' and 'Show group memberships' are also inapplicable on Cygwin/MSYS2/WSL", () => {
    expect(getPreset("show-all-info")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(false);
    expect(getPreset("show-all-info")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(false);
    expect(getPreset("show-all-info")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(false);
    expect(getPreset("show-groups")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(false);
    expect(getPreset("show-groups")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(false);
    expect(getPreset("show-groups")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Print the current user's name.");
  });

  it("describes /ALL", () => {
    expect(describeSpec(spec({ flags: { allInfo: true } }))).toBe(
      "Print the current user's name, group membership, and privileges.",
    );
  });
});
