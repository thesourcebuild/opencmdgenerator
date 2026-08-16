import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type SystemctlSpec } from "@cmdgen/systemctl";

const line = (spec: SystemctlSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<SystemctlSpec> = {}): SystemctlSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action/unit rendering — action comes first, unlike service", () => {
  it("renders the start action", () => {
    expect(line(spec({ unit: "nginx", action: "start" }))).toBe("systemctl start nginx");
  });

  it("renders the stop action", () => {
    expect(line(spec({ unit: "nginx", action: "stop" }))).toBe("systemctl stop nginx");
  });

  it("renders the restart action", () => {
    expect(line(spec({ unit: "nginx", action: "restart" }))).toBe("systemctl restart nginx");
  });

  it("renders the reload action", () => {
    expect(line(spec({ unit: "nginx", action: "reload" }))).toBe("systemctl reload nginx");
  });

  it("renders enable and disable", () => {
    expect(line(spec({ unit: "nginx", action: "enable" }))).toBe("systemctl enable nginx");
    expect(line(spec({ unit: "nginx", action: "disable" }))).toBe("systemctl disable nginx");
  });

  it("renders is-active", () => {
    expect(line(spec({ unit: "nginx", action: "is-active" }))).toBe("systemctl is-active nginx");
  });

  it("renders the status action (also the default)", () => {
    expect(line(spec({ unit: "nginx", action: "status" }))).toBe("systemctl status nginx");
    expect(line(spec({ unit: "nginx" }))).toBe("systemctl status nginx");
  });

  it("renders daemon-reload with no unit, even if unit is set", () => {
    expect(line(spec({ action: "daemon-reload" }))).toBe("systemctl daemon-reload");
    expect(line(spec({ unit: "nginx", action: "daemon-reload" }))).toBe("systemctl daemon-reload");
  });

  it("trims whitespace from unit, and omits it entirely when blank", () => {
    expect(line(spec({ unit: "  nginx  ", action: "restart" }))).toBe("systemctl restart nginx");
    expect(line(spec())).toBe("systemctl status");
  });

  it("renders global options before the action and multiple positional arguments after it", () => {
    expect(
      line(
        spec({
          action: "set-property",
          targets: ["nginx.service", "CPUWeight=200", "MemoryMax=2G"],
          flags: { runtime: true, noBlock: true },
        }),
      ),
    ).toBe("systemctl --no-block --runtime set-property nginx.service CPUWeight=200 MemoryMax=2G");
  });

  it("supports list/show-style commands and advanced passthrough options", () => {
    expect(line(spec({ action: "list-units", flags: { type: "service,timer", state: "failed", all: true } }))).toBe(
      "systemctl -a --state=failed --type=service,timer list-units",
    );
    expect(line(spec({ action: "show", targets: ["nginx.service"], extraOptions: ["--timestamp=utc"] }))).toBe(
      "systemctl --timestamp=utc show nginx.service",
    );
  });
});

describe("lint", () => {
  it("SCT001 catches an empty or whitespace-only argument for actions that require one", () => {
    expect(lint(spec({ action: "start" })).diagnostics.map((d) => d.code)).toContain("SCT001");
    expect(lint(spec({ action: "start", unit: "   " })).diagnostics.map((d) => d.code)).toContain("SCT001");
  });

  it("SCT001 does not fire for daemon-reload, which needs no unit", () => {
    expect(lint(spec({ action: "daemon-reload" })).diagnostics.map((d) => d.code)).not.toContain("SCT001");
  });

  it("SCT002 warns on stop and disable", () => {
    expect(lint(spec({ unit: "nginx", action: "stop" })).diagnostics.map((d) => d.code)).toContain("SCT002");
    expect(lint(spec({ unit: "nginx", action: "disable" })).diagnostics.map((d) => d.code)).toContain("SCT002");
  });

  it("SCT002 does not fire for start/status/enable checks", () => {
    for (const action of ["start", "status", "enable", "is-active"] as const) {
      expect(lint(spec({ unit: "nginx", action })).diagnostics.map((d) => d.code)).not.toContain("SCT002");
    }
  });

  it("SCT002 warns on restart-like operations", () => {
    expect(lint(spec({ unit: "nginx", action: "restart" })).diagnostics.map((d) => d.code)).toContain("SCT002");
  });

  it("SCT003 warns on disruptive options", () => {
    expect(lint(spec({ action: "clean", unit: "nginx", flags: { what: "all" } })).diagnostics.map((d) => d.code)).toContain(
      "SCT003",
    );
  });

  it("a plain status check has no diagnostics", () => {
    expect(lint(spec({ unit: "nginx", action: "status" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Restart a unit' is systemctl restart nginx", () => {
    expect(line(getPreset("restart-a-unit")!.apply(spec()))).toBe("systemctl restart nginx");
  });

  it("'Check a unit's status' is systemctl status nginx", () => {
    expect(line(getPreset("check-status")!.apply(spec()))).toBe("systemctl status nginx");
  });

  it("'Enable at boot' is systemctl enable nginx", () => {
    expect(line(getPreset("enable-at-boot")!.apply(spec()))).toBe("systemctl enable nginx");
  });

  it("'Stop a unit' is systemctl stop nginx and warns via SCT002", () => {
    const s = getPreset("stop-a-unit")!.apply(spec());
    expect(line(s)).toBe("systemctl stop nginx");
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("SCT002");
  });

  it("'Reload systemd's daemon' is systemctl daemon-reload", () => {
    expect(line(getPreset("reload-daemon")!.apply(spec()))).toBe("systemctl daemon-reload");
  });
});

describe("describeSpec", () => {
  it("describes start/stop/restart/reload", () => {
    expect(describeSpec(spec({ unit: "nginx", action: "start" }))).toBe("Start the nginx unit.");
    expect(describeSpec(spec({ unit: "nginx", action: "stop" }))).toBe("Stop the nginx unit.");
    expect(describeSpec(spec({ unit: "nginx", action: "restart" }))).toBe("Restart the nginx unit.");
    expect(describeSpec(spec({ unit: "nginx", action: "reload" }))).toBe(
      "Reload the nginx unit's configuration without a full restart.",
    );
  });

  it("describes enable/disable", () => {
    expect(describeSpec(spec({ unit: "nginx", action: "enable" }))).toBe(
      "Enable the nginx unit to start automatically at boot.",
    );
    expect(describeSpec(spec({ unit: "nginx", action: "disable" }))).toBe(
      "Disable the nginx unit from starting automatically at boot.",
    );
  });

  it("describes status and is-active, falling back to SOME_UNIT when blank", () => {
    expect(describeSpec(spec({ unit: "nginx", action: "status" }))).toBe("Show the nginx unit's current status.");
    expect(describeSpec(spec())).toBe("Show the SOME_UNIT unit's current status.");
    expect(describeSpec(spec({ unit: "nginx", action: "is-active" }))).toBe(
      "Check whether the nginx unit is currently active.",
    );
  });

  it("describes daemon-reload without mentioning any unit", () => {
    expect(describeSpec(spec({ unit: "nginx", action: "daemon-reload" }))).toBe(
      "Reload systemd's unit configuration from disk, without starting, stopping, or restarting any unit.",
    );
  });
});
