import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PoweroffSpec } from "@cmdgen/poweroff";

const line = (spec: PoweroffSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PoweroffSpec> = {}): PoweroffSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flag rendering", () => {
  it("a bare poweroff renders no flags", () => {
    expect(line(spec())).toBe("poweroff");
  });

  it("renders -f", () => {
    expect(line(spec({ flags: { force: true } }))).toBe("poweroff -f");
  });

  it("renders -n", () => {
    expect(line(spec({ flags: { noSync: true } }))).toBe("poweroff -n");
  });

  it("renders -w", () => {
    expect(line(spec({ flags: { wtmpOnly: true } }))).toBe("poweroff -w");
  });

  it("combines -f and -n", () => {
    expect(line(spec({ flags: { force: true, noSync: true } }))).toBe("poweroff -f -n");
  });
});

describe("lint", () => {
  it("PWO001 always fires when -w is not set", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("PWO001");
    expect(lint(spec({ flags: { force: true } })).diagnostics.map((d) => d.code)).toContain("PWO001");
  });

  it("PWO001 has no fix — there is no safer flag combination", () => {
    const diag = lint(spec()).diagnostics.find((d) => d.code === "PWO001");
    expect(diag?.fix).toBeUndefined();
  });

  it("PWO001 stands down when -w is set", () => {
    expect(lint(spec({ flags: { wtmpOnly: true } })).diagnostics.map((d) => d.code)).not.toContain("PWO001");
  });

  it("PWO002 fires only when -w is set", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("PWO002");
    expect(lint(spec({ flags: { wtmpOnly: true } })).diagnostics.map((d) => d.code)).toContain("PWO002");
  });

  it("PWO003 fires for --no-sync, and its fix removes the flag", () => {
    const before = spec({ flags: { noSync: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("PWO003");
    const diag = lint(before).diagnostics.find((d) => d.code === "PWO003")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("PWO003");
    expect(line(fixed)).toBe("poweroff");
  });

  it("PWO003 stands down when -w is also set", () => {
    expect(lint(spec({ flags: { noSync: true, wtmpOnly: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "PWO003",
    );
  });

  it("PWO004 fires for --force, and its fix removes the flag", () => {
    const before = spec({ flags: { force: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("PWO004");
    const diag = lint(before).diagnostics.find((d) => d.code === "PWO004")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("PWO004");
    expect(line(fixed)).toBe("poweroff");
  });

  it("PWO004 stands down when -w is also set", () => {
    expect(lint(spec({ flags: { force: true, wtmpOnly: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "PWO004",
    );
  });

  it("a bare poweroff has exactly the unconditional destructive diagnostic", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toEqual(["PWO001"]);
  });
});

describe("presets", () => {
  it("'Power off normally' is a bare poweroff", () => {
    expect(line(getPreset("poweroff-normally")!.apply(spec()))).toBe("poweroff");
  });

  it("'Force an immediate power-off' is -f", () => {
    expect(line(getPreset("force-poweroff")!.apply(spec()))).toBe("poweroff -f");
  });

  it("'Power off without syncing disks' is -n", () => {
    expect(line(getPreset("no-sync-poweroff")!.apply(spec()))).toBe("poweroff -n");
  });

  it("'Log a power-off without actually powering off' is -w", () => {
    expect(line(getPreset("wtmp-only-record")!.apply(spec()))).toBe("poweroff -w");
  });
});

describe("describeSpec", () => {
  it("describes a bare poweroff", () => {
    expect(describeSpec(spec())).toBe("Power off the machine, ending the current session.");
  });

  it("describes -f", () => {
    expect(describeSpec(spec({ flags: { force: true } }))).toBe(
      "Power off the machine, immediately, without going through systemd/logind, ending the current session.",
    );
  });

  it("describes -n", () => {
    expect(describeSpec(spec({ flags: { noSync: true } }))).toBe(
      "Power off the machine, without syncing filesystem buffers first, ending the current session.",
    );
  });

  it("describes -w as not actually powering off", () => {
    expect(describeSpec(spec({ flags: { wtmpOnly: true } }))).toBe(
      "Only record a power-off in wtmp — the machine is not actually powered off.",
    );
  });
});
