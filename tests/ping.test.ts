import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PingSpec } from "@cmdgen/ping";

const line = (spec: PingSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PingSpec> = {}): PingSpec => ({
  ...createSpec({ id: "test-spec" }),
  host: "example.com",
  ...partial,
});

describe("rendering", () => {
  it("a bare ping", () => {
    expect(line(spec())).toBe("ping example.com");
  });

  it("quotes a host with spaces", () => {
    expect(line(spec({ host: "my host" }))).toBe("ping 'my host'");
  });

  it("renders -c, -i, -W, -s", () => {
    expect(line(spec({ flags: { count: "4" } }))).toBe("ping -c 4 example.com");
    expect(line(spec({ flags: { interval: "2" } }))).toBe("ping -i 2 example.com");
    expect(line(spec({ flags: { timeout: "5" } }))).toBe("ping -W 5 example.com");
    expect(line(spec({ flags: { size: "1000" } }))).toBe("ping -s 1000 example.com");
  });

  it("renders multiple flags in stable order", () => {
    expect(line(spec({ flags: { count: "4", interval: "2", timeout: "5", size: "1000" } }))).toBe(
      "ping -c 4 -i 2 -W 5 -s 1000 example.com",
    );
  });

  it("omits the host entirely when blank", () => {
    expect(line(spec({ host: "" }))).toBe("ping");
  });
});

describe("lint", () => {
  it("PNG001 catches an empty or whitespace-only host", () => {
    expect(lint(spec({ host: "" })).diagnostics.map((d) => d.code)).toContain("PNG001");
    expect(lint(spec({ host: "   " })).diagnostics.map((d) => d.code)).toContain("PNG001");
  });

  it("PNG002 notes that ping runs forever without -c, at info level", () => {
    const result = lint(spec());
    expect(result.diagnostics.map((d) => d.code)).toContain("PNG002");
    expect(result.diagnostics.find((d) => d.code === "PNG002")!.level).toBe("info");
  });

  it("PNG002 does not fire once -c is set", () => {
    expect(lint(spec({ flags: { count: "4" } })).diagnostics.map((d) => d.code)).not.toContain("PNG002");
  });

  it("a ping with -c set has no diagnostics", () => {
    expect(lint(spec({ flags: { count: "4" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Ping a host continuously' is a bare ping", () => {
    expect(line(getPreset("ping-continuously")!.apply(spec()))).toBe("ping example.com");
  });

  it("'Ping a fixed number of times' is -c 4", () => {
    expect(line(getPreset("ping-a-fixed-count")!.apply(spec()))).toBe("ping -c 4 example.com");
  });

  it("'Ping with a per-reply timeout' is -c 4 -W 5", () => {
    expect(line(getPreset("ping-with-timeout")!.apply(spec()))).toBe("ping -c 4 -W 5 example.com");
  });

  it("'Ping with a larger packet size' is -c 4 -s 1000", () => {
    expect(line(getPreset("ping-large-packets")!.apply(spec()))).toBe("ping -c 4 -s 1000 example.com");
  });
});

describe("describeSpec", () => {
  it("describes a plain, continuous ping", () => {
    expect(describeSpec(spec())).toBe("Ping example.com, continuously, until manually interrupted.");
  });

  it("uses a placeholder when the host is empty", () => {
    expect(describeSpec(spec({ host: "" }))).toBe("Ping SOME_HOST, continuously, until manually interrupted.");
  });

  it("describes count, interval, timeout, and size when set", () => {
    expect(describeSpec(spec({ flags: { count: "4" } }))).toBe("Ping example.com, sending 4 packets.");
    expect(describeSpec(spec({ flags: { count: "4", interval: "2" } }))).toBe(
      "Ping example.com, sending 4 packets, waiting 2s between packets.",
    );
    expect(describeSpec(spec({ flags: { count: "4", timeout: "5" } }))).toBe(
      "Ping example.com, sending 4 packets, timing out after 5s per reply.",
    );
    expect(describeSpec(spec({ flags: { count: "4", size: "1000" } }))).toBe(
      "Ping example.com, sending 4 packets, using a packet size of 1000 bytes.",
    );
  });
});
