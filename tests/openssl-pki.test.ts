import { describe, expect, it } from "vitest";
import { lint as lintGeneric, validateCatalogue } from "@cmdgen/engine";
import {
  CMP_FLAGS,
  CMS_FLAGS,
  ECH_FLAGS,
  FIPSINSTALL_FLAGS,
  OCSP_FLAGS,
  PKI_RULES,
  TS_FLAGS,
  buildCmpArgv,
  buildCmsArgv,
  buildEchArgv,
  buildFipsinstallArgv,
  buildOcspArgv,
  buildTsArgv,
  createSpec,
  getPkiPreset,
  renderOneLine,
  type Arg,
  type Argv,
  type OpensslCmpSpec,
  type OpensslCmsSpec,
  type OpensslEchSpec,
  type OpensslFipsinstallSpec,
  type OpensslOcspSpec,
  type OpensslSpec,
  type OpensslTsSpec,
} from "@cmdgen/openssl";

/**
 * `lint/rules.ts`'s shared `RULES` (and therefore the barrel's `lint()`) only
 * merges the reference categories' rules so far (see its own TEMPORARY note)
 * — this batch does not touch that shared file, so tests here run this
 * batch's own `PKI_RULES` directly through the generic engine `lint`,
 * mirroring exactly what integration will add to that merge.
 */
const lint = (spec: OpensslSpec) => lintGeneric(spec, PKI_RULES);

/**
 * `build/argv.ts`'s shared `buildArgv` dispatcher only wires the reference
 * categories so far (see its own TEMPORARY note) — this batch does not touch
 * that shared file, so tests here compose the subcommand token + this
 * batch's own `build<Name>Argv` functions directly, mirroring exactly what
 * integration will add to that switch.
 */
function buildPkiArgv(spec: OpensslSpec): Argv {
  const args: Arg[] = [{ text: spec.subcommand, role: "value" }];
  switch (spec.subcommand) {
    case "ocsp":
      args.push(...buildOcspArgv(spec));
      break;
    case "ts":
      args.push(...buildTsArgv(spec));
      break;
    case "cmp":
      args.push(...buildCmpArgv(spec));
      break;
    case "cms":
      args.push(...buildCmsArgv(spec));
      break;
    case "fipsinstall":
      args.push(...buildFipsinstallArgv(spec));
      break;
    case "ech":
      args.push(...buildEchArgv(spec));
      break;
    default:
      break;
  }
  return { binary: "openssl", args };
}

const line = (spec: OpensslSpec) => renderOneLine(buildPkiArgv(spec), { shell: spec.shell });

const ocspSpec = (partial: Partial<OpensslOcspSpec> = {}): OpensslOcspSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ocsp" }) as OpensslOcspSpec),
  ...partial,
});
const tsSpec = (partial: Partial<OpensslTsSpec> = {}): OpensslTsSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ts" }) as OpensslTsSpec),
  ...partial,
});
const cmpSpec = (partial: Partial<OpensslCmpSpec> = {}): OpensslCmpSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "cmp" }) as OpensslCmpSpec),
  ...partial,
});
const cmsSpec = (partial: Partial<OpensslCmsSpec> = {}): OpensslCmsSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "cms" }) as OpensslCmsSpec),
  ...partial,
});
const fipsinstallSpec = (partial: Partial<OpensslFipsinstallSpec> = {}): OpensslFipsinstallSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "fipsinstall" }) as OpensslFipsinstallSpec),
  ...partial,
});
const echSpec = (partial: Partial<OpensslEchSpec> = {}): OpensslEchSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ech" }) as OpensslEchSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every PKI/advanced catalogue is internally consistent", () => {
    expect(validateCatalogue(OCSP_FLAGS)).toEqual([]);
    expect(validateCatalogue(TS_FLAGS)).toEqual([]);
    expect(validateCatalogue(CMP_FLAGS)).toEqual([]);
    expect(validateCatalogue(CMS_FLAGS)).toEqual([]);
    expect(validateCatalogue(FIPSINSTALL_FLAGS)).toEqual([]);
    expect(validateCatalogue(ECH_FLAGS)).toEqual([]);
  });
});

describe("ocsp", () => {
  it("renders issuer/cert/url in real order", () => {
    expect(line(ocspSpec({ issuerFile: "issuer.pem", certFile: "cert.pem", url: "http://ocsp.example.com" }))).toBe(
      "openssl ocsp -issuer issuer.pem -cert cert.pem -url http://ocsp.example.com",
    );
  });

  it("renders -text and -noverify", () => {
    expect(
      line(ocspSpec({ certFile: "cert.pem", url: "http://ocsp.example.com", flags: { text: true, noverify: true } })),
    ).toBe("openssl ocsp -cert cert.pem -url http://ocsp.example.com -text -noverify");
  });

  it("flags -noverify as a lint warning with a fix", () => {
    const spec = ocspSpec({ certFile: "cert.pem", url: "http://ocsp.example.com", flags: { noverify: true } });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLPK001");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLPK001")).toBe(false);
  });

  it("flags a missing cert/url as an error", () => {
    expect(lint(ocspSpec()).diagnostics.some((d) => d.code === "OSSLPK002")).toBe(true);
    expect(
      lint(ocspSpec({ certFile: "cert.pem", url: "http://ocsp.example.com" })).diagnostics.some((d) => d.code === "OSSLPK002"),
    ).toBe(false);
  });
});

describe("ts", () => {
  it("renders -query with -in/-out", () => {
    expect(line(tsSpec({ action: "query", inFile: "document.txt", outputFile: "request.tsq" }))).toBe(
      "openssl ts -query -in document.txt -out request.tsq",
    );
  });

  it("renders -query with -data instead of -in", () => {
    expect(line(tsSpec({ action: "query", flags: { data: "file.bin" } }))).toBe("openssl ts -query -data file.bin");
  });

  it("renders -reply with -in/-out", () => {
    expect(line(tsSpec({ action: "reply", inFile: "request.tsq", outputFile: "response.tsr" }))).toBe(
      "openssl ts -reply -in request.tsq -out response.tsr",
    );
  });

  it("renders -verify with -CAfile", () => {
    expect(line(tsSpec({ action: "verify", inFile: "response.tsr", flags: { caFile: "ca.pem" } }))).toBe(
      "openssl ts -verify -CAfile ca.pem -in response.tsr",
    );
  });

  it("omits -CAfile/-data when set but not applicable to the current action", () => {
    expect(line(tsSpec({ action: "query", flags: { caFile: "ca.pem" } }))).toBe("openssl ts -query");
    expect(line(tsSpec({ action: "verify", flags: { data: "file.bin" } }))).toBe("openssl ts -verify");
  });

  it("flags -verify without -CAfile as a lint warning", () => {
    expect(lint(tsSpec({ action: "verify" })).diagnostics.some((d) => d.code === "OSSLPK003")).toBe(true);
    expect(lint(tsSpec({ action: "verify", flags: { caFile: "ca.pem" } })).diagnostics.some((d) => d.code === "OSSLPK003")).toBe(
      false,
    );
  });

  it("flags -query with both inFile and -data as an error", () => {
    const spec = tsSpec({ action: "query", inFile: "request.tsq", flags: { data: "file.bin" } });
    expect(lint(spec).diagnostics.some((d) => d.code === "OSSLPK004")).toBe(true);
    expect(lint(tsSpec({ action: "query", inFile: "request.tsq" })).diagnostics.some((d) => d.code === "OSSLPK004")).toBe(false);
    expect(lint(tsSpec({ action: "query", flags: { data: "file.bin" } })).diagnostics.some((d) => d.code === "OSSLPK004")).toBe(
      false,
    );
  });
});

describe("cmp", () => {
  it("renders -server with flags", () => {
    expect(
      line(cmpSpec({ server: "cmp.example.com:80", flags: { cmd: "ir", cert: "client.pem", key: "client.key" } })),
    ).toBe("openssl cmp -server cmp.example.com:80 -cmd ir -cert client.pem -key client.key");
  });

  it("renders -certout", () => {
    expect(line(cmpSpec({ server: "cmp.example.com:80", flags: { cmd: "cr", certout: "newcert.pem" } }))).toBe(
      "openssl cmp -server cmp.example.com:80 -cmd cr -certout newcert.pem",
    );
  });
});

describe("cms", () => {
  it("renders -encrypt with -recip", () => {
    expect(line(cmsSpec({ action: "encrypt", inFile: "message.txt", outputFile: "message.p7m", flags: { recip: "recipient.pem" } }))).toBe(
      "openssl cms -encrypt -recip recipient.pem -in message.txt -out message.p7m",
    );
  });

  it("renders -sign with -signer/-inkey", () => {
    expect(
      line(
        cmsSpec({
          action: "sign",
          inFile: "message.txt",
          outputFile: "message.p7s",
          flags: { signer: "signer.pem", inkey: "signer.key" },
        }),
      ),
    ).toBe("openssl cms -sign -signer signer.pem -inkey signer.key -in message.txt -out message.p7s");
  });

  it("renders -decrypt with -inkey", () => {
    expect(line(cmsSpec({ action: "decrypt", flags: { inkey: "priv.key" } }))).toBe("openssl cms -decrypt -inkey priv.key");
  });

  it("omits -recip/-signer when set but not applicable to the current action", () => {
    expect(line(cmsSpec({ action: "sign", flags: { recip: "recipient.pem" } }))).toBe("openssl cms -sign");
    expect(line(cmsSpec({ action: "encrypt", flags: { signer: "signer.pem" } }))).toBe("openssl cms -encrypt");
  });

  it("flags -encrypt without -recip as an error", () => {
    expect(lint(cmsSpec({ action: "encrypt" })).diagnostics.some((d) => d.code === "OSSLPK005")).toBe(true);
    expect(lint(cmsSpec({ action: "encrypt", flags: { recip: "recipient.pem" } })).diagnostics.some((d) => d.code === "OSSLPK005")).toBe(
      false,
    );
  });

  it("flags -sign without -signer as an error", () => {
    expect(lint(cmsSpec({ action: "sign" })).diagnostics.some((d) => d.code === "OSSLPK006")).toBe(true);
    expect(lint(cmsSpec({ action: "sign", flags: { signer: "signer.pem" } })).diagnostics.some((d) => d.code === "OSSLPK006")).toBe(
      false,
    );
  });

  it("flags -decrypt without -inkey as an error", () => {
    expect(lint(cmsSpec({ action: "decrypt" })).diagnostics.some((d) => d.code === "OSSLPK007")).toBe(true);
    expect(lint(cmsSpec({ action: "decrypt", flags: { inkey: "priv.key" } })).diagnostics.some((d) => d.code === "OSSLPK007")).toBe(
      false,
    );
  });
});

describe("fipsinstall", () => {
  it("renders -out -module with flags", () => {
    expect(
      line(fipsinstallSpec({ outputFile: "fipsmodule.cnf", moduleFile: "fips.so", flags: { providerName: "fips", macName: "HMAC" } })),
    ).toBe("openssl fipsinstall -out fipsmodule.cnf -module fips.so -provider_name fips -mac_name HMAC");
  });
});

describe("ech", () => {
  it("renders -public_name -out with flags", () => {
    expect(line(echSpec({ publicName: "example.com", outputFile: "ech.pem", flags: { pemout: "ech-alt.pem" } }))).toBe(
      "openssl ech -public_name example.com -out ech.pem -pemout ech-alt.pem",
    );
  });
});

describe("PKI presets", () => {
  it("every preset has a unique id", () => {
    const ids = ["ocsp-check-status", "ts-create-request", "ts-verify-response", "cms-sign-message"];
    const seen = new Set<string>();
    for (const id of ids) {
      const preset = getPkiPreset(id);
      expect(preset).toBeTruthy();
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });

  it("ocsp-check-status applies and renders", () => {
    const preset = getPkiPreset("ocsp-check-status")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe("openssl ocsp -issuer issuer.pem -cert cert.pem -url http://ocsp.example.com -text");
  });

  it("ts-create-request applies and renders", () => {
    const preset = getPkiPreset("ts-create-request")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe("openssl ts -query -in document.txt -out request.tsq");
  });

  it("ts-verify-response applies and renders", () => {
    const preset = getPkiPreset("ts-verify-response")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe("openssl ts -verify -CAfile ca.pem -in response.tsr");
  });

  it("cms-sign-message applies and renders", () => {
    const preset = getPkiPreset("cms-sign-message")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe(
      "openssl cms -sign -signer signer.pem -inkey signer.key -in message.txt -out message.p7s",
    );
  });
});
