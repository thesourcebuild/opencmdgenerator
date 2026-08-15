import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type KillallSpec } from "@cmdgen/killall";

const line = (spec: KillallSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<KillallSpec> = {}): KillallSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("processName and flags", () => {
  it("a bare process name with no flags", () => {
    expect(line(spec({ processName: "firefox" }))).toBe("killall firefox");
  });

  it("renders -i, -v, -q", () => {
    expect(line(spec({ processName: "firefox", flags: { interactive: true } }))).toBe("killall -i firefox");
    expect(line(spec({ processName: "firefox", flags: { verbose: true } }))).toBe("killall -v firefox");
    expect(line(spec({ processName: "firefox", flags: { quiet: true } }))).toBe("killall -q firefox");
  });

  it("renders -s as a detached short-form text value", () => {
    expect(line(spec({ processName: "firefox", flags: { signal: "KILL" } }))).toBe("killall -s KILL firefox");
  });

  it("renders --older-than and --younger-than as detached long-form text values", () => {
    expect(line(spec({ processName: "firefox", flags: { olderThan: "1h" } }))).toBe("killall --older-than 1h firefox");
    expect(line(spec({ processName: "firefox", flags: { youngerThan: "5m" } }))).toBe(
      "killall --younger-than 5m firefox",
    );
  });

  it("renders --user as a detached long-form text value", () => {
    expect(line(spec({ processName: "firefox", flags: { user: "alice" } }))).toBe("killall --user alice firefox");
  });

  it("combines multiple flags with the process name last", () => {
    expect(line(spec({ processName: "firefox", flags: { interactive: true, signal: "KILL" } }))).toBe(
      "killall -i -s KILL firefox",
    );
  });
});

describe("lint", () => {
  it("KILLALL001 catches no process name", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("KILLALL001");
  });

  it("KILLALL001 also catches a whitespace-only process name", () => {
    expect(lint(spec({ processName: "   " })).diagnostics.map((d) => d.code)).toContain("KILLALL001");
  });

  it("a plain killall has no diagnostics", () => {
    expect(lint(spec({ processName: "firefox" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Kill by name' is a bare killall", () => {
    expect(line(getPreset("kill-by-name")!.apply(spec()))).toBe("killall firefox");
  });

  it("'Force kill (SIGKILL)' is -s KILL", () => {
    expect(line(getPreset("force-kill")!.apply(spec()))).toBe("killall -s KILL firefox");
  });

  it("'Confirm before each kill' is -i", () => {
    expect(line(getPreset("interactive-confirm")!.apply(spec()))).toBe("killall -i firefox");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ processName: "firefox" }))).toBe("Send SIGTERM to every process named firefox.");
  });

  it("describes an empty process name with the SOME_PROCESS placeholder", () => {
    expect(describeSpec(spec())).toBe("Send SIGTERM to every process named SOME_PROCESS.");
  });

  it("describes a custom signal", () => {
    expect(describeSpec(spec({ processName: "firefox", flags: { signal: "KILL" } }))).toContain(
      "sending SIGKILL instead of the default SIGTERM",
    );
  });

  it("describes interactive, quiet, verbose, and age filters as trailing clauses", () => {
    const described = describeSpec(
      spec({
        processName: "firefox",
        flags: { interactive: true, quiet: true, verbose: true, olderThan: "1h", youngerThan: "5m" },
      }),
    );
    expect(described).toContain("asking for confirmation before each kill");
    expect(described).toContain("without complaining if nothing matches");
    expect(described).toContain("reporting whether each signal was successfully sent");
    expect(described).toContain("only matching processes older than 1h");
    expect(described).toContain("only matching processes younger than 5m");
  });
});
