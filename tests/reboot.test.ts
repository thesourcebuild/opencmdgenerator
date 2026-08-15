import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type RebootSpec } from "@cmdgen/reboot";

const line = (spec: RebootSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<RebootSpec> = {}): RebootSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flag rendering", () => {
  it("a bare reboot renders no flags", () => {
    expect(line(spec())).toBe("reboot");
  });

  it("renders -f", () => {
    expect(line(spec({ flags: { force: true } }))).toBe("reboot -f");
  });

  it("renders -n", () => {
    expect(line(spec({ flags: { noSync: true } }))).toBe("reboot -n");
  });

  it("combines -f and -n", () => {
    expect(line(spec({ flags: { force: true, noSync: true } }))).toBe("reboot -f -n");
  });
});

describe("lint", () => {
  it("RBT001 always fires, unconditionally", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("RBT001");
    expect(lint(spec({ flags: { force: true, noSync: true } })).diagnostics.map((d) => d.code)).toContain("RBT001");
  });

  it("RBT001 has no fix — there is no safer flag combination", () => {
    const diag = lint(spec()).diagnostics.find((d) => d.code === "RBT001");
    expect(diag?.fix).toBeUndefined();
  });

  it("RBT002 fires for --no-sync, and its fix removes the flag", () => {
    const before = spec({ flags: { noSync: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("RBT002");
    const diag = lint(before).diagnostics.find((d) => d.code === "RBT002")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("RBT002");
    expect(line(fixed)).toBe("reboot");
  });

  it("RBT003 fires for --force, and its fix removes the flag", () => {
    const before = spec({ flags: { force: true } });
    expect(lint(before).diagnostics.map((d) => d.code)).toContain("RBT003");
    const diag = lint(before).diagnostics.find((d) => d.code === "RBT003")!;
    const fixed = diag.fix!.apply(before);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("RBT003");
    expect(line(fixed)).toBe("reboot");
  });

  it("a bare reboot has exactly the unconditional destructive diagnostic", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toEqual(["RBT001"]);
  });
});

describe("presets", () => {
  it("'Reboot normally' is a bare reboot", () => {
    expect(line(getPreset("reboot-normally")!.apply(spec()))).toBe("reboot");
  });

  it("'Force an immediate reboot' is -f", () => {
    expect(line(getPreset("force-reboot")!.apply(spec()))).toBe("reboot -f");
  });

  it("'Reboot without syncing disks' is -n", () => {
    expect(line(getPreset("no-sync-reboot")!.apply(spec()))).toBe("reboot -n");
  });
});

describe("describeSpec", () => {
  it("describes a bare reboot", () => {
    expect(describeSpec(spec())).toBe("Reboot the machine, ending the current session.");
  });

  it("describes -f", () => {
    expect(describeSpec(spec({ flags: { force: true } }))).toBe(
      "Reboot the machine, immediately, without going through systemd/logind, ending the current session.",
    );
  });

  it("describes -n", () => {
    expect(describeSpec(spec({ flags: { noSync: true } }))).toBe(
      "Reboot the machine, without syncing filesystem buffers first, ending the current session.",
    );
  });
});
