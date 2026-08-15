import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SuSpec } from "@cmdgen/su";

const line = (spec: SuSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SuSpec> = {}): SuSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("username and flags", () => {
  it("a bare su with no username and no flags", () => {
    expect(line(spec())).toBe("su");
  });

  it("a username with no flags", () => {
    expect(line(spec({ username: "alice" }))).toBe("su alice");
  });

  it("renders -l as a boolean flag", () => {
    expect(line(spec({ flags: { login: true } }))).toBe("su -l");
    expect(line(spec({ username: "alice", flags: { login: true } }))).toBe("su -l alice");
  });

  it("renders -c as a detached short-form text value, quoted when it contains a space", () => {
    expect(line(spec({ flags: { command: "whoami" } }))).toBe("su -c whoami");
    expect(line(spec({ flags: { command: "echo hi" } }))).toBe("su -c 'echo hi'");
  });

  it("renders -s as a detached short-form text value", () => {
    expect(line(spec({ username: "alice", flags: { shell: "/bin/bash" } }))).toBe("su -s /bin/bash alice");
  });

  it("combines multiple flags with the username last, in catalogue order", () => {
    expect(line(spec({ username: "alice", flags: { login: true, command: "whoami", shell: "/bin/bash" } }))).toBe(
      "su -l -c whoami -s /bin/bash alice",
    );
  });
});

describe("lint", () => {
  it("SU001 fires on a bare su (defaults to root)", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("SU001");
  });

  it("SU001 fires when the username is explicitly root", () => {
    expect(lint(spec({ username: "root" })).diagnostics.map((d) => d.code)).toContain("SU001");
  });

  it("SU001 does not fire for a non-root username", () => {
    expect(lint(spec({ username: "alice" })).diagnostics.map((d) => d.code)).not.toContain("SU001");
  });

  it("SU002 fires when -c is set without -l", () => {
    expect(lint(spec({ username: "alice", flags: { command: "whoami" } })).diagnostics.map((d) => d.code)).toContain(
      "SU002",
    );
  });

  it("SU002 does not fire when -c is combined with -l", () => {
    expect(
      lint(spec({ username: "alice", flags: { command: "whoami", login: true } })).diagnostics.map((d) => d.code),
    ).not.toContain("SU002");
  });

  it("a plain su to a named user with no flags has only no diagnostics beyond the root advisory (none, since not root)", () => {
    expect(lint(spec({ username: "alice" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Switch to root' is su -l", () => {
    expect(line(getPreset("switch-to-root")!.apply(spec()))).toBe("su -l");
  });

  it("'Switch to another user' is su -l alice", () => {
    expect(line(getPreset("switch-to-user")!.apply(spec()))).toBe("su -l alice");
  });

  it("'Run one command as root' is su -c whoami", () => {
    expect(line(getPreset("run-one-command")!.apply(spec()))).toBe("su -c whoami");
  });

  it("'Use a different shell' is su -s /bin/bash alice", () => {
    expect(line(getPreset("use-a-different-shell")!.apply(spec()))).toBe("su -s /bin/bash alice");
  });
});

describe("describeSpec", () => {
  it("describes the bare default case as switching to root", () => {
    expect(describeSpec(spec())).toBe("Switch to the root user.");
  });

  it("describes a named username", () => {
    expect(describeSpec(spec({ username: "alice" }))).toBe("Switch to the alice user.");
  });

  it("describes -l, -c, and -s as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { login: true } }))).toBe(
      "Switch to the root user, starting a full login shell.",
    );
    expect(describeSpec(spec({ flags: { command: "whoami" } }))).toBe(
      'Switch to the root user, running "whoami" instead of an interactive shell.',
    );
    expect(describeSpec(spec({ username: "alice", flags: { shell: "/bin/bash" } }))).toBe(
      "Switch to the alice user, using /bin/bash instead of its configured login shell.",
    );
  });
});
