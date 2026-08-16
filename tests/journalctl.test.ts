import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type JournalctlSpec } from "@cmdgen/journalctl";

const line = (spec: JournalctlSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<JournalctlSpec> = {}): JournalctlSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("unit and flags", () => {
  it("a bare journalctl with no unit or flags", () => {
    expect(line(spec())).toBe("journalctl");
  });

  it("renders -u UNIT last", () => {
    expect(line(spec({ unit: "nginx" }))).toBe("journalctl -u nginx");
  });

  it("renders -f/--follow", () => {
    expect(line(spec({ unit: "nginx", flags: { follow: true } }))).toBe("journalctl -f -u nginx");
  });

  it("renders -n as a detached number value", () => {
    expect(line(spec({ flags: { lines: 50 } }))).toBe("journalctl -n 50");
  });

  it("renders -p PRIORITY", () => {
    expect(line(spec({ flags: { priority: "err" } }))).toBe("journalctl -p err");
  });

  it("renders -b/--boot and -r/--reverse and -k/--dmesg", () => {
    expect(line(spec({ flags: { boot: true } }))).toBe("journalctl -b");
    expect(line(spec({ flags: { reverse: true } }))).toBe("journalctl -r");
    expect(line(spec({ flags: { dmesg: true } }))).toBe("journalctl -k");
  });

  it("renders --since and --until as attached, quoted values", () => {
    expect(line(spec({ flags: { since: "2024-01-01 00:00:00" } }))).toBe(
      "journalctl --since='2024-01-01 00:00:00'",
    );
    expect(line(spec({ flags: { until: "2024-01-02 00:00:00" } }))).toBe(
      "journalctl --until='2024-01-02 00:00:00'",
    );
  });

  it("trims whitespace from unit, and omits it entirely when blank", () => {
    expect(line(spec({ unit: "  nginx  " }))).toBe("journalctl -u nginx");
    expect(line(spec({ unit: "   " }))).toBe("journalctl");
  });

  it("renders source, grep, output and pager options", () => {
    expect(
      line(
        spec({
          flags: {
            user: true,
            identifier: "sshd",
            grep: "failed",
            output: "json-pretty",
            noPager: true,
          },
        }),
      ),
    ).toBe("journalctl --user --identifier=sshd --grep=failed -o json-pretty --no-pager");
  });

  it("renders optional boot selectors, matches, paths, and passthrough options", () => {
    expect(
      line(
        spec({
          flags: { bootSelect: "-1", priority: "3..5" },
          matches: ["_PID=1234", "/usr/bin/sshd"],
          extraOptions: ["--utc"],
        }),
      ),
    ).toBe("journalctl -p 3..5 --boot=-1 --utc _PID=1234 /usr/bin/sshd");
  });
});

describe("lint — read-only, so only genuine mistakes get flagged", () => {
  it("JCT001 warns about --follow combined with --until", () => {
    const s = spec({ flags: { follow: true, until: "2024-01-01" } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("JCT001");
  });

  it("JCT001 does not fire for --follow alone", () => {
    expect(lint(spec({ flags: { follow: true } })).diagnostics.map((d) => d.code)).not.toContain("JCT001");
  });

  it("JCT002 warns when --since is after --until", () => {
    const s = spec({ flags: { since: "2024-06-01", until: "2024-01-01" } });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("JCT002");
  });

  it("JCT002 does not fire for a valid ascending range", () => {
    const s = spec({ flags: { since: "2024-01-01", until: "2024-06-01" } });
    expect(lint(s).diagnostics.map((d) => d.code)).not.toContain("JCT002");
  });

  it("a plain unit-scoped query has no diagnostics", () => {
    expect(lint(spec({ unit: "nginx" })).diagnostics).toEqual([]);
  });

  it("no rule is ever destructive or error-level — journalctl is read-only", () => {
    const s = spec({ flags: { follow: true, until: "2024-01-01", since: "2024-06-01" } });
    for (const d of lint(s).diagnostics) {
      expect(d.level).toBe("warning");
    }
  });

  it("JCT003 warns for maintenance options that modify journal state", () => {
    expect(lint(spec({ flags: { vacuumSize: "1G", rotate: true } })).diagnostics.map((d) => d.code)).toContain("JCT003");
  });
});

describe("presets", () => {
  it("'Follow a unit's logs live' is journalctl -f -u nginx", () => {
    expect(line(getPreset("follow-a-unit")!.apply(spec()))).toBe("journalctl -f -u nginx");
  });

  it("'Last 100 lines of a unit' is journalctl -n 100 -u nginx", () => {
    expect(line(getPreset("last-100-lines")!.apply(spec()))).toBe("journalctl -n 100 -u nginx");
  });

  it("'Errors since this boot' is journalctl -p err -b (catalogue order: priority before boot)", () => {
    expect(line(getPreset("errors-since-boot")!.apply(spec()))).toBe("journalctl -p err -b");
  });

  it("'Kernel messages (dmesg)' is journalctl -k", () => {
    expect(line(getPreset("kernel-messages")!.apply(spec()))).toBe("journalctl -k");
  });

  it("'Entries in a time window' sets both --since and --until", () => {
    expect(line(getPreset("time-window")!.apply(spec()))).toBe(
      "journalctl --since='2024-01-01 00:00:00' --until='2024-01-02 00:00:00'",
    );
  });
});

describe("describeSpec", () => {
  it("describes a bare query against the whole system journal", () => {
    expect(describeSpec(spec())).toBe("Show the system journal.");
  });

  it("describes a unit-scoped query", () => {
    expect(describeSpec(spec({ unit: "nginx" }))).toBe("Show the nginx unit's journal.");
  });

  it("describes --follow as following, not showing", () => {
    expect(describeSpec(spec({ unit: "nginx", flags: { follow: true } }))).toBe(
      "Follow the nginx unit's journal live.",
    );
  });

  it("mentions --lines, --boot, --dmesg, --priority, --since, --until, and --reverse as trailing clauses", () => {
    const described = describeSpec(
      spec({
        unit: "nginx",
        flags: {
          lines: 50,
          boot: true,
          priority: "err",
          since: "2024-01-01",
          until: "2024-06-01",
          reverse: true,
        },
      }),
    );
    expect(described).toContain("limited to the last 50 entries");
    expect(described).toContain("only from the current boot");
    expect(described).toContain("at or above priority err");
    expect(described).toContain("since 2024-01-01");
    expect(described).toContain("until 2024-06-01");
    expect(described).toContain("newest entries first");
  });
});
