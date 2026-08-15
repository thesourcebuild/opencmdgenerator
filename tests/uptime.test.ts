import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type UptimeSpec } from "@cmdgen/uptime";

const line = (spec: UptimeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<UptimeSpec> = {}): UptimeSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare uptime with no flags renders just the binary", () => {
    expect(line(spec())).toBe("uptime");
  });

  it("renders -p and -s as bare boolean flags", () => {
    expect(line(spec({ flags: { pretty: true } }))).toBe("uptime -p");
    expect(line(spec({ flags: { since: true } }))).toBe("uptime -s");
  });
});

describe("lint", () => {
  it("UPT001 catches -p with -s, and its fix removes -s", () => {
    const s = spec({ flags: { pretty: true, since: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("UPT001");
    const diag = result.diagnostics.find((d) => d.code === "UPT001")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("UPT001");
  });

  it("a bare uptime, or one flag alone, has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { pretty: true } })).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { since: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Default one-line summary' has no flags", () => {
    expect(line(getPreset("default-summary")!.apply(spec()))).toBe("uptime");
  });

  it("'Human-readable uptime' is -p", () => {
    expect(line(getPreset("pretty-uptime")!.apply(spec()))).toBe("uptime -p");
  });

  it("'Show boot time' is -s", () => {
    expect(line(getPreset("since-boot")!.apply(spec()))).toBe("uptime -s");
  });
});

describe("describeSpec", () => {
  it("describes the default one-line summary", () => {
    expect(describeSpec(spec())).toBe(
      "Show the current time, how long the system has been up, logged-in users, and load averages.",
    );
  });

  it("describes -p", () => {
    expect(describeSpec(spec({ flags: { pretty: true } }))).toBe(
      "Show how long the system has been up, in a human-friendly phrase.",
    );
  });

  it("describes -s", () => {
    expect(describeSpec(spec({ flags: { since: true } }))).toBe("Show the system boot time.");
  });
});
