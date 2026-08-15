import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PkillSpec } from "@cmdgen/pkill";

const line = (spec: PkillSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PkillSpec> = {}): PkillSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("pattern and flags", () => {
  it("a bare pattern with no flags", () => {
    expect(line(spec({ pattern: "firefox" }))).toBe("pkill firefox");
  });

  it("renders -f/--full", () => {
    expect(line(spec({ pattern: "firefox", flags: { full: true } }))).toBe("pkill -f firefox");
  });

  it("renders --signal as a detached long-form text value", () => {
    expect(line(spec({ pattern: "firefox", flags: { signal: "KILL" } }))).toBe("pkill --signal KILL firefox");
  });

  it("renders --user as a detached long-form text value", () => {
    expect(line(spec({ pattern: "firefox", flags: { user: "alice" } }))).toBe("pkill --user alice firefox");
  });

  it("renders -x/--exact", () => {
    expect(line(spec({ pattern: "firefox", flags: { exact: true } }))).toBe("pkill -x firefox");
  });

  it("renders -o/--oldest and -n/--newest", () => {
    expect(line(spec({ pattern: "firefox", flags: { oldest: true } }))).toBe("pkill -o firefox");
    expect(line(spec({ pattern: "firefox", flags: { newest: true } }))).toBe("pkill -n firefox");
  });

  it("combines multiple flags with the pattern last", () => {
    expect(line(spec({ pattern: "firefox", flags: { full: true, exact: true } }))).toBe("pkill -f -x firefox");
  });

  it("renders just the binary with no pattern", () => {
    expect(line(spec({ pattern: "" }))).toBe("pkill");
  });
});

describe("lint", () => {
  it("PKL001 catches no pattern", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("PKL001");
  });

  it("PKL001 also catches a whitespace-only pattern", () => {
    expect(lint(spec({ pattern: "   " })).diagnostics.map((d) => d.code)).toContain("PKL001");
  });

  it("PKL002 warns about substring matching without --exact", () => {
    expect(lint(spec({ pattern: "firefox" })).diagnostics.map((d) => d.code)).toContain("PKL002");
  });

  it("PKL002 does not fire when --exact is set", () => {
    expect(lint(spec({ pattern: "firefox", flags: { exact: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "PKL002",
    );
  });

  it("PKL003 warns about SIGKILL (by name or number) and the fix clears the signal", () => {
    const byName = spec({ pattern: "firefox", flags: { exact: true, signal: "KILL" } });
    expect(lint(byName).diagnostics.map((d) => d.code)).toContain("PKL003");
    const byNumber = spec({ pattern: "firefox", flags: { exact: true, signal: "9" } });
    expect(lint(byNumber).diagnostics.map((d) => d.code)).toContain("PKL003");

    const fix = lint(byName).diagnostics.find((d) => d.code === "PKL003")!.fix!;
    expect(fix.apply(byName).flags.signal).toBeUndefined();
  });

  it("PKL003 is marked destructive", () => {
    const s = spec({ pattern: "firefox", flags: { exact: true, signal: "KILL" } });
    expect(lint(s).isDestructive).toBe(true);
  });

  it("PKL004 flags --oldest and --newest together, with a fix removing one", () => {
    const s = spec({ pattern: "firefox", flags: { exact: true, oldest: true, newest: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("PKL004");
    const fix = result.diagnostics.find((d) => d.code === "PKL004")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("PKL004");
  });

  it("a pattern with --exact and no other footguns has no diagnostics", () => {
    expect(lint(spec({ pattern: "firefox", flags: { exact: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Kill by pattern' is a bare pkill", () => {
    expect(line(getPreset("kill-by-pattern")!.apply(spec()))).toBe("pkill firefox");
  });

  it("'Force kill (SIGKILL)' is --signal KILL and is flagged destructive", () => {
    const forced = getPreset("force-kill")!.apply(spec());
    expect(line(forced)).toBe("pkill --signal KILL firefox");
    expect(lint(forced).isDestructive).toBe(true);
  });

  it("'Exact name match' is -x", () => {
    expect(line(getPreset("exact-match")!.apply(spec()))).toBe("pkill -x firefox");
  });

  it("'Match full command line' is -f", () => {
    expect(line(getPreset("match-full-command")!.apply(spec()))).toBe("pkill -f backup.sh");
  });

  it("'Kill by user' is --user alice", () => {
    expect(line(getPreset("kill-by-user")!.apply(spec()))).toBe("pkill --user alice python");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ pattern: "firefox" }))).toBe('Send SIGTERM to every process matching "firefox".');
  });

  it("describes an empty pattern with the SOME_PATTERN placeholder", () => {
    expect(describeSpec(spec())).toBe('Send SIGTERM to every process matching "SOME_PATTERN".');
  });

  it("describes a custom signal", () => {
    expect(describeSpec(spec({ pattern: "firefox", flags: { signal: "KILL" } }))).toBe(
      'Send SIGKILL to every process matching "firefox".',
    );
  });

  it("mentions --full, --exact, and --user as trailing clauses", () => {
    const described = describeSpec(
      spec({ pattern: "firefox", flags: { full: true, exact: true, user: "alice" } }),
    );
    expect(described).toContain("matching against the full command line, not just the process name");
    expect(described).toContain("requiring an exact match");
    expect(described).toContain("only matching processes owned by alice");
  });

  it("describes --oldest and --newest", () => {
    expect(describeSpec(spec({ pattern: "firefox", flags: { oldest: true } }))).toBe(
      'Send SIGTERM to the oldest process matching "firefox".',
    );
    expect(describeSpec(spec({ pattern: "firefox", flags: { newest: true } }))).toBe(
      'Send SIGTERM to the newest process matching "firefox".',
    );
  });
});
