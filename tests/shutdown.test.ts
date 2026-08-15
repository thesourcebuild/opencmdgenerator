import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ShutdownSpec } from "@cmdgen/shutdown";

const line = (spec: ShutdownSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ShutdownSpec> = {}): ShutdownSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("argv/render — scheduling", () => {
  it("a bare schedule with default time renders 'shutdown now'", () => {
    expect(line(spec())).toBe("shutdown now");
  });

  it("renders -h with a time", () => {
    expect(line(spec({ time: "+10", flags: { halt: true } }))).toBe("shutdown -h +10");
  });

  it("renders -r with a time", () => {
    expect(line(spec({ time: "+5", flags: { reboot: true } }))).toBe("shutdown -r +5");
  });

  it("renders -k (dry run) with a time", () => {
    expect(line(spec({ time: "+15", flags: { dryRun: true } }))).toBe("shutdown -k +15");
  });

  it("combines -h and -k", () => {
    expect(line(spec({ time: "+2", flags: { halt: true, dryRun: true } }))).toBe("shutdown -h -k +2");
  });

  it("an empty time renders no time token", () => {
    expect(line(spec({ time: "" }))).toBe("shutdown");
  });

  it("a message with spaces is quoted as a single token", () => {
    expect(line(spec({ time: "+5", message: "Maintenance starting soon" }))).toBe(
      "shutdown +5 'Maintenance starting soon'",
    );
  });

  it("trims whitespace from time and message", () => {
    expect(line(spec({ time: "  +5  ", message: "  hi  " }))).toBe("shutdown +5 hi");
  });
});

describe("argv/render — cancelling", () => {
  it("cancel with no message renders bare -c", () => {
    expect(line(spec({ action: "cancel" }))).toBe("shutdown -c");
  });

  it("cancel with a message appends it as a single quoted token", () => {
    expect(line(spec({ action: "cancel", message: "false alarm" }))).toBe("shutdown -c 'false alarm'");
  });

  it("cancel ignores time/-h/-r/-k entirely — only -c and message render", () => {
    expect(line(spec({ action: "cancel", time: "+5", flags: { halt: true, dryRun: true } }))).toBe("shutdown -c");
  });
});

describe("lint", () => {
  it("SHD001 fires when both -h and -r are set, and its fix keeps -h", () => {
    const before = spec({ flags: { halt: true, reboot: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("SHD001");
    const diag = lint(before).diagnostics.find((d) => d.code === "SHD001")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("SHD001");
    expect(line(fixed)).toBe("shutdown -h now");
  });

  it("SHD002 fires when cancelling with schedule-only fields set, and its fix clears them", () => {
    const before = spec({ action: "cancel", time: "+5", flags: { halt: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("SHD002");
    const diag = lint(before).diagnostics.find((d) => d.code === "SHD002")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("SHD002");
    expect(line(fixed)).toBe("shutdown -c");
  });

  it("SHD002 does not fire for a plain cancel", () => {
    expect(lint(spec({ action: "cancel" })).diagnostics.map((d) => d.code)).not.toContain("SHD002");
  });

  it("SHD003 always fires for a schedule action without -k", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("SHD003");
    expect(lint(spec({ flags: { reboot: true } })).diagnostics.map((d) => d.code)).toContain("SHD003");
  });

  it("SHD003 has no fix — there is no safer flag combination", () => {
    const diag = lint(spec()).diagnostics.find((d) => d.code === "SHD003");
    expect(diag?.fix).toBeUndefined();
  });

  it("SHD003 stands down when -k is set", () => {
    expect(lint(spec({ flags: { dryRun: true } })).diagnostics.map((d) => d.code)).not.toContain("SHD003");
  });

  it("SHD003 never fires for a cancel action", () => {
    expect(lint(spec({ action: "cancel" })).diagnostics.map((d) => d.code)).not.toContain("SHD003");
  });

  it("SHD004 fires only when -k is set on a schedule action", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("SHD004");
    expect(lint(spec({ flags: { dryRun: true } })).diagnostics.map((d) => d.code)).toContain("SHD004");
    expect(lint(spec({ action: "cancel" })).diagnostics.map((d) => d.code)).not.toContain("SHD004");
  });

  it("a bare schedule has exactly the unconditional destructive diagnostic", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toEqual(["SHD003"]);
  });

  it("a bare cancel has no diagnostics", () => {
    expect(lint(spec({ action: "cancel" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Power off immediately' is shutdown now", () => {
    expect(line(getPreset("power-off-now")!.apply(spec()))).toBe("shutdown now");
  });

  it("'Reboot in 5 minutes' is -r +5", () => {
    expect(line(getPreset("reboot-in-5")!.apply(spec()))).toBe("shutdown -r +5");
  });

  it("'Halt in 10 minutes with a warning' is -h +10 with a quoted message", () => {
    expect(line(getPreset("halt-with-message")!.apply(spec()))).toBe("shutdown -h +10 'Maintenance starting soon'");
  });

  it("'Rehearse the warning without shutting down' is -k with a quoted message", () => {
    expect(line(getPreset("dry-run-warning")!.apply(spec()))).toBe("shutdown -k +15 'Test broadcast'");
  });

  it("'Cancel a pending shutdown' is -c", () => {
    expect(line(getPreset("cancel-shutdown")!.apply(spec()))).toBe("shutdown -c");
  });
});

describe("describeSpec", () => {
  it("describes a bare schedule", () => {
    expect(describeSpec(spec())).toBe("Power off the machine at now.");
  });

  it("describes -h", () => {
    expect(describeSpec(spec({ time: "+10", flags: { halt: true } }))).toBe("Halt the machine at +10.");
  });

  it("describes -r", () => {
    expect(describeSpec(spec({ time: "+5", flags: { reboot: true } }))).toBe("Reboot the machine at +5.");
  });

  it("describes a message being broadcast", () => {
    expect(describeSpec(spec({ time: "+5", message: "hi" }))).toBe('Power off the machine at +5, broadcasting "hi".');
  });

  it("describes -k as a rehearsal that does not actually act", () => {
    expect(describeSpec(spec({ time: "+15", flags: { dryRun: true } }))).toBe(
      "Broadcast a warning that the machine would power off at +15, without actually doing it.",
    );
  });

  it("describes cancelling", () => {
    expect(describeSpec(spec({ action: "cancel" }))).toBe("Cancel the pending shutdown.");
  });

  it("describes cancelling with a message", () => {
    expect(describeSpec(spec({ action: "cancel", message: "false alarm" }))).toBe(
      'Cancel the pending shutdown, broadcasting "false alarm".',
    );
  });
});
