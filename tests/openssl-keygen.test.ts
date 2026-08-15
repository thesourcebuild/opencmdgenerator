import { describe, expect, it } from "vitest";
import { lint as lintGeneric, renderOneLine, validateCatalogue, type Arg } from "@cmdgen/engine";
import {
  DSA_FLAGS,
  EC_FLAGS,
  ECPARAM_FLAGS,
  GENPKEY_FLAGS,
  GENRSA_FLAGS,
  KEYGEN_RULES,
  PKEY_FLAGS,
  PKEYPARAM_FLAGS,
  RSA_FLAGS,
  buildDhparamArgv,
  buildDsaArgv,
  buildDsaparamArgv,
  buildEcArgv,
  buildEcparamArgv,
  buildGendsaArgv,
  buildGenpkeyArgv,
  buildGenrsaArgv,
  buildPkeyArgv,
  buildPkeyparamArgv,
  buildRsaArgv,
  createSpec,
  getKeygenPreset,
  type OpensslDhparamSpec,
  type OpensslDsaSpec,
  type OpensslDsaparamSpec,
  type OpensslEcSpec,
  type OpensslEcparamSpec,
  type OpensslGendsaSpec,
  type OpensslGenpkeySpec,
  type OpensslGenrsaSpec,
  type OpensslPkeySpec,
  type OpensslPkeyparamSpec,
  type OpensslRsaSpec,
  type OpensslSpec,
} from "@cmdgen/openssl";

/**
 * `buildArgv`'s top-level switch does not dispatch to Key Generation
 * subcommands yet (only the reference categories are wired — see the
 * "TEMPORARY" note in build/argv.ts; extending that switch is the
 * integrator's job for this batch), so tests call each subcommand's own
 * `build<Name>Argv` directly and prepend the leading subcommand token
 * exactly the way `buildArgv` itself does.
 */
function line(spec: OpensslSpec, args: Arg[]): string {
  return renderOneLine({ binary: "openssl", args: [{ text: spec.subcommand, role: "value" }, ...args] }, { shell: spec.shell });
}

const genrsaSpec = (partial: Partial<OpensslGenrsaSpec> = {}): OpensslGenrsaSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "genrsa" }) as OpensslGenrsaSpec),
  ...partial,
});
const genpkeySpec = (partial: Partial<OpensslGenpkeySpec> = {}): OpensslGenpkeySpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "genpkey" }) as OpensslGenpkeySpec),
  ...partial,
});
const gendsaSpec = (partial: Partial<OpensslGendsaSpec> = {}): OpensslGendsaSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "gendsa" }) as OpensslGendsaSpec),
  ...partial,
});
const rsaSpec = (partial: Partial<OpensslRsaSpec> = {}): OpensslRsaSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "rsa" }) as OpensslRsaSpec),
  ...partial,
});
const dsaSpec = (partial: Partial<OpensslDsaSpec> = {}): OpensslDsaSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "dsa" }) as OpensslDsaSpec),
  ...partial,
});
const ecSpec = (partial: Partial<OpensslEcSpec> = {}): OpensslEcSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ec" }) as OpensslEcSpec),
  ...partial,
});
const pkeySpec = (partial: Partial<OpensslPkeySpec> = {}): OpensslPkeySpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pkey" }) as OpensslPkeySpec),
  ...partial,
});
const dhparamSpec = (partial: Partial<OpensslDhparamSpec> = {}): OpensslDhparamSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "dhparam" }) as OpensslDhparamSpec),
  ...partial,
});
const ecparamSpec = (partial: Partial<OpensslEcparamSpec> = {}): OpensslEcparamSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ecparam" }) as OpensslEcparamSpec),
  ...partial,
});
const dsaparamSpec = (partial: Partial<OpensslDsaparamSpec> = {}): OpensslDsaparamSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "dsaparam" }) as OpensslDsaparamSpec),
  ...partial,
});
const pkeyparamSpec = (partial: Partial<OpensslPkeyparamSpec> = {}): OpensslPkeyparamSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pkeyparam" }) as OpensslPkeyparamSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every keygen catalogue is internally consistent", () => {
    expect(validateCatalogue(GENRSA_FLAGS)).toEqual([]);
    expect(validateCatalogue(GENPKEY_FLAGS)).toEqual([]);
    expect(validateCatalogue(RSA_FLAGS)).toEqual([]);
    expect(validateCatalogue(DSA_FLAGS)).toEqual([]);
    expect(validateCatalogue(EC_FLAGS)).toEqual([]);
    expect(validateCatalogue(PKEY_FLAGS)).toEqual([]);
    expect(validateCatalogue(ECPARAM_FLAGS)).toEqual([]);
    expect(validateCatalogue(PKEYPARAM_FLAGS)).toEqual([]);
  });
});

describe("genrsa", () => {
  it("renders -out and the bit size as a bare trailing positional", () => {
    expect(line(genrsaSpec({ outputFile: "key.pem", bits: 4096 }), buildGenrsaArgv(genrsaSpec({ outputFile: "key.pem", bits: 4096 })))).toBe(
      "openssl genrsa -out key.pem 4096",
    );
  });

  it("renders with no output file (bits still rendered)", () => {
    const spec = genrsaSpec({ outputFile: "" });
    expect(line(spec, buildGenrsaArgv(spec))).toBe("openssl genrsa 2048");
  });

  it("renders -aes256 and -passout, mutually exclusive with -des3", () => {
    const spec = genrsaSpec({ outputFile: "key.pem", flags: { aes256: true, passout: "pass:hunter2" } });
    expect(line(spec, buildGenrsaArgv(spec))).toBe("openssl genrsa -aes256 -passout pass:hunter2 -out key.pem 2048");
  });
});

describe("genpkey", () => {
  it("renders -algorithm RSA with -pkeyopt rsa_keygen_bits", () => {
    const spec = genpkeySpec({ algorithm: "RSA", bits: 2048 });
    expect(line(spec, buildGenpkeyArgv(spec))).toBe("openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048");
  });

  it("renders -algorithm EC with -pkeyopt ec_paramgen_curve", () => {
    const spec = genpkeySpec({ algorithm: "EC", curveName: "prime256v1", outputFile: "ec.pem" });
    expect(line(spec, buildGenpkeyArgv(spec))).toBe("openssl genpkey -algorithm EC -out ec.pem -pkeyopt ec_paramgen_curve:prime256v1");
  });

  it("renders -algorithm ED25519 with neither bits nor curve option", () => {
    const spec = genpkeySpec({ algorithm: "ED25519", outputFile: "ed25519key.pem" });
    expect(line(spec, buildGenpkeyArgv(spec))).toBe("openssl genpkey -algorithm ED25519 -out ed25519key.pem");
  });

  it("renders -genparam before -algorithm", () => {
    const spec = genpkeySpec({ algorithm: "RSA", flags: { genparam: true } });
    expect(line(spec, buildGenpkeyArgv(spec))).toBe("openssl genpkey -genparam -algorithm RSA -pkeyopt rsa_keygen_bits:2048");
  });
});

describe("gendsa", () => {
  it("renders -out then the trailing param file", () => {
    const spec = gendsaSpec({ outputFile: "dsakey.pem", paramFile: "dsaparam.pem" });
    expect(line(spec, buildGendsaArgv(spec))).toBe("openssl gendsa -out dsakey.pem dsaparam.pem");
  });
});

describe("rsa / dsa / ec / pkey", () => {
  it("rsa renders -in/-out and -pubout", () => {
    const spec = rsaSpec({ inFile: "key.pem", outputFile: "pub.pem", flags: { pubout: true } });
    expect(line(spec, buildRsaArgv(spec))).toBe("openssl rsa -in key.pem -out pub.pem -pubout");
  });

  it("rsa renders -check", () => {
    const spec = rsaSpec({ inFile: "key.pem", flags: { check: true } });
    expect(line(spec, buildRsaArgv(spec))).toBe("openssl rsa -in key.pem -check");
  });

  it("dsa renders -text and -noout in order", () => {
    const spec = dsaSpec({ inFile: "dsakey.pem", flags: { text: true, noout: true } });
    expect(line(spec, buildDsaArgv(spec))).toBe("openssl dsa -in dsakey.pem -text -noout");
  });

  it("ec renders -conv_form", () => {
    const spec = ecSpec({ inFile: "eckey.pem", flags: { convForm: "uncompressed" } });
    expect(line(spec, buildEcArgv(spec))).toBe("openssl ec -in eckey.pem -conv_form uncompressed");
  });

  it("pkey renders -text and -noout", () => {
    const spec = pkeySpec({ inFile: "key.pem", flags: { text: true, noout: true } });
    expect(line(spec, buildPkeyArgv(spec))).toBe("openssl pkey -in key.pem -text -noout");
  });
});

describe("dhparam / ecparam / dsaparam / pkeyparam", () => {
  it("dhparam renders -out then the bit size", () => {
    const spec = dhparamSpec({ outputFile: "dhparam.pem", bits: 2048 });
    expect(line(spec, buildDhparamArgv(spec))).toBe("openssl dhparam -out dhparam.pem 2048");
  });

  it("dsaparam renders -out then the bit size", () => {
    const spec = dsaparamSpec({ outputFile: "dsaparam.pem", bits: 2048 });
    expect(line(spec, buildDsaparamArgv(spec))).toBe("openssl dsaparam -out dsaparam.pem 2048");
  });

  it("ecparam renders -name, -out, -genkey", () => {
    const spec = ecparamSpec({ curveName: "prime256v1", outputFile: "ec-key.pem", flags: { genkey: true } });
    expect(line(spec, buildEcparamArgv(spec))).toBe("openssl ecparam -name prime256v1 -out ec-key.pem -genkey");
  });

  it("ecparam defaults to the prime256v1 curve with no output file", () => {
    const spec = ecparamSpec();
    expect(line(spec, buildEcparamArgv(spec))).toBe("openssl ecparam -name prime256v1");
  });

  it("pkeyparam renders -in/-out and -text/-noout", () => {
    const spec = pkeyparamSpec({ inFile: "params.pem", outputFile: "out.pem", flags: { text: true, noout: true } });
    expect(line(spec, buildPkeyparamArgv(spec))).toBe("openssl pkeyparam -in params.pem -out out.pem -text -noout");
  });
});

/**
 * `lint()` exported from the barrel runs `RULES` (only the reference
 * categories' rules are merged there so far — see the "TEMPORARY" note in
 * lint/rules.ts; adding `KEYGEN_RULES` to that merge is the integrator's
 * job), so these tests run `KEYGEN_RULES` directly through the same generic
 * `lint` runner the wrapper itself uses.
 */
const lintKeygen = (spec: OpensslSpec) => lintGeneric(spec, KEYGEN_RULES);

describe("keygen lint rules", () => {
  it("OSSLK001: rsa/dsa/ec/pkey -noout alone is flagged, but not with -text or -pubout", () => {
    expect(lintKeygen(rsaSpec({ flags: { noout: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(true);
    expect(lintKeygen(rsaSpec({ flags: { noout: true, text: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(false);
    expect(lintKeygen(rsaSpec({ flags: { noout: true, pubout: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(false);
    expect(lintKeygen(rsaSpec({ flags: { noout: true, check: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(false);
    expect(lintKeygen(dsaSpec({ flags: { noout: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(true);
    expect(lintKeygen(ecSpec({ flags: { noout: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(true);
    expect(lintKeygen(pkeySpec({ flags: { noout: true } })).diagnostics.some((d) => d.code === "OSSLK001")).toBe(true);
  });

  it("OSSLK002: ecparam -noout without -genkey is flagged, but not with -genkey", () => {
    expect(lintKeygen(ecparamSpec({ flags: { noout: true } })).diagnostics.some((d) => d.code === "OSSLK002")).toBe(true);
    expect(lintKeygen(ecparamSpec({ flags: { noout: true, genkey: true } })).diagnostics.some((d) => d.code === "OSSLK002")).toBe(false);
  });

  it("OSSLK003: genpkey -algorithm EC without a curve is an error", () => {
    expect(lintKeygen(genpkeySpec({ algorithm: "EC", curveName: "" })).diagnostics.some((d) => d.code === "OSSLK003")).toBe(true);
    expect(lintKeygen(genpkeySpec({ algorithm: "EC", curveName: "prime256v1" })).diagnostics.some((d) => d.code === "OSSLK003")).toBe(false);
    expect(lintKeygen(genpkeySpec({ algorithm: "RSA", curveName: "" })).diagnostics.some((d) => d.code === "OSSLK003")).toBe(false);
  });

  it("OSSLK004: genpkey ED25519/X25519 with bits or curve set is an info note", () => {
    expect(lintKeygen(genpkeySpec({ algorithm: "ED25519" })).diagnostics.some((d) => d.code === "OSSLK004")).toBe(false);
    expect(lintKeygen(genpkeySpec({ algorithm: "ED25519", bits: 4096 })).diagnostics.some((d) => d.code === "OSSLK004")).toBe(true);
    expect(lintKeygen(genpkeySpec({ algorithm: "X25519", curveName: "prime256v1" })).diagnostics.some((d) => d.code === "OSSLK004")).toBe(true);
    expect(lintKeygen(genpkeySpec({ algorithm: "RSA", bits: 4096 })).diagnostics.some((d) => d.code === "OSSLK004")).toBe(false);
  });
});

describe("keygen presets", () => {
  it("genrsa-4096 applies and renders", () => {
    const preset = getKeygenPreset("genrsa-4096")!;
    expect(preset).toBeTruthy();
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslGenrsaSpec;
    expect(line(applied, buildGenrsaArgv(applied))).toBe("openssl genrsa -out key.pem 4096");
  });

  it("genpkey-ed25519 applies and renders", () => {
    const preset = getKeygenPreset("genpkey-ed25519")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslGenpkeySpec;
    expect(line(applied, buildGenpkeyArgv(applied))).toBe("openssl genpkey -algorithm ED25519 -out ed25519key.pem");
  });

  it("ecparam-p256-genkey applies and renders", () => {
    const preset = getKeygenPreset("ecparam-p256-genkey")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslEcparamSpec;
    expect(line(applied, buildEcparamArgv(applied))).toBe("openssl ecparam -name prime256v1 -out ec-key.pem -genkey");
  });

  it("dhparam-2048 applies and renders", () => {
    const preset = getKeygenPreset("dhparam-2048")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslDhparamSpec;
    expect(line(applied, buildDhparamArgv(applied))).toBe("openssl dhparam -out dhparam.pem 2048");
  });

  it("rsa-extract-pubkey applies and renders", () => {
    const preset = getKeygenPreset("rsa-extract-pubkey")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslRsaSpec;
    expect(line(applied, buildRsaArgv(applied))).toBe("openssl rsa -in key.pem -out pub.pem -pubout");
  });

  it("every keygen preset has a unique id", () => {
    const ids = ["genrsa-4096", "genpkey-ed25519", "ecparam-p256-genkey", "dhparam-2048", "rsa-extract-pubkey"];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(getKeygenPreset(id)).toBeTruthy();
  });
});
