import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type HaltSpec } from "@cmdgen/halt";

const line = (spec: HaltSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<HaltSpec> = {}): HaltSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flag rendering", () => {
  it("a bare halt renders no flags", () => {
    expect(line(spec())).toBe("halt");
  });

  it("renders -f", () => {
    expect(line(spec({ flags: { force: true } }))).toBe("halt -f");
  });

  it("renders -n", () => {
    expect(line(spec({ flags: { noSync: true } }))).toBe("halt -n");
  });

  it("renders -w", () => {
    expect(line(spec({ flags: { wtmpOnly: true } }))).toBe("halt -w");
  });

  it("combines -f and -n", () => {
    expect(line(spec({ flags: { force: true, noSync: true } }))).toBe("halt -f -n");
  });
});

describe("lint", () => {
  it("HLT001 always fires when -w is not set", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("HLT001");
    expect(lint(spec({ flags: { force: true } })).diagnostics.map((d) => d.code)).toContain("HLT001");
  });

  it("HLT001 has no fix — there is no safer flag combination", () => {
    const diag = lint(spec()).diagnostics.find((d) => d.code === "HLT001");
    expect(diag?.fix).toBeUndefined();
  });

  it("HLT001 stands down when -w is set", () => {
    expect(lint(spec({ flags: { wtmpOnly: true } })).diagnostics.map((d) => d.code)).not.toContain("HLT001");
  });

  it("HLT002 fires only when -w is set", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("HLT002");
    expect(lint(spec({ flags: { wtmpOnly: true } })).diagnostics.map((d) => d.code)).toContain("HLT002");
  });

  it("HLT003 fires for --no-sync, and its fix removes the flag", () => {
    const before = spec({ flags: { noSync: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("HLT003");
    const diag = lint(before).diagnostics.find((d) => d.code === "HLT003")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("HLT003");
    expect(line(fixed)).toBe("halt");
  });

  it("HLT003 stands down when -w is also set", () => {
    expect(lint(spec({ flags: { noSync: true, wtmpOnly: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "HLT003",
    );
  });

  it("HLT004 fires for --force, and its fix removes the flag", () => {
    const before = spec({ flags: { force: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("HLT004");
    const diag = lint(before).diagnostics.find((d) => d.code === "HLT004")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("HLT004");
    expect(line(fixed)).toBe("halt");
  });

  it("HLT004 stands down when -w is also set", () => {
    expect(lint(spec({ flags: { force: true, wtmpOnly: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "HLT004",
    );
  });

  it("a bare halt has exactly the unconditional destructive diagnostic", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toEqual(["HLT001"]);
  });
});

describe("presets", () => {
  it("'Halt normally' is a bare halt", () => {
    expect(line(getPreset("halt-normally")!.apply(spec()))).toBe("halt");
  });

  it("'Force an immediate halt' is -f", () => {
    expect(line(getPreset("force-halt")!.apply(spec()))).toBe("halt -f");
  });

  it("'Halt without syncing disks' is -n", () => {
    expect(line(getPreset("no-sync-halt")!.apply(spec()))).toBe("halt -n");
  });

  it("'Log a halt without actually halting' is -w", () => {
    expect(line(getPreset("wtmp-only-record")!.apply(spec()))).toBe("halt -w");
  });
});

describe("describeSpec", () => {
  it("describes a bare halt", () => {
    expect(describeSpec(spec())).toBe("Halt the machine, ending the current session.");
  });

  it("describes -f", () => {
    expect(describeSpec(spec({ flags: { force: true } }))).toBe(
      "Halt the machine, immediately, without going through systemd/logind, ending the current session.",
    );
  });

  it("describes -n", () => {
    expect(describeSpec(spec({ flags: { noSync: true } }))).toBe(
      "Halt the machine, without syncing filesystem buffers first, ending the current session.",
    );
  });

  it("describes -w as not actually halting", () => {
    expect(describeSpec(spec({ flags: { wtmpOnly: true } }))).toBe(
      "Only record a halt in wtmp — the machine is not actually halted.",
    );
  });
});
