import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type AliasSpec } from "@cmdgen/alias";

const line = (spec: AliasSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<AliasSpec> = {}): AliasSpec => ({
  ...createSpec({ id: "test-spec" }),
  aliasName: "ll",
  command: "ls -la",
  ...partial,
});

describe("POSIX (alias)", () => {
  it("sets NAME=COMMAND as one attached token, quoting only the value half", () => {
    expect(line(spec())).toBe("alias ll='ls -la'");
  });

  it("leaves a safe command unquoted", () => {
    expect(line(spec({ aliasName: "g", command: "git" }))).toBe("alias g=git");
  });

  it("shows an existing alias with just a name", () => {
    expect(line(spec({ command: "" }))).toBe("alias ll");
  });

  it("renders -p, ignoring name/command entirely", () => {
    expect(line(spec({ flags: { printAll: true } }))).toBe("alias -p");
  });
});

describe("lint", () => {
  it("ALIAS001 warns about a command with no name", () => {
    expect(lint(spec({ aliasName: "" })).diagnostics.map((d) => d.code)).toContain("ALIAS001");
  });

  it("ALIAS001 does not fire when both are empty (bare alias, valid)", () => {
    expect(lint(spec({ aliasName: "", command: "" })).diagnostics.map((d) => d.code)).not.toContain("ALIAS001");
  });

  it("a plain alias has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Create a shortcut'", () => {
    expect(line(getPreset("create-shortcut")!.apply(spec()))).toBe("alias ll='ls -la'");
  });

  it("'Show an alias' is POSIX only", () => {
    expect(line(getPreset("show-alias")!.apply(spec()))).toBe("alias ll");
    expect(getPreset("show-alias")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });

  it("'List all aliases' is -p, POSIX only", () => {
    expect(line(getPreset("list-all-aliases")!.apply(spec()))).toBe("alias -p");
    expect(getPreset("list-all-aliases")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes setting an alias", () => {
    expect(describeSpec(spec())).toBe('Make ll run "ls -la" on Linux.');
  });

  it("describes showing an alias", () => {
    expect(describeSpec(spec({ command: "" }))).toBe("Show what the alias ll expands to on Linux.");
  });
});

describe("Cygwin/MSYS2/WSL (alias) — real POSIX syntax, not Set-Alias", () => {
  const cygwin = (partial: Partial<AliasSpec> = {}): AliasSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<AliasSpec> = {}): AliasSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<AliasSpec> = {}): AliasSpec => spec({ platform: "windows-wsl", ...partial });

  it("renders NAME=COMMAND identically to linux/mac, attached with correct quoting", () => {
    expect(line(cygwin())).toBe("alias ll='ls -la'");
    expect(line(msys())).toBe("alias ll='ls -la'");
    expect(line(wsl())).toBe("alias ll='ls -la'");
  });

  it("leaves a safe command unquoted, same as linux/mac", () => {
    expect(line(cygwin({ aliasName: "g", command: "git" }))).toBe("alias g=git");
    expect(line(msys({ aliasName: "g", command: "git" }))).toBe("alias g=git");
    expect(line(wsl({ aliasName: "g", command: "git" }))).toBe("alias g=git");
  });

  it("renders -p identically to linux/mac", () => {
    expect(line(cygwin({ flags: { printAll: true } }))).toBe("alias -p");
    expect(line(msys({ flags: { printAll: true } }))).toBe("alias -p");
    expect(line(wsl({ flags: { printAll: true } }))).toBe("alias -p");
  });

  it("'Show an alias' applies on cygwin/msys/wsl, same as linux/mac", () => {
    expect(getPreset("show-alias")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("show-alias")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("show-alias")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("show-alias")!.apply(cygwin()))).toBe("alias ll");
    expect(line(getPreset("show-alias")!.apply(msys()))).toBe("alias ll");
    expect(line(getPreset("show-alias")!.apply(wsl()))).toBe("alias ll");
  });

  it("'List all aliases' applies on cygwin/msys/wsl, same as linux/mac", () => {
    expect(getPreset("list-all-aliases")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("list-all-aliases")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("list-all-aliases")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("list-all-aliases")!.apply(cygwin()))).toBe("alias -p");
    expect(line(getPreset("list-all-aliases")!.apply(msys()))).toBe("alias -p");
    expect(line(getPreset("list-all-aliases")!.apply(wsl()))).toBe("alias -p");
  });
});

describe("PowerShell (Set-Alias)", () => {
  const ps = (partial: Partial<AliasSpec> = {}): AliasSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses -Name and -Value", () => {
    expect(line(ps())).toBe("Set-Alias -Name ll -Value 'ls -la'");
  });

  it("omits -Value when command is empty", () => {
    expect(line(ps({ command: "" }))).toBe("Set-Alias -Name ll");
  });
});
