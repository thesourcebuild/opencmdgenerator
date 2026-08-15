import { describe, expect, it } from "vitest";
import { continuationFor, quoteAttached, quoteCmd, quoteFor, quotePosix, quotePowerShell } from "@cmdgen/engine";

/**
 * Quoting is a correctness concern, not a cosmetic one: the output is text a
 * human pastes into a shell, and a path that loses its quotes silently syncs the
 * wrong location. These are the torture cases that catch naive implementations.
 */

describe("POSIX quoting", () => {
  it("leaves provably safe tokens bare", () => {
    expect(quotePosix("/home/me/photos")).toBe("/home/me/photos");
    expect(quotePosix("--exclude")).toBe("--exclude");
    expect(quotePosix("deploy@host.example.com:/var/www")).toBe(
      "deploy@host.example.com:/var/www",
    );
    expect(quotePosix("--bwlimit=5M")).toBe("--bwlimit=5M");
  });

  it("quotes spaces", () => {
    expect(quotePosix("/Users/me/My Documents")).toBe("'/Users/me/My Documents'");
  });

  it("escapes embedded single quotes by closing, escaping and reopening", () => {
    expect(quotePosix("/Users/me/Bob's Files")).toBe(`'/Users/me/Bob'\\''s Files'`);
  });

  it("quotes shell metacharacters that would otherwise expand", () => {
    expect(quotePosix("*.tmp")).toBe("'*.tmp'");
    expect(quotePosix("$HOME/data")).toBe("'$HOME/data'");
    expect(quotePosix("a;rm -rf /")).toBe("'a;rm -rf /'");
    expect(quotePosix("back`tick`")).toBe("'back`tick`'");
    expect(quotePosix("bang!")).toBe("'bang!'");
    expect(quotePosix("paren(1)")).toBe("'paren(1)'");
    expect(quotePosix("~/relative")).toBe("'~/relative'");
  });

  it("quotes the empty string so it survives as an argument", () => {
    expect(quotePosix("")).toBe("''");
  });
});

describe("PowerShell quoting", () => {
  it("doubles embedded single quotes", () => {
    expect(quotePowerShell("/Users/me/Bob's Files")).toBe("'/Users/me/Bob''s Files'");
  });

  it("quotes tokens containing characters PowerShell would interpret", () => {
    expect(quotePowerShell("C:\\Data\\My Photos")).toBe("'C:\\Data\\My Photos'");
    expect(quotePowerShell("$env:HOME")).toBe("'$env:HOME'");
    expect(quotePowerShell("@list")).toBe("'@list'");
    expect(quotePowerShell("a;b")).toBe("'a;b'");
  });

  it("leaves plain Windows paths bare", () => {
    expect(quotePowerShell("C:\\Data\\Photos")).toBe("C:\\Data\\Photos");
  });
});

describe("attached values", () => {
  it("keeps the flag name bare and quotes only the value", () => {
    expect(quoteAttached("--exclude=*.tmp", "posix")).toBe("--exclude='*.tmp'");
    expect(quoteAttached("--partial-dir=my dir", "posix")).toBe("--partial-dir='my dir'");
  });

  it("leaves fully safe attached tokens untouched", () => {
    expect(quoteAttached("--bwlimit=5M", "posix")).toBe("--bwlimit=5M");
  });

  it("falls back to quoting the whole token when there is no value half", () => {
    expect(quoteAttached("--weird value", "posix")).toBe("'--weird value'");
  });
});

describe("cmd.exe quoting", () => {
  it("leaves provably safe tokens bare", () => {
    expect(quoteCmd("C:\\Data\\Photos")).toBe("C:\\Data\\Photos");
    expect(quoteCmd("--exclude")).toBe("--exclude");
  });

  it("quotes spaces", () => {
    expect(quoteCmd("C:\\Data\\My Photos")).toBe('"C:\\Data\\My Photos"');
  });

  it("doubles embedded double quotes", () => {
    expect(quoteCmd('say "hi"')).toBe('"say ""hi"""');
  });

  it("quotes the empty string so it survives as an argument", () => {
    expect(quoteCmd("")).toBe('""');
  });
});

describe("quoteFor dispatch", () => {
  // The bug this guards: quoteFor used to be a two-way `shell === "powershell"
  // ? ... : quotePosix(...)` ternary, which would have silently misrouted
  // "cmd" to POSIX quoting instead of failing loudly or routing correctly.
  it("routes each ShellDialect value to its own quoting function, not a two-way fallback", () => {
    expect(quoteFor("My Photos", "posix")).toBe(quotePosix("My Photos"));
    expect(quoteFor("My Photos", "cmd")).toBe(quoteCmd("My Photos"));
    expect(quoteFor("My Photos", "powershell")).toBe(quotePowerShell("My Photos"));
    expect(quoteFor("My Photos", "cmd")).not.toBe(quoteFor("My Photos", "posix"));
  });
});

describe("continuationFor", () => {
  it("gives each shell its own real line-continuation token", () => {
    expect(continuationFor("posix")).toBe(" \\");
    expect(continuationFor("cmd")).toBe(" ^");
    expect(continuationFor("powershell")).toBe(" `");
  });
});
