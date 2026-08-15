import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type RsyslogdSpec } from "@cmdgen/rsyslogd";

const line = (spec: RsyslogdSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<RsyslogdSpec> = {}): RsyslogdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare rsyslogd with no flags", () => {
    expect(line(spec())).toBe("rsyslogd");
  });

  it("renders -n, -f, -N, -d", () => {
    expect(line(spec({ flags: { foreground: true } }))).toBe("rsyslogd -n");
    expect(line(spec({ flags: { configFile: "/etc/rsyslog.conf" } }))).toBe("rsyslogd -f /etc/rsyslog.conf");
    expect(line(spec({ flags: { checkConfig: 1 } }))).toBe("rsyslogd -N 1");
    expect(line(spec({ flags: { debug: true } }))).toBe("rsyslogd -d");
  });

  it("combines flags in fixed catalogue order: -n -f -N -d", () => {
    expect(
      line(spec({ flags: { debug: true, checkConfig: 2, foreground: true, configFile: "/etc/rsyslog.conf" } })),
    ).toBe("rsyslogd -n -f /etc/rsyslog.conf -N 2 -d");
  });
});

describe("lint", () => {
  it("RSL001 warns when -N is combined with -n", () => {
    const diagnostics = lint(spec({ flags: { checkConfig: 1, foreground: true } })).diagnostics;
    expect(diagnostics.map((d) => d.code)).toContain("RSL001");
    expect(diagnostics.find((d) => d.code === "RSL001")!.level).toBe("warning");
  });

  it("RSL001 warns when -N is combined with -d", () => {
    expect(lint(spec({ flags: { checkConfig: 1, debug: true } })).diagnostics.map((d) => d.code)).toContain("RSL001");
  });

  it("RSL001 does not fire for -N alone", () => {
    expect(lint(spec({ flags: { checkConfig: 1 } })).diagnostics).toEqual([]);
  });

  it("RSL001 does not fire for -n/-d without -N", () => {
    expect(lint(spec({ flags: { foreground: true, debug: true } })).diagnostics).toEqual([]);
  });

  it("RSL001's fix removes -n and -d, keeping -N", () => {
    const withConflict = spec({ flags: { checkConfig: 1, foreground: true, debug: true } });
    const diagnostic = lint(withConflict).diagnostics.find((d) => d.code === "RSL001");
    expect(diagnostic?.fix).toBeDefined();
    const fixed = diagnostic!.fix!.apply(withConflict);
    expect(fixed.flags).toEqual({ checkConfig: 1 });
  });

  it("a plain rsyslogd has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Run in foreground' is -n", () => {
    expect(line(getPreset("run-in-foreground")!.apply(spec()))).toBe("rsyslogd -n");
  });

  it("'Validate config' is -f then -N", () => {
    expect(line(getPreset("validate-config")!.apply(spec()))).toBe("rsyslogd -f /etc/rsyslog.conf -N 1");
  });

  it("'Debug mode' is -n -d", () => {
    expect(line(getPreset("debug-mode")!.apply(spec()))).toBe("rsyslogd -n -d");
  });

  it("'Use a custom config file' is -f alone", () => {
    expect(line(getPreset("custom-config-file")!.apply(spec()))).toBe("rsyslogd -f /etc/rsyslog-test.conf");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Run rsyslogd.");
  });

  it("describes -n", () => {
    expect(describeSpec(spec({ flags: { foreground: true } }))).toBe(
      "Run rsyslogd, staying in the foreground instead of daemonizing.",
    );
  });

  it("describes -N, ignoring -n/-d for the description since they have no effect together", () => {
    expect(describeSpec(spec({ flags: { checkConfig: 1, foreground: true } }))).toBe(
      "Run rsyslogd, validating the config (level 1) and exiting without actually starting logging.",
    );
  });

  it("describes -f alongside other flags", () => {
    expect(describeSpec(spec({ flags: { foreground: true, configFile: "/etc/rsyslog.conf" } }))).toBe(
      "Run rsyslogd, staying in the foreground instead of daemonizing, using the config file /etc/rsyslog.conf.",
    );
  });
});
