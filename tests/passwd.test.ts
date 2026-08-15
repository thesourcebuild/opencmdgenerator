import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PasswdSpec } from "@cmdgen/passwd";

const line = (spec: PasswdSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PasswdSpec> = {}): PasswdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("username and flags", () => {
  it("a bare passwd with no username and no flags", () => {
    expect(line(spec())).toBe("passwd");
  });

  it("a username with no flags", () => {
    expect(line(spec({ username: "alice" }))).toBe("passwd alice");
  });

  it("renders -l, -u, -d, -e, and -S", () => {
    expect(line(spec({ username: "alice", flags: { lock: true } }))).toBe("passwd -l alice");
    expect(line(spec({ username: "alice", flags: { unlock: true } }))).toBe("passwd -u alice");
    expect(line(spec({ username: "alice", flags: { deletePassword: true } }))).toBe("passwd -d alice");
    expect(line(spec({ username: "alice", flags: { expire: true } }))).toBe("passwd -e alice");
    expect(line(spec({ username: "alice", flags: { status: true } }))).toBe("passwd -S alice");
  });

  it("renders a flag with no username at all", () => {
    expect(line(spec({ flags: { status: true } }))).toBe("passwd -S");
  });
});

describe("lint", () => {
  it("PASSWD001 catches -l and -u together", () => {
    const s = spec({ username: "alice", flags: { lock: true, unlock: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("PASSWD001");
    const fix = result.diagnostics.find((d) => d.code === "PASSWD001")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("PASSWD001");
  });

  it("a plain passwd with a username has no diagnostics", () => {
    expect(lint(spec({ username: "alice" })).diagnostics).toEqual([]);
  });

  it("an empty username has no diagnostics — a bare passwd is valid usage", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });

  it("-l alone, or -u alone, has no diagnostics", () => {
    expect(lint(spec({ username: "alice", flags: { lock: true } })).diagnostics).toEqual([]);
    expect(lint(spec({ username: "alice", flags: { unlock: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Change your own password' is a bare passwd", () => {
    expect(line(getPreset("change-own-password")!.apply(spec()))).toBe("passwd");
  });

  it("'Lock an account' is -l alice", () => {
    expect(line(getPreset("lock-an-account")!.apply(spec()))).toBe("passwd -l alice");
  });

  it("'Check an account's password status' is -S alice", () => {
    expect(line(getPreset("check-status")!.apply(spec()))).toBe("passwd -S alice");
  });
});

describe("describeSpec", () => {
  it("describes the bare default case", () => {
    expect(describeSpec(spec())).toBe("Change your own password.");
  });

  it("describes a username with no flags", () => {
    expect(describeSpec(spec({ username: "alice" }))).toBe("Change alice's password.");
  });

  it("describes -l", () => {
    expect(describeSpec(spec({ username: "alice", flags: { lock: true } }))).toBe("Lock alice's account.");
    expect(describeSpec(spec({ flags: { lock: true } }))).toBe("Lock your own account.");
  });

  it("describes -u", () => {
    expect(describeSpec(spec({ username: "alice", flags: { unlock: true } }))).toBe("Unlock alice's account.");
  });

  it("describes -d", () => {
    expect(describeSpec(spec({ username: "alice", flags: { deletePassword: true } }))).toBe(
      "Delete alice's password, leaving the account passwordless.",
    );
  });

  it("describes -e", () => {
    expect(describeSpec(spec({ username: "alice", flags: { expire: true } }))).toBe(
      "Force alice's password to expire immediately.",
    );
  });

  it("describes -S", () => {
    expect(describeSpec(spec({ username: "alice", flags: { status: true } }))).toBe("Show alice's password status.");
  });
});
