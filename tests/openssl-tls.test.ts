import { describe, expect, it } from "vitest";
import { lint as lintGeneric, renderOneLine, validateCatalogue, type Arg } from "@cmdgen/engine";
import {
  PRIME_FLAGS,
  RAND_FLAGS,
  SESS_ID_FLAGS,
  S_CLIENT_FLAGS,
  S_SERVER_FLAGS,
  S_TIME_FLAGS,
  TLS_RULES,
  buildPrimeArgv,
  buildRandArgv,
  buildSClientArgv,
  buildSServerArgv,
  buildSTimeArgv,
  buildSessIdArgv,
  createSpec,
  describeSpec,
  getTlsPreset,
  type OpensslPrimeSpec,
  type OpensslRandSpec,
  type OpensslSClientSpec,
  type OpensslSServerSpec,
  type OpensslSTimeSpec,
  type OpensslSessIdSpec,
  type OpensslSpec,
} from "@cmdgen/openssl";

/**
 * `build/argv.ts`'s top-level dispatcher and `lint/rules.ts`'s combined
 * `RULES` are NOT wired to these 6 subcommands yet (Phase 1 batches are
 * built in parallel; another pass wires each batch's build/lint functions
 * into those shared switches). So these tests exercise this batch's own
 * `build<Name>Argv`/`TLS_RULES` directly, exactly the shape the real
 * `buildArgv`/`lint` dispatch to once integrated.
 */
function tlsLine(spec: OpensslSpec, argv: Arg[]): string {
  return renderOneLine({ binary: "openssl", args: [{ text: spec.subcommand, role: "value" }, ...argv] }, { shell: spec.shell });
}

function tlsLint(spec: OpensslSpec) {
  return lintGeneric(spec, TLS_RULES);
}

const randSpec = (partial: Partial<OpensslRandSpec> = {}): OpensslRandSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "rand" }) as OpensslRandSpec),
  ...partial,
});
const primeSpec = (partial: Partial<OpensslPrimeSpec> = {}): OpensslPrimeSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "prime" }) as OpensslPrimeSpec),
  ...partial,
});
const sClientSpec = (partial: Partial<OpensslSClientSpec> = {}): OpensslSClientSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "s_client" }) as OpensslSClientSpec),
  ...partial,
});
const sServerSpec = (partial: Partial<OpensslSServerSpec> = {}): OpensslSServerSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "s_server" }) as OpensslSServerSpec),
  ...partial,
});
const sTimeSpec = (partial: Partial<OpensslSTimeSpec> = {}): OpensslSTimeSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "s_time" }) as OpensslSTimeSpec),
  ...partial,
});
const sessIdSpec = (partial: Partial<OpensslSessIdSpec> = {}): OpensslSessIdSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "sess_id" }) as OpensslSessIdSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every tls-category catalogue is internally consistent", () => {
    expect(validateCatalogue(RAND_FLAGS)).toEqual([]);
    expect(validateCatalogue(PRIME_FLAGS)).toEqual([]);
    expect(validateCatalogue(S_CLIENT_FLAGS)).toEqual([]);
    expect(validateCatalogue(S_SERVER_FLAGS)).toEqual([]);
    expect(validateCatalogue(S_TIME_FLAGS)).toEqual([]);
    expect(validateCatalogue(SESS_ID_FLAGS)).toEqual([]);
  });
});

describe("rand", () => {
  it("defaults to -base64 so bare output is printable instead of raw binary", () => {
    const spec = randSpec({ numBytes: 32 });
    expect(tlsLine(spec, buildRandArgv(spec))).toBe("openssl rand -base64 32");
  });

  it("renders -out before flags, numBytes last", () => {
    const spec = randSpec({ numBytes: 16, outputFile: "random.bin", flags: { base64: true } });
    expect(tlsLine(spec, buildRandArgv(spec))).toBe("openssl rand -out random.bin -base64 16");
  });

  it("renders -hex", () => {
    const spec = randSpec({ numBytes: 8, flags: { hex: true } });
    expect(tlsLine(spec, buildRandArgv(spec))).toBe("openssl rand -hex 8");
  });
});

describe("prime", () => {
  it("renders the number as a bare trailing positional", () => {
    const spec = primeSpec({ number: "17" });
    expect(tlsLine(spec, buildPrimeArgv(spec))).toBe("openssl prime 17");
  });

  it("omits the positional entirely when empty", () => {
    const spec = primeSpec({ number: "" });
    expect(tlsLine(spec, buildPrimeArgv(spec))).toBe("openssl prime");
  });

  it("renders -generate with -bits and no positional", () => {
    const spec = primeSpec({ number: "", flags: { generate: true, bits: 2048 } });
    expect(tlsLine(spec, buildPrimeArgv(spec))).toBe("openssl prime -generate -bits 2048");
  });

  it("flags -generate together with a number as an error, fix clears the number", () => {
    const spec = primeSpec({ number: "17", flags: { generate: true } });
    const result = tlsLint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLT003");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(tlsLint(fixed).diagnostics.some((d) => d.code === "OSSLT003")).toBe(false);
  });

  it("flags neither a number nor -generate as an error", () => {
    expect(tlsLint(primeSpec({ number: "" })).diagnostics.some((d) => d.code === "OSSLT004")).toBe(true);
    expect(tlsLint(primeSpec({ number: "17" })).diagnostics.some((d) => d.code === "OSSLT004")).toBe(false);
    expect(tlsLint(primeSpec({ number: "", flags: { generate: true } })).diagnostics.some((d) => d.code === "OSSLT004")).toBe(false);
  });
});

describe("s_client", () => {
  it("renders -connect then flags", () => {
    const spec = sClientSpec({ connectTarget: "example.com:443", flags: { showcerts: true, servername: "example.com" } });
    expect(tlsLine(spec, buildSClientArgv(spec))).toBe("openssl s_client -connect example.com:443 -showcerts -servername example.com");
  });

  it("renders -tls1_3", () => {
    const spec = sClientSpec({ connectTarget: "example.com:443", flags: { tls1_3: true } });
    expect(tlsLine(spec, buildSClientArgv(spec))).toBe("openssl s_client -connect example.com:443 -tls1_3");
  });

  it("renders cert/key", () => {
    const spec = sClientSpec({ connectTarget: "example.com:443", flags: { cert: "client.pem", key: "client.key" } });
    expect(tlsLine(spec, buildSClientArgv(spec))).toBe("openssl s_client -connect example.com:443 -cert client.pem -key client.key");
  });

  it("flags a missing -connect target as an error", () => {
    expect(tlsLint(sClientSpec({ connectTarget: "" })).diagnostics.some((d) => d.code === "OSSLT001")).toBe(true);
    expect(tlsLint(sClientSpec({ connectTarget: "example.com:443" })).diagnostics.some((d) => d.code === "OSSLT001")).toBe(false);
  });

  it("flags -key set without -cert as a warning", () => {
    expect(
      tlsLint(sClientSpec({ connectTarget: "example.com:443", flags: { key: "client.key" } })).diagnostics.some(
        (d) => d.code === "OSSLT005",
      ),
    ).toBe(true);
    expect(
      tlsLint(
        sClientSpec({ connectTarget: "example.com:443", flags: { key: "client.key", cert: "client.pem" } }),
      ).diagnostics.some((d) => d.code === "OSSLT005"),
    ).toBe(false);
  });
});

describe("s_server", () => {
  it("renders -accept then flags", () => {
    const spec = sServerSpec({ acceptPort: "4433", flags: { www: true, cert: "server.pem", key: "server.key" } });
    expect(tlsLine(spec, buildSServerArgv(spec))).toBe("openssl s_server -accept 4433 -cert server.pem -key server.key -www");
  });

  it("flags a missing -accept port as an error", () => {
    expect(tlsLint(sServerSpec({ acceptPort: "" })).diagnostics.some((d) => d.code === "OSSLT002")).toBe(true);
    expect(tlsLint(sServerSpec({ acceptPort: "4433" })).diagnostics.some((d) => d.code === "OSSLT002")).toBe(false);
  });

  it("flags -key set without -cert as a warning", () => {
    expect(
      tlsLint(sServerSpec({ acceptPort: "4433", flags: { key: "server.key" } })).diagnostics.some((d) => d.code === "OSSLT005"),
    ).toBe(true);
  });
});

describe("s_time", () => {
  it("renders -connect and -time", () => {
    const spec = sTimeSpec({ connectTarget: "example.com:443", flags: { time: 30 } });
    expect(tlsLine(spec, buildSTimeArgv(spec))).toBe("openssl s_time -connect example.com:443 -time 30");
  });

  it("renders -www path", () => {
    const spec = sTimeSpec({ connectTarget: "example.com:443", flags: { www: "/index.html" } });
    expect(tlsLine(spec, buildSTimeArgv(spec))).toBe("openssl s_time -connect example.com:443 -www /index.html");
  });
});

describe("sess_id", () => {
  it("renders -in/-out then flags", () => {
    const spec = sessIdSpec({ inFile: "session.pem", outputFile: "out.pem", flags: { text: true, noout: true } });
    expect(tlsLine(spec, buildSessIdArgv(spec))).toBe("openssl sess_id -in session.pem -out out.pem -text -noout");
  });

  it("renders with no fields set", () => {
    const spec = sessIdSpec();
    expect(tlsLine(spec, buildSessIdArgv(spec))).toBe("openssl sess_id");
  });
});

describe("describeSpec / createSpec coverage", () => {
  it("does not throw for any of the 6 tls-category subcommands", () => {
    const subcommands = ["rand", "prime", "s_client", "s_server", "s_time", "sess_id"] as const;
    for (const subcommand of subcommands) {
      const spec = createSpec({ id: "x", subcommand });
      expect(spec.subcommand).toBe(subcommand);
      expect(() => describeSpec(spec)).not.toThrow();
      expect(() => tlsLint(spec)).not.toThrow();
    }
  });
});

describe("presets", () => {
  it("rand-32-base64 applies and renders", () => {
    const preset = getTlsPreset("rand-32-base64")!;
    expect(preset).toBeTruthy();
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslRandSpec;
    expect(tlsLine(applied, buildRandArgv(applied))).toBe("openssl rand -base64 32");
  });

  it("prime-check applies and renders", () => {
    const preset = getTlsPreset("prime-check")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslPrimeSpec;
    expect(tlsLine(applied, buildPrimeArgv(applied))).toBe("openssl prime 17");
  });

  it("s-client-showcerts applies and renders", () => {
    const preset = getTlsPreset("s-client-showcerts")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslSClientSpec;
    expect(tlsLine(applied, buildSClientArgv(applied))).toBe(
      "openssl s_client -connect example.com:443 -showcerts -servername example.com",
    );
  });

  it("s-time-benchmark applies and renders", () => {
    const preset = getTlsPreset("s-time-benchmark")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslSTimeSpec;
    expect(tlsLine(applied, buildSTimeArgv(applied))).toBe("openssl s_time -connect example.com:443 -time 30");
  });
});
