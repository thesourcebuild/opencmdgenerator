import { describe, expect, it } from "vitest";
import { lint as lintGeneric, renderOneLine, validateCatalogue, type Arg } from "@cmdgen/engine";
import {
  CONFIGUTL_FLAGS,
  SKEYUTL_FLAGS,
  SMIME_FLAGS,
  SMIME_RULES,
  SPKAC_FLAGS,
  SRP_FLAGS,
  STOREUTL_FLAGS,
  buildConfigutlArgv,
  buildSkeyutlArgv,
  buildSmimeArgv,
  buildSpkacArgv,
  buildSrpArgv,
  buildStoreutlArgv,
  createSpec,
  getSmimePreset,
  type OpensslConfigutlSpec,
  type OpensslSkeyutlSpec,
  type OpensslSmimeSpec,
  type OpensslSpec,
  type OpensslSpkacSpec,
  type OpensslSrpSpec,
  type OpensslStoreutlSpec,
} from "@cmdgen/openssl";

/**
 * `SMIME_RULES` is not yet merged into the shared `lint/rules.ts` (that
 * happens during integration), so tests exercise these rules directly
 * against the generic engine runner rather than the package's own `lint()`.
 */
const lint = (spec: OpensslSpec) => lintGeneric(spec, SMIME_RULES);

/**
 * These 6 subcommands are not yet wired into the shared `build/argv.ts`
 * dispatch (that switch is extended by whoever integrates this batch), so we
 * assemble the full `openssl <subcommand> ...` argv by hand here — mirroring
 * exactly what `build/argv.ts` will do once wired: push the subcommand token,
 * then splice in this category's own `build<Name>Argv` output.
 */
function lineFor(subcommand: string, args: Arg[]): string {
  return renderOneLine({ binary: "openssl", args: [{ text: subcommand, role: "value" }, ...args] }, { shell: "posix" });
}

const smimeSpec = (partial: Partial<OpensslSmimeSpec> = {}): OpensslSmimeSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "smime" }) as OpensslSmimeSpec),
  ...partial,
});
const spkacSpec = (partial: Partial<OpensslSpkacSpec> = {}): OpensslSpkacSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "spkac" }) as OpensslSpkacSpec),
  ...partial,
});
const srpSpec = (partial: Partial<OpensslSrpSpec> = {}): OpensslSrpSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "srp" }) as OpensslSrpSpec),
  ...partial,
});
const storeutlSpec = (partial: Partial<OpensslStoreutlSpec> = {}): OpensslStoreutlSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "storeutl" }) as OpensslStoreutlSpec),
  ...partial,
});
const skeyutlSpec = (partial: Partial<OpensslSkeyutlSpec> = {}): OpensslSkeyutlSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "skeyutl" }) as OpensslSkeyutlSpec),
  ...partial,
});
const configutlSpec = (partial: Partial<OpensslConfigutlSpec> = {}): OpensslConfigutlSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "configutl" }) as OpensslConfigutlSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every smime-batch catalogue is internally consistent", () => {
    expect(validateCatalogue(SMIME_FLAGS)).toEqual([]);
    expect(validateCatalogue(SPKAC_FLAGS)).toEqual([]);
    expect(validateCatalogue(SRP_FLAGS)).toEqual([]);
    expect(validateCatalogue(STOREUTL_FLAGS)).toEqual([]);
    expect(validateCatalogue(SKEYUTL_FLAGS)).toEqual([]);
    expect(validateCatalogue(CONFIGUTL_FLAGS)).toEqual([]);
  });
});

describe("smime", () => {
  it("renders the sign action with -signer/-inkey", () => {
    const spec = smimeSpec({
      action: "sign",
      inFile: "message.txt",
      outputFile: "message.p7s",
      flags: { signer: "signer.pem", inkey: "key.pem" },
    });
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe(
      "openssl smime -sign -signer signer.pem -inkey key.pem -in message.txt -out message.p7s",
    );
  });

  it("renders the encrypt action with -recip", () => {
    const spec = smimeSpec({ action: "encrypt", inFile: "message.txt", outputFile: "message.enc", flags: { recip: "recipient.pem" } });
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe(
      "openssl smime -encrypt -recip recipient.pem -in message.txt -out message.enc",
    );
  });

  it("renders the decrypt action with -inkey", () => {
    const spec = smimeSpec({ action: "decrypt", inFile: "message.enc", outputFile: "message.txt", flags: { inkey: "key.pem" } });
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe(
      "openssl smime -decrypt -inkey key.pem -in message.enc -out message.txt",
    );
  });

  it("renders the verify action with -text", () => {
    const spec = smimeSpec({ action: "verify", inFile: "message.p7s", flags: { text: true } });
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe("openssl smime -verify -text -in message.p7s");
  });

  it("flags encrypt without -recip as an error", () => {
    const spec = smimeSpec({ action: "encrypt" });
    expect(lint(spec).diagnostics.some((d) => d.code === "OSSLS001")).toBe(true);
    expect(lint(smimeSpec({ action: "encrypt", flags: { recip: "recipient.pem" } })).diagnostics.some((d) => d.code === "OSSLS001")).toBe(
      false,
    );
  });

  it("flags sign without -signer as an error", () => {
    const spec = smimeSpec({ action: "sign" });
    expect(lint(spec).diagnostics.some((d) => d.code === "OSSLS002")).toBe(true);
    expect(lint(smimeSpec({ action: "sign", flags: { signer: "signer.pem" } })).diagnostics.some((d) => d.code === "OSSLS002")).toBe(
      false,
    );
  });
});

describe("spkac", () => {
  it("renders -key/-challenge with flags", () => {
    const spec = spkacSpec({ keyFile: "key.pem", challenge: "hunter2" });
    expect(lineFor("spkac", buildSpkacArgv(spec))).toBe("openssl spkac -key key.pem -challenge hunter2");
  });

  it("renders -verify", () => {
    const spec = spkacSpec({ flags: { verify: true } });
    expect(lineFor("spkac", buildSpkacArgv(spec))).toBe("openssl spkac -verify");
  });

  it("flags a keyFile set alongside -verify as an info note, with a fix", () => {
    const spec = spkacSpec({ keyFile: "key.pem", flags: { verify: true } });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLS003");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLS003")).toBe(false);
  });

  it("does not flag a keyFile when not verifying", () => {
    expect(lint(spkacSpec({ keyFile: "key.pem" })).diagnostics.some((d) => d.code === "OSSLS003")).toBe(false);
  });
});

describe("srp", () => {
  it("renders -add with a username", () => {
    const spec = srpSpec({ username: "alice", flags: { add: true } });
    expect(lineFor("srp", buildSrpArgv(spec))).toBe("openssl srp -add alice");
  });

  it("renders -delete with a username", () => {
    const spec = srpSpec({ username: "alice", flags: { delete: true } });
    expect(lineFor("srp", buildSrpArgv(spec))).toBe("openssl srp -delete alice");
  });

  it("flags -add and -delete both set as an error, with a fix", () => {
    const spec = srpSpec({ username: "alice", flags: { add: true, delete: true } });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLS004");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLS004")).toBe(false);
  });
});

describe("storeutl", () => {
  it("renders flags before the trailing uri positional", () => {
    const spec = storeutlSpec({ uri: "store.p12", flags: { certs: true, text: true } });
    expect(lineFor("storeutl", buildStoreutlArgv(spec))).toBe("openssl storeutl -certs -text store.p12");
  });

  it("flags an empty uri as an error", () => {
    expect(lint(storeutlSpec({ uri: "" })).diagnostics.some((d) => d.code === "OSSLS005")).toBe(true);
    expect(lint(storeutlSpec({ uri: "store.p12" })).diagnostics.some((d) => d.code === "OSSLS005")).toBe(false);
  });
});

describe("skeyutl", () => {
  it("renders -generate -keylen with -out", () => {
    const spec = skeyutlSpec({ outputFile: "key.bin", flags: { generate: true, keylen: 256 } });
    expect(lineFor("skeyutl", buildSkeyutlArgv(spec))).toBe("openssl skeyutl -generate -keylen 256 -out key.bin");
  });

  it("flags no -generate and no output file as an info note, with a fix", () => {
    const spec = skeyutlSpec();
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLS006");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLS006")).toBe(false);
  });

  it("does not flag when an output file is already set", () => {
    expect(lint(skeyutlSpec({ outputFile: "key.bin" })).diagnostics.some((d) => d.code === "OSSLS006")).toBe(false);
  });
});

describe("configutl", () => {
  it("renders -in with -section/-noheader", () => {
    const spec = configutlSpec({ configFile: "openssl.cnf", flags: { section: "req", noheader: true } });
    expect(lineFor("configutl", buildConfigutlArgv(spec))).toBe("openssl configutl -in openssl.cnf -section req -noheader");
  });
});

describe("smime-batch presets", () => {
  it("smime-sign-message applies and renders", () => {
    const preset = getSmimePreset("smime-sign-message")!;
    const applied = preset.apply(createSpec({ id: "x", subcommand: "smime" }));
    expect(applied.subcommand).toBe("smime");
    const spec = applied as OpensslSmimeSpec;
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe(
      "openssl smime -sign -signer signer.pem -inkey key.pem -in message.txt -out message.p7s",
    );
  });

  it("smime-encrypt-message applies and renders", () => {
    const preset = getSmimePreset("smime-encrypt-message")!;
    const spec = preset.apply(createSpec({ id: "x", subcommand: "smime" })) as OpensslSmimeSpec;
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe(
      "openssl smime -encrypt -recip recipient.pem -in message.txt -out message.enc",
    );
  });

  it("smime-verify-message applies and renders", () => {
    const preset = getSmimePreset("smime-verify-message")!;
    const spec = preset.apply(createSpec({ id: "x", subcommand: "smime" })) as OpensslSmimeSpec;
    expect(lineFor("smime", buildSmimeArgv(spec))).toBe("openssl smime -verify -text -in message.p7s -out message.txt");
  });

  it("storeutl-list-certs applies and renders", () => {
    const preset = getSmimePreset("storeutl-list-certs")!;
    const spec = preset.apply(createSpec({ id: "x", subcommand: "storeutl" })) as OpensslStoreutlSpec;
    expect(lineFor("storeutl", buildStoreutlArgv(spec))).toBe("openssl storeutl -certs -text store.p12");
  });

  it("every smime-batch preset has a unique id", () => {
    const ids = ["smime-sign-message", "smime-encrypt-message", "smime-verify-message", "storeutl-list-certs"];
    const seen = new Set<string>();
    for (const id of ids) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
      expect(getSmimePreset(id)).toBeTruthy();
    }
  });
});
