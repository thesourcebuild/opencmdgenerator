import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type DigSpec } from "@cmdgen/dig";

const line = (spec: DigSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<DigSpec> = {}): DigSpec => ({
  ...createSpec({ id: "test-spec" }),
  lookupName: "example.com",
  ...partial,
});

describe("rendering", () => {
  it("a bare lookup", () => {
    expect(line(spec())).toBe("dig example.com");
  });

  it("quotes a name with spaces", () => {
    expect(line(spec({ lookupName: "my host" }))).toBe("dig 'my host'");
  });

  it("renders a record type as a trailing positional", () => {
    expect(line(spec({ type: "MX" }))).toBe("dig example.com MX");
  });

  it("renders @server", () => {
    expect(line(spec({ server: "8.8.8.8" }))).toBe("dig @8.8.8.8 example.com");
  });

  it("renders -x, -p, +trace, +short", () => {
    expect(line(spec({ flags: { reverse: true } }))).toBe("dig -x example.com");
    expect(line(spec({ flags: { port: "5353" } }))).toBe("dig -p 5353 example.com");
    expect(line(spec({ flags: { trace: true } }))).toBe("dig +trace example.com");
    expect(line(spec({ flags: { short: true } }))).toBe("dig +short example.com");
  });

  it("renders multiple flags in stable order before @server and the name", () => {
    expect(line(spec({ server: "8.8.8.8", type: "MX", flags: { port: "5353", short: true } }))).toBe(
      "dig -p 5353 +short @8.8.8.8 example.com MX",
    );
  });

  it("omits the name entirely when blank", () => {
    expect(line(spec({ lookupName: "" }))).toBe("dig");
  });
});

describe("lint", () => {
  it("DIG001 catches an empty or whitespace-only lookupName", () => {
    expect(lint(spec({ lookupName: "" })).diagnostics.map((d) => d.code)).toContain("DIG001");
    expect(lint(spec({ lookupName: "   " })).diagnostics.map((d) => d.code)).toContain("DIG001");
  });

  it("DIG002 catches -x with a record type set, and its fix clears the type", () => {
    const s = spec({ type: "MX", flags: { reverse: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("DIG002");
    const diag = result.diagnostics.find((d) => d.code === "DIG002")!;
    expect(diag.level).toBe("info");
    expect(diag.fix!.apply(s).type).toBe("");
  });

  it("DIG003 catches +trace with a server set, and its fix clears the server", () => {
    const s = spec({ server: "8.8.8.8", flags: { trace: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("DIG003");
    const diag = result.diagnostics.find((d) => d.code === "DIG003")!;
    expect(diag.level).toBe("info");
    expect(diag.fix!.apply(s).server).toBe("");
  });

  it("a plain lookup has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Look up a domain's A record' is a bare lookup", () => {
    expect(line(getPreset("look-up-a-record")!.apply(spec()))).toBe("dig example.com");
  });

  it("'Get just the IP address' is +short", () => {
    expect(line(getPreset("just-the-answer")!.apply(spec()))).toBe("dig +short example.com");
  });

  it("'Query a specific record type' sets MX", () => {
    expect(line(getPreset("query-a-record-type")!.apply(spec()))).toBe("dig example.com MX");
  });

  it("'Reverse lookup an IP address' is -x", () => {
    expect(line(getPreset("reverse-lookup")!.apply(spec()))).toBe("dig -x 8.8.8.8");
  });

  it("'Query a specific DNS server' sets @8.8.8.8", () => {
    expect(line(getPreset("query-a-specific-server")!.apply(spec()))).toBe("dig @8.8.8.8 example.com");
  });
});

describe("describeSpec", () => {
  it("describes a plain A lookup", () => {
    expect(describeSpec(spec())).toBe("Look up the A record for example.com.");
  });

  it("uses a placeholder when the name is empty", () => {
    expect(describeSpec(spec({ lookupName: "" }))).toBe("Look up the A record for SOME_NAME.");
  });

  it("describes an explicit record type", () => {
    expect(describeSpec(spec({ type: "MX" }))).toBe("Look up the MX record for example.com.");
  });

  it("describes a reverse lookup", () => {
    expect(describeSpec(spec({ flags: { reverse: true } }))).toBe("Look up the hostname for example.com.");
  });

  it("mentions server, port, trace, and short as trailing clauses", () => {
    expect(describeSpec(spec({ server: "8.8.8.8" }))).toBe(
      "Look up the A record for example.com, querying 8.8.8.8 directly.",
    );
    expect(describeSpec(spec({ flags: { port: "5353" } }))).toBe(
      "Look up the A record for example.com, on port 5353.",
    );
    expect(describeSpec(spec({ flags: { trace: true } }))).toBe(
      "Look up the A record for example.com, tracing the delegation path from the root servers.",
    );
    expect(describeSpec(spec({ flags: { short: true } }))).toBe(
      "Look up the A record for example.com, printing just the answer.",
    );
  });
});
