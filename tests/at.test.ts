import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type AtSpec } from "@cmdgen/at";

const line = (spec: AtSpec) => renderOneLine(buildArgv(spec), spec);

const spec = (partial: Partial<AtSpec> = {}): AtSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("schedule action — echo | at one-liner", () => {
  it("pipes the command into at at the given time", () => {
    expect(line(spec({ action: "schedule", time: "now + 1 hour", command: "run the backup script" }))).toBe(
      "echo 'run the backup script' | at now + 1 hour",
    );
  });

  it("splits a multi-word time spec into separate bare words", () => {
    expect(line(spec({ action: "schedule", time: "10:00", command: "echo hi" }))).toBe(
      "echo 'echo hi' | at 10:00",
    );
  });

  it("quotes a command containing a single quote", () => {
    expect(line(spec({ action: "schedule", time: "now", command: "it's done" }))).toBe(
      "echo 'it'\\''s done' | at now",
    );
  });

  it("renders just the bare 'at TIME' with no echo prefix when command is blank", () => {
    expect(line(spec({ action: "schedule", time: "now + 1 hour", command: "" }))).toBe("at now + 1 hour");
  });

  it("renders just 'at' with no time or command at all", () => {
    expect(line(spec({ action: "schedule" }))).toBe("at");
  });

  it("trims whitespace from time and command", () => {
    expect(line(spec({ action: "schedule", time: "  now  ", command: "  do it  " }))).toBe("echo 'do it' | at now");
  });
});

describe("list action — mirrors atq", () => {
  it("renders atq with no arguments", () => {
    expect(line(spec({ action: "list" }))).toBe("atq");
  });

  it("ignores time/command entirely", () => {
    expect(line(spec({ action: "list", time: "now", command: "echo hi" }))).toBe("atq");
  });
});

describe("remove action — mirrors atrm JOB", () => {
  it("renders atrm with the job id", () => {
    expect(line(spec({ action: "remove", jobId: "3" }))).toBe("atrm 3");
  });

  it("renders just atrm with no job id", () => {
    expect(line(spec({ action: "remove" }))).toBe("atrm");
  });

  it("trims whitespace from jobId", () => {
    expect(line(spec({ action: "remove", jobId: "  3  " }))).toBe("atrm 3");
  });
});

describe("lint", () => {
  it("AT001 catches no time for the schedule action", () => {
    expect(lint(spec({ action: "schedule", command: "echo hi" })).diagnostics.map((d) => d.code)).toContain(
      "AT001",
    );
  });

  it("AT002 catches no command for the schedule action", () => {
    expect(lint(spec({ action: "schedule", time: "now" })).diagnostics.map((d) => d.code)).toContain("AT002");
  });

  it("AT001/AT002 do not fire for list or remove", () => {
    expect(lint(spec({ action: "list" })).diagnostics.map((d) => d.code)).not.toContain("AT001");
    expect(lint(spec({ action: "remove", jobId: "1" })).diagnostics.map((d) => d.code)).not.toContain("AT002");
  });

  it("AT003 catches no job id for the remove action", () => {
    expect(lint(spec({ action: "remove" })).diagnostics.map((d) => d.code)).toContain("AT003");
  });

  it("AT004 warns on remove, and is not destructive-level", () => {
    const s = spec({ action: "remove", jobId: "3" });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("AT004");
    expect(result.isDestructive).toBe(false);
    expect(result.diagnostics.find((d) => d.code === "AT004")!.level).toBe("warning");
  });

  it("a fully specified schedule has no diagnostics", () => {
    expect(lint(spec({ action: "schedule", time: "now", command: "echo hi" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Schedule a one-off job' pipes into at with a relative time", () => {
    expect(line(getPreset("schedule-relative-time")!.apply(spec()))).toBe(
      "echo 'run the backup script' | at now + 1 hour",
    );
  });

  it("'Schedule for a specific time' pipes into at with a clock time", () => {
    expect(line(getPreset("schedule-specific-time")!.apply(spec()))).toBe(
      "echo 'systemctl restart nginx' | at 22:00",
    );
  });

  it("'List scheduled jobs' is atq", () => {
    expect(line(getPreset("list-scheduled-jobs")!.apply(spec()))).toBe("atq");
  });

  it("'Cancel a scheduled job' is atrm 3 and warns via AT004", () => {
    const s = getPreset("cancel-a-job")!.apply(spec());
    expect(line(s)).toBe("atrm 3");
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("AT004");
  });
});

describe("describeSpec", () => {
  it("describes a scheduled job", () => {
    expect(describeSpec(spec({ action: "schedule", time: "now + 1 hour", command: "run the backup script" }))).toBe(
      'Schedule "run the backup script" to run once at now + 1 hour.',
    );
  });

  it("describes an empty schedule with placeholders", () => {
    expect(describeSpec(spec({ action: "schedule" }))).toBe("Schedule \"SOME_COMMAND\" to run once at SOME_TIME.");
  });

  it("describes list", () => {
    expect(describeSpec(spec({ action: "list" }))).toBe("List every job currently scheduled with at.");
  });

  it("describes remove, falling back to a placeholder when jobId is blank", () => {
    expect(describeSpec(spec({ action: "remove", jobId: "3" }))).toBe("Cancel scheduled job 3.");
    expect(describeSpec(spec({ action: "remove" }))).toBe("Cancel scheduled job SOME_JOB_ID.");
  });
});
