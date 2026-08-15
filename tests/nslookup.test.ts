import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type NslookupSpec } from "@cmdgen/nslookup";

const line = (spec: NslookupSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<NslookupSpec> = {}): NslookupSpec => ({
  ...createSpec({ id: "test-spec" }),
  lookupName: "example.com",
  ...partial,
});

describe("rendering", () => {
  it("a bare lookup", () => {
    expect(line(spec())).toBe("nslookup example.com");
  });

  it("quotes a name with spaces", () => {
    expect(line(spec({ lookupName: "my host" }))).toBe("nslookup 'my host'");
  });

  it("renders a trailing server positional", () => {
    expect(line(spec({ server: "8.8.8.8" }))).toBe("nslookup example.com 8.8.8.8");
  });

  it("renders -type= and -query=", () => {
    expect(line(spec({ flags: { queryType: "MX" } }))).toBe("nslookup -type=MX example.com");
    expect(line(spec({ flags: { queryClass: "NS" } }))).toBe("nslookup -query=NS example.com");
  });

  it("renders flags before the name and server", () => {
    expect(line(spec({ server: "8.8.8.8", flags: { queryType: "MX" } }))).toBe(
      "nslookup -type=MX example.com 8.8.8.8",
    );
  });

  it("omits the name entirely when blank", () => {
    expect(line(spec({ lookupName: "" }))).toBe("nslookup");
  });
});

describe("lint", () => {
  it("NSL001 catches an empty or whitespace-only lookupName", () => {
    expect(lint(spec({ lookupName: "" })).diagnostics.map((d) => d.code)).toContain("NSL001");
    expect(lint(spec({ lookupName: "   " })).diagnostics.map((d) => d.code)).toContain("NSL001");
  });

  it("NSL002 catches -type= and -query= together, and its fix silences it", () => {
    const s = spec({ flags: { queryType: "MX", queryClass: "NS" } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("NSL002");
    const diag = result.diagnostics.find((d) => d.code === "NSL002")!;
    expect(diag.level).toBe("warning");
    expect(lint(diag.fix!.apply(s)).diagnostics.map((d) => d.code)).not.toContain("NSL002");
  });

  it("a plain lookup has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Look up a hostname' is a bare lookup", () => {
    expect(line(getPreset("look-up-a-hostname")!.apply(spec()))).toBe("nslookup example.com");
  });

  it("'Query MX records' is -type=MX", () => {
    expect(line(getPreset("query-mx-records")!.apply(spec()))).toBe("nslookup -type=MX example.com");
  });

  it("'Query against a specific server' appends 8.8.8.8", () => {
    expect(line(getPreset("query-a-specific-server")!.apply(spec()))).toBe("nslookup example.com 8.8.8.8");
  });

  it("'Reverse lookup an IP address' just sets the name to an address", () => {
    expect(line(getPreset("reverse-lookup")!.apply(spec()))).toBe("nslookup 8.8.8.8");
  });
});

describe("describeSpec", () => {
  it("describes a plain lookup", () => {
    expect(describeSpec(spec())).toBe("Look up example.com.");
  });

  it("uses a placeholder when the name is empty", () => {
    expect(describeSpec(spec({ lookupName: "" }))).toBe("Look up SOME_NAME.");
  });

  it("mentions the record type and server as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { queryType: "MX" } }))).toBe("Look up example.com, querying its MX record.");
    expect(describeSpec(spec({ server: "8.8.8.8" }))).toBe("Look up example.com, against the 8.8.8.8 server.");
  });
});
