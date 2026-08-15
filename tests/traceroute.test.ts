import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type TracerouteSpec } from "@cmdgen/traceroute";

const line = (spec: TracerouteSpec) => renderOneLine(buildArgv(spec), spec.platform);

const spec = (partial: Partial<TracerouteSpec> = {}): TracerouteSpec => ({
  ...createSpec({ id: "test-spec" }),
  host: "example.com",
  ...partial,
});

describe("POSIX (traceroute)", () => {
  it("a bare host", () => {
    expect(line(spec())).toBe("traceroute example.com");
  });

  it("quotes a host with spaces", () => {
    expect(line(spec({ host: "my host" }))).toBe("traceroute 'my host'");
  });

  it("renders -n, -m, -w, -I, -4, -6", () => {
    expect(line(spec({ flags: { numeric: true } }))).toBe("traceroute -n example.com");
    expect(line(spec({ flags: { maxHops: "15" } }))).toBe("traceroute -m 15 example.com");
    expect(line(spec({ flags: { waitTime: "3" } }))).toBe("traceroute -w 3 example.com");
    expect(line(spec({ flags: { icmp: true } }))).toBe("traceroute -I example.com");
    expect(line(spec({ flags: { ipv4: true } }))).toBe("traceroute -4 example.com");
    expect(line(spec({ flags: { ipv6: true } }))).toBe("traceroute -6 example.com");
  });

  it("renders multiple flags in stable order", () => {
    expect(line(spec({ flags: { numeric: true, maxHops: "10", icmp: true } }))).toBe(
      "traceroute -n -m 10 -I example.com",
    );
  });

  it("mac uses the same binary and flags as linux", () => {
    expect(line(spec({ platform: "mac", flags: { numeric: true } }))).toBe("traceroute -n example.com");
  });

  it("windows-tagged flags are silently dropped", () => {
    expect(line(spec({ flags: { noResolve: true, maxHopsWin: "5" } }))).toBe("traceroute example.com");
  });
});

describe("cmd.exe / PowerShell (tracert)", () => {
  const cmd = (partial: Partial<TracerouteSpec> = {}): TracerouteSpec => spec({ platform: "windows-cmd", ...partial });
  const ps = (partial: Partial<TracerouteSpec> = {}): TracerouteSpec => spec({ platform: "windows-powershell", ...partial });

  it("uses tracert as the binary on both windows-cmd and windows-powershell", () => {
    expect(line(cmd())).toBe("tracert example.com");
    expect(line(ps())).toBe("tracert example.com");
  });

  it("renders -d, -h, -w (milliseconds) identically on cmd and powershell", () => {
    expect(line(cmd({ flags: { noResolve: true } }))).toBe("tracert -d example.com");
    expect(line(cmd({ flags: { maxHopsWin: "20" } }))).toBe("tracert -h 20 example.com");
    expect(line(cmd({ flags: { waitTimeWin: "4000" } }))).toBe("tracert -w 4000 example.com");
    expect(line(ps({ flags: { noResolve: true, maxHopsWin: "20" } }))).toBe("tracert -d -h 20 example.com");
  });

  it("POSIX-only flags are silently dropped on windows", () => {
    expect(line(cmd({ flags: { numeric: true, ipv4: true } }))).toBe("tracert example.com");
  });

  it("quotes a host with spaces differently for cmd.exe vs PowerShell", () => {
    expect(line(cmd({ host: "my host" }))).toBe('tracert "my host"');
    expect(line(ps({ host: "my host" }))).toBe("tracert 'my host'");
  });
});

describe("Cygwin / MSYS2 / WSL (real traceroute, not tracert)", () => {
  const cygwin = (partial: Partial<TracerouteSpec> = {}): TracerouteSpec => spec({ platform: "windows-cygwin", ...partial });
  const msys = (partial: Partial<TracerouteSpec> = {}): TracerouteSpec => spec({ platform: "windows-msys", ...partial });
  const wsl = (partial: Partial<TracerouteSpec> = {}): TracerouteSpec => spec({ platform: "windows-wsl", ...partial });

  it("uses traceroute (not tracert) as the binary on windows-cygwin, windows-msys and windows-wsl", () => {
    expect(line(cygwin())).toBe("traceroute example.com");
    expect(line(msys())).toBe("traceroute example.com");
    expect(line(wsl())).toBe("traceroute example.com");
  });

  it("renders -n, -m, -w, -I, -4, -6 identically to linux/mac", () => {
    expect(line(cygwin({ flags: { numeric: true } }))).toBe("traceroute -n example.com");
    expect(line(cygwin({ flags: { maxHops: "15" } }))).toBe("traceroute -m 15 example.com");
    expect(line(cygwin({ flags: { waitTime: "3" } }))).toBe("traceroute -w 3 example.com");
    expect(line(cygwin({ flags: { icmp: true } }))).toBe("traceroute -I example.com");
    expect(line(cygwin({ flags: { ipv4: true } }))).toBe("traceroute -4 example.com");
    expect(line(cygwin({ flags: { ipv6: true } }))).toBe("traceroute -6 example.com");
    expect(line(msys({ flags: { numeric: true, maxHops: "10", icmp: true } }))).toBe(
      "traceroute -n -m 10 -I example.com",
    );
    expect(line(wsl({ flags: { numeric: true, maxHops: "10", icmp: true } }))).toBe(
      "traceroute -n -m 10 -I example.com",
    );
  });

  it("windows-tagged flags (-d, -h, -w in milliseconds) are silently dropped", () => {
    expect(line(cygwin({ flags: { noResolve: true, maxHopsWin: "5", waitTimeWin: "4000" } }))).toBe(
      "traceroute example.com",
    );
    expect(line(msys({ flags: { noResolve: true, maxHopsWin: "5", waitTimeWin: "4000" } }))).toBe(
      "traceroute example.com",
    );
    expect(line(wsl({ flags: { noResolve: true, maxHopsWin: "5", waitTimeWin: "4000" } }))).toBe(
      "traceroute example.com",
    );
  });

  it("quotes a host with spaces the same POSIX way as linux/mac", () => {
    expect(line(cygwin({ host: "my host" }))).toBe("traceroute 'my host'");
    expect(line(msys({ host: "my host" }))).toBe("traceroute 'my host'");
    expect(line(wsl({ host: "my host" }))).toBe("traceroute 'my host'");
  });
});

describe("lint", () => {
  it("TRACEROUTE001 catches an empty host", () => {
    expect(lint(spec({ host: "" })).diagnostics.map((d) => d.code)).toContain("TRACEROUTE001");
  });

  it("TRACEROUTE001 catches a whitespace-only host", () => {
    expect(lint(spec({ host: "   " })).diagnostics.map((d) => d.code)).toContain("TRACEROUTE001");
  });

  it("TRACEROUTE002 catches -4 and -6 together", () => {
    expect(lint(spec({ flags: { ipv4: true, ipv6: true } })).diagnostics.map((d) => d.code)).toContain(
      "TRACEROUTE002",
    );
  });

  it("a plain trace has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Trace the path to a host' is a bare traceroute/tracert", () => {
    expect(line(getPreset("trace-a-host")!.apply(spec()))).toBe("traceroute example.com");
    expect(line(getPreset("trace-a-host")!.apply(spec({ platform: "windows-cmd" })))).toBe("tracert example.com");
  });

  it("'Skip DNS lookups for speed' is -n and is POSIX only", () => {
    expect(line(getPreset("fast-numeric-trace")!.apply(spec()))).toBe("traceroute -n example.com");
    expect(getPreset("fast-numeric-trace")!.isApplicable?.(spec({ platform: "windows-cmd" }))).toBe(false);
  });

  it("'Skip DNS lookups for speed' also applies under windows-cygwin/windows-msys/windows-wsl, same as linux/mac", () => {
    expect(getPreset("fast-numeric-trace")!.isApplicable?.(spec({ platform: "windows-cygwin" }))).toBe(true);
    expect(getPreset("fast-numeric-trace")!.isApplicable?.(spec({ platform: "windows-msys" }))).toBe(true);
    expect(getPreset("fast-numeric-trace")!.isApplicable?.(spec({ platform: "windows-wsl" }))).toBe(true);
    expect(line(getPreset("fast-numeric-trace")!.apply(spec({ platform: "windows-cygwin" })))).toBe(
      "traceroute -n example.com",
    );
    expect(line(getPreset("fast-numeric-trace")!.apply(spec({ platform: "windows-wsl" })))).toBe(
      "traceroute -n example.com",
    );
  });

  it("'Limit the number of hops' is -m 15 on POSIX", () => {
    expect(line(getPreset("limit-hops")!.apply(spec()))).toBe("traceroute -m 15 example.com");
  });
});

describe("describeSpec", () => {
  it("describes a plain trace", () => {
    expect(describeSpec(spec())).toBe("Trace the network path to example.com.");
  });

  it("uses a placeholder when the host is empty", () => {
    expect(describeSpec(spec({ host: "" }))).toBe("Trace the network path to SOME_HOST.");
  });

  it("mentions numeric, max hops, wait time, ICMP, and IP version when set", () => {
    expect(describeSpec(spec({ flags: { numeric: true } }))).toBe(
      "Trace the network path to example.com, skipping DNS lookups for hop addresses.",
    );
    expect(describeSpec(spec({ flags: { maxHops: "10" } }))).toBe(
      "Trace the network path to example.com, probing at most 10 hops.",
    );
    expect(describeSpec(spec({ flags: { waitTime: "2" } }))).toBe(
      "Trace the network path to example.com, waiting up to 2s for each probe's reply.",
    );
    expect(describeSpec(spec({ flags: { icmp: true } }))).toBe(
      "Trace the network path to example.com, using ICMP ECHO probes instead of UDP.",
    );
    expect(describeSpec(spec({ flags: { ipv6: true } }))).toBe("Trace the network path to example.com, forcing IPv6.");
  });

  it("describes the Windows equivalents (-d, -h, -w in milliseconds)", () => {
    expect(describeSpec(spec({ flags: { noResolve: true, maxHopsWin: "5", waitTimeWin: "2000" } }))).toBe(
      "Trace the network path to example.com, skipping DNS lookups for hop addresses, probing at most 5 hops, waiting up to 2000ms for each reply.",
    );
  });
});
