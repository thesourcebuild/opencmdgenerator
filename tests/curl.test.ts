import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  validateCatalogue,
  PRESETS,
  RULES,
  type CurlSpec,
} from "@cmdgen/curl";

const line = (spec: CurlSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<CurlSpec> = {}): CurlSpec => ({ ...createSpec({ id: "test-spec" }), ...partial });
const codes = (s: CurlSpec) => lint(s).diagnostics.map((d) => d.code);
const has = (s: CurlSpec, code: string) => codes(s).includes(code);

describe("catalogue integrity", () => {
  it("has no duplicate ids, orders, or dangling references", () => {
    expect(validateCatalogue()).toEqual([]);
  });

  it("has no duplicate rule codes", () => {
    const seen = new Set<string>();
    const dupes = RULES.map((r) => r.code).filter((c) => (seen.has(c) ? true : (seen.add(c), false)));
    expect(dupes).toEqual([]);
  });
});

describe("basic requests", () => {
  it("renders a bare GET", () => {
    expect(line(spec({ urls: ["https://example.com"] }))).toBe("curl https://example.com");
  });

  it("renders --request for an explicit method (preferShort only governs boolean-kind rendering, not value-carrying flags)", () => {
    expect(line(spec({ urls: ["https://example.com/x"], flags: { request: "DELETE" } }))).toBe(
      "curl --request DELETE https://example.com/x",
    );
  });

  it("renders multiple URLs in order", () => {
    expect(line(spec({ urls: ["https://a.example", "https://b.example"] }))).toBe(
      "curl https://a.example https://b.example",
    );
  });

  it("blank URL entries are dropped", () => {
    expect(line(spec({ urls: ["", "https://a.example", "  "] }))).toBe("curl https://a.example");
  });
});

describe("headers, data and form entries — repeatable groups outside the flag catalogue", () => {
  it("renders each header with its own -H, single-quoted since a header value contains spaces", () => {
    const out = line(spec({ urls: ["https://a"], headers: ["Accept: application/json", "X-Id: 1"] }));
    expect(out).toBe("curl -H 'Accept: application/json' -H 'X-Id: 1' https://a");
  });

  it("renders each data entry with its own mode flag, concatenated in order", () => {
    const out = line(
      spec({
        urls: ["https://a"],
        dataEntries: [
          { mode: "data", value: "a=1" },
          { mode: "data-raw", value: "b=2" },
        ],
      }),
    );
    // No quotes: neither value contains a character that needs shell quoting.
    expect(out).toBe("curl -d a=1 --data-raw b=2 https://a");
  });

  it("renders --json for the json data mode", () => {
    const out = line(spec({ urls: ["https://a"], dataEntries: [{ mode: "json", value: '{"x":1}' }] }));
    expect(out).toContain("--json");
  });

  it("renders each form entry with its own mode flag", () => {
    const out = line(
      spec({
        urls: ["https://a"],
        formEntries: [
          { mode: "form", value: "file=@a.txt" },
          { mode: "form-string", value: "note=hi" },
        ],
      }),
    );
    expect(out).toBe("curl -F file=@a.txt --form-string note=hi https://a");
  });

  it("blank header/data/form entries are dropped", () => {
    const out = line(
      spec({
        urls: ["https://a"],
        headers: ["  "],
        dataEntries: [{ mode: "data", value: "" }],
        formEntries: [{ mode: "form", value: "  " }],
      }),
    );
    expect(out).toBe("curl https://a");
  });
});

describe("catalogue flags render correctly", () => {
  it("combines short boolean flags via the shared render option, in catalogue order (not object-literal order)", () => {
    const out = renderOneLine(buildArgv(spec({ urls: ["https://a"], flags: { silent: true, showError: true, location: true } })), {
      shell: "posix",
      combineShortFlags: true,
    });
    // location (http, order 1430) renders before silent/showError (output, 1520/1530).
    expect(out).toBe("curl -LsS https://a");
  });

  it("renders a value-carrying flag by its long spelling, attached with a space", () => {
    expect(line(spec({ urls: ["https://a"], flags: { output: "out.json" } }))).toBe("curl --output out.json https://a");
  });

  it("renders an enum flag's token, not its id", () => {
    expect(line(spec({ urls: ["https://a"], flags: { certType: "DER" } }))).toBe("curl --cert-type DER https://a");
  });

  it("an enum flag left at its inactive sentinel renders nothing", () => {
    expect(line(spec({ urls: ["https://a"], flags: { certType: "none" } }))).toBe("curl https://a");
  });
});

describe("lint — safety and correctness", () => {
  it("CURL001 fires with no URL", () => {
    expect(has(spec({ urls: [""] }), "CURL001")).toBe(true);
  });

  it("CURL001 stays quiet with a URL", () => {
    expect(has(spec({ urls: ["https://a"] }), "CURL001")).toBe(false);
  });

  it("CURL002 fires for contradictory auth flags and the fix silences it", () => {
    const s = spec({ urls: ["https://a"], flags: { basic: true, digest: true } });
    expect(has(s, "CURL002")).toBe(true);
    const fix = lint(s).diagnostics.find((d) => d.code === "CURL002")?.fix;
    expect(fix).toBeDefined();
    expect(has(fix!.apply(s), "CURL002")).toBe(false);
  });

  it("CURL003 fires when a dependent flag is missing its prerequisite, and the fix silences it", () => {
    const s = spec({ urls: ["https://a"], flags: { locationTrusted: true } });
    expect(has(s, "CURL003")).toBe(true);
    const fix = lint(s).diagnostics.find((d) => d.code === "CURL003")?.fix;
    const fixed = fix!.apply(s);
    expect(has(fixed, "CURL003")).toBe(false);
  });

  it("CURL004 flags -k as destructive", () => {
    const s = spec({ urls: ["https://a"], flags: { insecure: true } });
    expect(lint(s).diagnostics.find((d) => d.code === "CURL004")?.level).toBe("destructive");
  });

  it("CURL005 warns when credentials sit on the command line", () => {
    expect(has(spec({ urls: ["https://a"], flags: { user: "bob:secret" } }), "CURL005")).toBe(true);
  });

  it("CURL006 flags --location-trusted as destructive", () => {
    const s = spec({ urls: ["https://a"], flags: { location: true, locationTrusted: true } });
    expect(lint(s).diagnostics.find((d) => d.code === "CURL006")?.level).toBe("destructive");
  });

  it("CURL007 warns on more than one HTTP version flag", () => {
    expect(has(spec({ urls: ["https://a"], flags: { http2: true, http3: true } }), "CURL007")).toBe(true);
  });

  it("CURL008 errors on more than one proxy protocol", () => {
    expect(has(spec({ urls: ["https://a"], flags: { proxy: "http://p", socks5: "s5:1080" } }), "CURL008")).toBe(true);
  });

  it("CURL009 errors when --upload-file and a data body are both set", () => {
    const s = spec({ urls: ["https://a"], flags: { uploadFile: "f.bin" }, dataEntries: [{ mode: "data", value: "x=1" }] });
    expect(has(s, "CURL009")).toBe(true);
  });

  it("CURL010 errors when data and form entries are both set", () => {
    const s = spec({
      urls: ["https://a"],
      dataEntries: [{ mode: "data", value: "x=1" }],
      formEntries: [{ mode: "form", value: "f=@a" }],
    });
    expect(has(s, "CURL010")).toBe(true);
  });

  it("CURL012 warns when -O is used on a URL with no path", () => {
    expect(has(spec({ urls: ["https://example.com"], flags: { remoteName: true } }), "CURL012")).toBe(true);
  });

  it("CURL012 stays quiet when the URL has a real filename", () => {
    expect(has(spec({ urls: ["https://example.com/file.zip"], flags: { remoteName: true } }), "CURL012")).toBe(false);
  });
});

describe("presets", () => {
  it("httpbingo-post applies without leaking flags from a prior preset", () => {
    const withInsecure = spec({ urls: ["https://a"], flags: { insecure: true, verbose: true } });
    const applied = getPreset("httpbingo-post")!.apply(withInsecure);
    expect(applied.flags.insecure).toBeUndefined();
    expect(applied.flags.verbose).toBeUndefined();
  });

  it("every preset id is unique and resolves via getPreset", () => {
    const seen = new Set<string>();
    for (const preset of PRESETS) {
      expect(seen.has(preset.id), `duplicate preset id: ${preset.id}`).toBe(false);
      seen.add(preset.id);
      expect(getPreset(preset.id)).toBeDefined();
    }
    // Sanity floor — catches an accidental truncation of the httpbingo.org or
    // other-protocols batch (60 + 11 at time of writing).
    expect(PRESETS.length).toBeGreaterThanOrEqual(70);
  });

  it("every preset applies cleanly to a fresh spec and renders without throwing", () => {
    for (const preset of PRESETS) {
      const applied = preset.apply(createSpec({ id: "test-spec" }));
      expect(() => renderOneLine(buildArgv(applied), { shell: applied.shell })).not.toThrow();
    }
  });

  it("every httpbingo.org preset leaves at least one non-empty URL", () => {
    // Unlike the general presets (meant to layer onto a URL the user already
    // typed), every httpbingo preset targets one specific endpoint, so it
    // must set `urls` itself.
    for (const preset of PRESETS.filter((p) => p.id.startsWith("httpbingo-"))) {
      const applied = preset.apply(createSpec({ id: "test-spec" }));
      const hasUrl = applied.urls.some((u) => u.trim() !== "");
      expect(hasUrl, `${preset.id} produced no non-empty URL`).toBe(true);
    }
  });

  it("every httpbingo.org preset shares the single 'HTTP - httpbingo' category", () => {
    const httpbingo = PRESETS.filter((p) => p.id.startsWith("httpbingo-"));
    expect(httpbingo.length).toBeGreaterThanOrEqual(50);
    for (const preset of httpbingo) {
      expect(preset.category, preset.id).toBe("HTTP - httpbingo");
    }
  });

  it("every httpbingo.org preset targets a real httpbingo.org URL", () => {
    for (const preset of PRESETS.filter((p) => p.id.startsWith("httpbingo-"))) {
      const applied = preset.apply(createSpec({ id: "test-spec" }));
      // websocket-echo deliberately uses wss:// — curl's native scheme for completing
      // the upgrade handshake — every other preset is a plain https:// request.
      expect(applied.urls.some((u) => /^(https?|wss?):\/\/httpbingo\.org\//.test(u)), preset.id).toBe(true);
    }
  });

  const OTHER_PROTOCOL_PREFIXES = ["dict-", "imap-", "ipfs-", "mqtt-", "pop3-", "smtp-", "telnet-", "tftp-"];

  it("every preset is either an httpbingo.org preset or an other-protocols preset — no stray batch", () => {
    for (const preset of PRESETS) {
      const known = preset.id.startsWith("httpbingo-") || OTHER_PROTOCOL_PREFIXES.some((p) => preset.id.startsWith(p));
      expect(known, `${preset.id} doesn't match any known preset-id prefix`).toBe(true);
    }
  });

  describe("other protocols (dict/imap/ipfs/mqtt/pop3/smtp/telnet/tftp)", () => {
    const otherProtocolPresets = () => PRESETS.filter((p) => OTHER_PROTOCOL_PREFIXES.some((prefix) => p.id.startsWith(prefix)));

    it("covers all 8 requested protocols with at least one preset each", () => {
      const presets = otherProtocolPresets();
      for (const prefix of OTHER_PROTOCOL_PREFIXES) {
        expect(presets.some((p) => p.id.startsWith(prefix)), `no preset for ${prefix}`).toBe(true);
      }
    });

    it("each protocol is its own category, named after the protocol", () => {
      const categoryFor: Record<string, string> = {
        "dict-": "DICT",
        "imap-": "IMAP",
        "ipfs-": "IPFS",
        "mqtt-": "MQTT",
        "pop3-": "POP3",
        "smtp-": "SMTP",
        "telnet-": "TELNET",
        "tftp-": "TFTP",
      };
      for (const preset of otherProtocolPresets()) {
        const prefix = OTHER_PROTOCOL_PREFIXES.find((p) => preset.id.startsWith(p))!;
        expect(preset.category, preset.id).toBe(categoryFor[prefix]);
      }
    });

    it("every preset sets a non-empty URL using its own protocol's scheme", () => {
      const schemeFor: Record<string, string> = {
        "dict-": "dict:",
        "imap-": "imap:",
        "ipfs-": "ipfs:",
        "mqtt-": "mqtt:",
        "pop3-": "pop3:",
        "smtp-": "smtp:",
        "telnet-": "telnet:",
        "tftp-": "tftp:",
      };
      for (const preset of otherProtocolPresets()) {
        const applied = preset.apply(createSpec({ id: "test-spec" }));
        const prefix = OTHER_PROTOCOL_PREFIXES.find((p) => preset.id.startsWith(p))!;
        expect(applied.urls.some((u) => u.startsWith(schemeFor[prefix]!)), preset.id).toBe(true);
      }
    });

    it("describes an SMTP send on its own terms, not as an HTTP-style PUT", () => {
      // --upload-file supplies the mail body for smtp:// — it has no HTTP
      // "PUT a resource" semantic, and describeSpec must not imply one.
      const applied = getPreset("smtp-send")!.apply(createSpec({ id: "test-spec" }));
      const described = describeSpec(applied);
      expect(described).not.toContain("PUT");
      expect(described).toBe('Send an email from sender@example.com to recipient@example.com, uploading "email.txt".');
    });
  });
});
