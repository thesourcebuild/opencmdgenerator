import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WhoisSpec } from "@cmdgen/whois";

const line = (spec: WhoisSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<WhoisSpec> = {}): WhoisSpec => ({
  ...createSpec({ id: "test-spec" }),
  domain: "example.com",
  ...partial,
});

describe("rendering", () => {
  it("a bare lookup", () => {
    expect(line(spec())).toBe("whois example.com");
  });

  it("quotes a domain with spaces", () => {
    expect(line(spec({ domain: "my domain" }))).toBe("whois 'my domain'");
  });

  it("renders -h/--host before the domain", () => {
    expect(line(spec({ flags: { host: "whois.arin.net" } }))).toBe("whois -h whois.arin.net example.com");
  });

  it("omits the domain entirely when blank", () => {
    expect(line(spec({ domain: "" }))).toBe("whois");
  });
});

describe("lint", () => {
  it("WHO001 catches an empty or whitespace-only domain", () => {
    expect(lint(spec({ domain: "" })).diagnostics.map((d) => d.code)).toContain("WHO001");
    expect(lint(spec({ domain: "   " })).diagnostics.map((d) => d.code)).toContain("WHO001");
  });

  it("a non-empty domain has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Look up a domain's registration info' is a bare lookup", () => {
    expect(line(getPreset("look-up-a-domain")!.apply(spec()))).toBe("whois example.com");
  });

  it("'Look up an IP address's allocation' sets domain to an IP", () => {
    expect(line(getPreset("look-up-an-ip")!.apply(spec()))).toBe("whois 8.8.8.8");
  });

  it("'Query a specific whois server' is -h whois.arin.net", () => {
    expect(line(getPreset("query-a-specific-server")!.apply(spec()))).toBe("whois -h whois.arin.net example.com");
  });
});

describe("describeSpec", () => {
  it("describes a plain lookup", () => {
    expect(describeSpec(spec())).toBe("Look up WHOIS registration info for example.com.");
  });

  it("uses a placeholder when the domain is empty", () => {
    expect(describeSpec(spec({ domain: "" }))).toBe("Look up WHOIS registration info for SOME_DOMAIN.");
  });

  it("mentions the queried server when -h is set", () => {
    expect(describeSpec(spec({ flags: { host: "whois.arin.net" } }))).toBe(
      "Look up WHOIS registration info for example.com, querying the whois.arin.net server directly.",
    );
  });
});
