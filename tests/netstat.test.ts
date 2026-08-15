import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type NetstatSpec } from "@cmdgen/netstat";

const line = (spec: NetstatSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<NetstatSpec> = {}): NetstatSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("rendering", () => {
  it("a bare netstat", () => {
    expect(line(spec())).toBe("netstat");
  });

  it("renders -t, -u, -l, -n, -p, -r, -a", () => {
    expect(line(spec({ flags: { tcp: true } }))).toBe("netstat -t");
    expect(line(spec({ flags: { udp: true } }))).toBe("netstat -u");
    expect(line(spec({ flags: { listening: true } }))).toBe("netstat -l");
    expect(line(spec({ flags: { numeric: true } }))).toBe("netstat -n");
    expect(line(spec({ flags: { program: true } }))).toBe("netstat -p");
    expect(line(spec({ flags: { route: true } }))).toBe("netstat -r");
    expect(line(spec({ flags: { all: true } }))).toBe("netstat -a");
  });

  it("renders multiple flags in stable order", () => {
    expect(line(spec({ flags: { tcp: true, udp: true, listening: true, numeric: true } }))).toBe(
      "netstat -t -u -l -n",
    );
  });
});

describe("lint", () => {
  it("a bare netstat has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });

  it("every flag combination has no diagnostics — netstat has no contradictory flags", () => {
    expect(lint(spec({ flags: { tcp: true, udp: true, all: true, program: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Show listening ports' is -tuln", () => {
    expect(line(getPreset("listening-ports")!.apply(spec()))).toBe("netstat -t -u -l -n");
  });

  it("'Show listening ports with their owning program' adds -p", () => {
    expect(line(getPreset("listening-with-programs")!.apply(spec()))).toBe("netstat -t -u -l -n -p");
  });

  it("'Show all TCP connections' is -a -n -t", () => {
    expect(line(getPreset("all-connections")!.apply(spec()))).toBe("netstat -t -n -a");
  });

  it("'Show the routing table' is -r", () => {
    expect(line(getPreset("routing-table")!.apply(spec()))).toBe("netstat -r");
  });
});

describe("describeSpec", () => {
  it("describes a bare netstat", () => {
    expect(describeSpec(spec())).toBe("Show network connections.");
  });

  it("describes -t and -u together", () => {
    expect(describeSpec(spec({ flags: { tcp: true, udp: true } }))).toBe("Show TCP and UDP sockets.");
  });

  it("describes -t alone", () => {
    expect(describeSpec(spec({ flags: { tcp: true } }))).toBe("Show TCP sockets.");
  });

  it("describes -r as the routing table view, ignoring other flags", () => {
    expect(describeSpec(spec({ flags: { route: true, tcp: true } }))).toBe("Show the kernel routing table.");
  });

  it("mentions listening, all, numeric, and program as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { listening: true } }))).toBe(
      "Show network connections, limited to listening sockets.",
    );
    expect(describeSpec(spec({ flags: { all: true } }))).toBe(
      "Show network connections, including both listening and non-listening sockets.",
    );
    expect(describeSpec(spec({ flags: { numeric: true } }))).toBe(
      "Show network connections, using numeric addresses and ports instead of resolving names.",
    );
    expect(describeSpec(spec({ flags: { program: true } }))).toBe(
      "Show network connections, showing the owning program and PID for each socket.",
    );
  });
});
