import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type EchoSpec } from "@cmdgen/echo";

const line = (spec: EchoSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<EchoSpec> = {}): EchoSpec => ({
  ...createSpec({ id: "test-spec" }),
  text: "Hello",
  ...partial,
});

describe("POSIX (echo)", () => {
  it("a bare word needs no quoting", () => {
    expect(line(spec())).toBe("echo Hello");
  });

  it("text with spaces/punctuation is quoted", () => {
    expect(line(spec({ text: "Hello, world!" }))).toBe("echo 'Hello, world!'");
  });

  it("renders -n", () => {
    expect(line(spec({ flags: { noNewline: true } }))).toBe("echo -n Hello");
  });

  it("renders -e and -E", () => {
    expect(line(spec({ flags: { escapeMode: "interpret" } }))).toBe("echo -e Hello");
    expect(line(spec({ flags: { escapeMode: "disable" } }))).toBe("echo -E Hello");
  });

  it("an empty string renders as an empty quoted argument", () => {
    expect(line(spec({ text: "" }))).toBe("echo ''");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ text: "" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Print a line'", () => {
    expect(line(getPreset("print-line")!.apply(spec()))).toBe("echo 'Hello, world!'");
  });

  it("'No trailing newline' is -n on POSIX", () => {
    expect(line(getPreset("no-trailing-newline")!.apply(spec()))).toBe("echo -n Loading...");
  });

  it("'Interpret backslash escapes' is -e, POSIX only", () => {
    expect(line(getPreset("interpret-escapes")!.apply(spec()))).toBe("echo -e 'Line one\\nLine two'");
    expect(getPreset("interpret-escapes")!.isApplicable?.(spec({ platform: "windows-powershell" }))).toBe(false);
  });
});

describe("describeSpec", () => {
  it("describes a plain print", () => {
    expect(describeSpec(spec())).toBe('Print "Hello".');
  });

  it("describes an empty line", () => {
    expect(describeSpec(spec({ text: "" }))).toBe("Print an empty line.");
  });
});

describe("cmd.exe (echo) — no flags at all", () => {
  const cmd = (partial: Partial<EchoSpec> = {}): EchoSpec => spec({ platform: "windows-cmd", ...partial });

  it("uses echo as the binary", () => {
    expect(line(cmd())).toBe("echo Hello");
  });

  it("quotes text with special characters", () => {
    expect(line(cmd({ text: "Hello, world!" }))).toBe('echo "Hello, world!"');
  });
});

describe("cygwin/msys/wsl (echo) — same real bash builtin echo as linux/mac", () => {
  const cygwin = (partial: Partial<EchoSpec> = {}): EchoSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<EchoSpec> = {}): EchoSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<EchoSpec> = {}): EchoSpec => spec({ platform: "windows-wsl", ...partial });

  it("renders a bare word identically to linux/mac", () => {
    expect(line(cygwin())).toBe("echo Hello");
    expect(line(msys())).toBe("echo Hello");
    expect(line(wsl())).toBe("echo Hello");
  });

  it("quotes text with spaces/punctuation the same as linux/mac", () => {
    expect(line(cygwin({ text: "Hello, world!" }))).toBe("echo 'Hello, world!'");
    expect(line(msys({ text: "Hello, world!" }))).toBe("echo 'Hello, world!'");
    expect(line(wsl({ text: "Hello, world!" }))).toBe("echo 'Hello, world!'");
  });

  it("renders -n on all three, same as linux/mac", () => {
    expect(line(cygwin({ flags: { noNewline: true } }))).toBe("echo -n Hello");
    expect(line(msys({ flags: { noNewline: true } }))).toBe("echo -n Hello");
    expect(line(wsl({ flags: { noNewline: true } }))).toBe("echo -n Hello");
  });

  it("renders -e and -E on all three, same as linux/mac", () => {
    expect(line(cygwin({ flags: { escapeMode: "interpret" } }))).toBe("echo -e Hello");
    expect(line(msys({ flags: { escapeMode: "disable" } }))).toBe("echo -E Hello");
    expect(line(wsl({ flags: { escapeMode: "interpret" } }))).toBe("echo -e Hello");
  });

  it("drops the PowerShell-only -NoNewline flag entirely", () => {
    expect(line(cygwin({ flags: { noNewlinePs: true } }))).toBe("echo Hello");
    expect(line(wsl({ flags: { noNewlinePs: true } }))).toBe("echo Hello");
  });

  it("describes the platform the same way as linux/mac, not the PowerShell branch", () => {
    expect(describeSpec(cygwin({ flags: { noNewline: true } }))).toBe(
      'Print "Hello", without a trailing newline.',
    );
    expect(describeSpec(msys({ flags: { escapeMode: "interpret" } }))).toBe(
      'Print "Hello", interpreting backslash escapes like \\n and \\t.',
    );
    expect(describeSpec(wsl())).toBe('Print "Hello".');
  });

  it("'No trailing newline' preset applies -n, same as linux/mac", () => {
    expect(line(getPreset("no-trailing-newline")!.apply(cygwin()))).toBe("echo -n Loading...");
    expect(line(getPreset("no-trailing-newline")!.apply(msys()))).toBe("echo -n Loading...");
    expect(line(getPreset("no-trailing-newline")!.apply(wsl()))).toBe("echo -n Loading...");
  });

  it("'Interpret backslash escapes' preset is now applicable — POSIX-family, not POSIX-only-by-name", () => {
    expect(getPreset("interpret-escapes")!.isApplicable?.(cygwin())).toBe(true);
    expect(getPreset("interpret-escapes")!.isApplicable?.(msys())).toBe(true);
    expect(getPreset("interpret-escapes")!.isApplicable?.(wsl())).toBe(true);
    expect(line(getPreset("interpret-escapes")!.apply(wsl()))).toBe("echo -e 'Line one\\nLine two'");
  });

  it("lint has nothing to flag, same as linux/mac", () => {
    expect(lint(cygwin()).diagnostics).toEqual([]);
    expect(lint(msys()).diagnostics).toEqual([]);
    expect(lint(wsl()).diagnostics).toEqual([]);
  });
});

describe("PowerShell — Write-Output by default, Write-Host with -NoNewline", () => {
  const ps = (partial: Partial<EchoSpec> = {}): EchoSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses Write-Output when no-newline isn't requested", () => {
    expect(line(ps())).toBe("Write-Output Hello");
  });

  it("switches to Write-Host -NoNewline when requested", () => {
    expect(line(ps({ flags: { noNewlinePs: true } }))).toBe("Write-Host Hello -NoNewline");
  });

  it("quotes text with special characters", () => {
    expect(line(ps({ text: "Hello, world!" }))).toBe("Write-Output 'Hello, world!'");
  });
});
