import { describe, expect, it } from "vitest";
import { validateCatalogue, lint as lintGeneric, applyAllFixes as applyAllFixesGeneric } from "@cmdgen/engine";
import {
  CA_FLAGS,
  CERT_PRESETS,
  CERT_RULES,
  CRL2PKCS7_FLAGS,
  CRL_FLAGS,
  REQ_FLAGS,
  X509_FLAGS,
  buildCaArgv,
  buildCrl2pkcs7Argv,
  buildCrlArgv,
  buildReqArgv,
  buildX509Argv,
  createSpec,
  describeSpec,
  getCertPreset,
  renderOneLine,
  type OpensslCaSpec,
  type OpensslCrl2pkcs7Spec,
  type OpensslCrlSpec,
  type OpensslReqSpec,
  type OpensslSpec,
  type OpensslX509Spec,
} from "@cmdgen/openssl";

const reqSpec = (partial: Partial<OpensslReqSpec> = {}): OpensslReqSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "req" }) as OpensslReqSpec),
  ...partial,
});
const caSpec = (partial: Partial<OpensslCaSpec> = {}): OpensslCaSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ca" }) as OpensslCaSpec),
  ...partial,
});
const x509Spec = (partial: Partial<OpensslX509Spec> = {}): OpensslX509Spec => ({
  ...(createSpec({ id: "test-spec", subcommand: "x509" }) as OpensslX509Spec),
  ...partial,
});
const crlSpec = (partial: Partial<OpensslCrlSpec> = {}): OpensslCrlSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "crl" }) as OpensslCrlSpec),
  ...partial,
});
const crl2pkcs7Spec = (partial: Partial<OpensslCrl2pkcs7Spec> = {}): OpensslCrl2pkcs7Spec => ({
  ...(createSpec({ id: "test-spec", subcommand: "crl2pkcs7" }) as OpensslCrl2pkcs7Spec),
  ...partial,
});

// buildArgv's shared dispatch switch isn't extended for this batch's
// subcommands yet (that's the integration pass's job — see build/argv.ts's
// own TEMPORARY note), so these helpers replicate exactly what that switch
// will do once wired: push the subcommand token, then the category's own
// build<Name>Argv output.
const reqLine = (spec: OpensslReqSpec) =>
  renderOneLine({ binary: "openssl", args: [{ text: "req", role: "value" }, ...buildReqArgv(spec)] }, { shell: spec.shell });
const caLine = (spec: OpensslCaSpec) =>
  renderOneLine({ binary: "openssl", args: [{ text: "ca", role: "value" }, ...buildCaArgv(spec)] }, { shell: spec.shell });
const x509Line = (spec: OpensslX509Spec) =>
  renderOneLine({ binary: "openssl", args: [{ text: "x509", role: "value" }, ...buildX509Argv(spec)] }, { shell: spec.shell });
const crlLine = (spec: OpensslCrlSpec) =>
  renderOneLine({ binary: "openssl", args: [{ text: "crl", role: "value" }, ...buildCrlArgv(spec)] }, { shell: spec.shell });
const crl2pkcs7Line = (spec: OpensslCrl2pkcs7Spec) =>
  renderOneLine({ binary: "openssl", args: [{ text: "crl2pkcs7", role: "value" }, ...buildCrl2pkcs7Argv(spec)] }, { shell: spec.shell });

const lint = (spec: OpensslSpec) => lintGeneric(spec, CERT_RULES);
const applyAllFixes = (spec: OpensslSpec) => applyAllFixesGeneric(spec, CERT_RULES);

describe("catalogue integrity", () => {
  it("every cert-category catalogue is internally consistent", () => {
    expect(validateCatalogue(REQ_FLAGS)).toEqual([]);
    expect(validateCatalogue(CA_FLAGS)).toEqual([]);
    expect(validateCatalogue(X509_FLAGS)).toEqual([]);
    expect(validateCatalogue(CRL_FLAGS)).toEqual([]);
    expect(validateCatalogue(CRL2PKCS7_FLAGS)).toEqual([]);
  });
});

describe("req", () => {
  it("renders -key when no new-key spec is given", () => {
    expect(reqLine(reqSpec({ keyFile: "key.pem", outputFile: "csr.pem", subject: "/CN=example.com" }))).toBe(
      "openssl req -key key.pem -out csr.pem -subj /CN=example.com",
    );
  });

  it("renders -newkey instead of -key when both are given (key is suppressed)", () => {
    expect(
      reqLine(reqSpec({ keyFile: "key.pem", newKeySpec: "rsa:2048", outputFile: "csr.pem" })),
    ).toBe("openssl req -newkey rsa:2048 -out csr.pem");
  });

  it("renders -new -x509 -days -nodes -sha256 flags before -newkey/-out/-subj", () => {
    const spec = reqSpec({
      newKeySpec: "rsa:2048",
      outputFile: "cert.pem",
      subject: "/CN=example.com",
      flags: { new: true, x509: true, days: 365, nodes: true, sha256: true },
    });
    expect(reqLine(spec)).toBe(
      "openssl req -new -x509 -days 365 -nodes -sha256 -newkey rsa:2048 -out cert.pem -subj /CN=example.com",
    );
  });

  it("renders nothing extra when every field is blank", () => {
    expect(reqLine(reqSpec())).toBe("openssl req");
  });

  it("flags using both -key and -newkey as an error, with a fix that clears -newkey", () => {
    const spec = reqSpec({ keyFile: "key.pem", newKeySpec: "rsa:2048" });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLC001");
    expect(diag).toBeTruthy();
    expect(diag!.level).toBe("error");
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLC001")).toBe(false);
    expect((fixed as OpensslReqSpec).keyFile).toBe("key.pem");
    expect((fixed as OpensslReqSpec).newKeySpec).toBe("");
  });

  it("flags -x509 without -days as an info note, with a fix that sets -days 365", () => {
    const spec = reqSpec({ flags: { x509: true } });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLC002");
    expect(diag).toBeTruthy();
    expect(diag!.level).toBe("info");
    const fixed = applyAllFixes(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLC002")).toBe(false);
  });

  it("does not flag -x509 with -days already set", () => {
    expect(lint(reqSpec({ flags: { x509: true, days: 365 } })).diagnostics.some((d) => d.code === "OSSLC002")).toBe(false);
  });
});

describe("ca", () => {
  it("renders -config/-in/-out before flags", () => {
    expect(
      caLine(caSpec({ configFile: "openssl.cnf", inFile: "csr.pem", outputFile: "cert.pem", flags: { batch: true, days: 30, notext: true } })),
    ).toBe("openssl ca -config openssl.cnf -in csr.pem -out cert.pem -batch -days 30 -notext");
  });

  it("flags missing -batch as an info note, with a fix", () => {
    const spec = caSpec();
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLC005");
    expect(diag).toBeTruthy();
    expect(diag!.level).toBe("info");
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLC005")).toBe(false);
  });

  it("does not flag when -batch is already set", () => {
    expect(lint(caSpec({ flags: { batch: true } })).diagnostics.some((d) => d.code === "OSSLC005")).toBe(false);
  });
});

describe("x509", () => {
  it("renders -in/-out with no signing fields when signKeyFile is blank", () => {
    expect(x509Line(x509Spec({ inFile: "cert.pem", flags: { text: true, noout: true } }))).toBe(
      "openssl x509 -in cert.pem -text -noout",
    );
  });

  it("renders -signkey/-days only when a sign key file is given", () => {
    expect(x509Line(x509Spec({ inFile: "csr.pem", outputFile: "cert.pem", signKeyFile: "key.pem", days: 365, flags: { req: true } }))).toBe(
      "openssl x509 -in csr.pem -out cert.pem -signkey key.pem -days 365 -req",
    );
  });

  it("omits -days when no sign key file is given, even with a non-default days value", () => {
    expect(x509Line(x509Spec({ inFile: "cert.pem", days: 90 }))).toBe("openssl x509 -in cert.pem");
  });

  it("flags -signkey without -req as a warning, with a fix", () => {
    const spec = x509Spec({ signKeyFile: "key.pem" });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSLC003");
    expect(diag).toBeTruthy();
    expect(diag!.level).toBe("warning");
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLC003")).toBe(false);
  });

  it("does not flag -signkey with -req already set", () => {
    expect(lint(x509Spec({ signKeyFile: "key.pem", flags: { req: true } })).diagnostics.some((d) => d.code === "OSSLC003")).toBe(false);
  });

  it("flags -noout with neither -text nor -fingerprint as an info note", () => {
    expect(lint(x509Spec({ flags: { noout: true } })).diagnostics.some((d) => d.code === "OSSLC004")).toBe(true);
    expect(lint(x509Spec({ flags: { noout: true, text: true } })).diagnostics.some((d) => d.code === "OSSLC004")).toBe(false);
    expect(lint(x509Spec({ flags: { noout: true, fingerprint: true } })).diagnostics.some((d) => d.code === "OSSLC004")).toBe(false);
  });
});

describe("crl", () => {
  it("renders -in/-out then flags", () => {
    expect(crlLine(crlSpec({ inFile: "crl.pem", flags: { text: true, hash: true } }))).toBe(
      "openssl crl -in crl.pem -text -hash",
    );
  });

  it("renders nothing extra when every field is blank", () => {
    expect(crlLine(crlSpec())).toBe("openssl crl");
  });
});

describe("crl2pkcs7", () => {
  it("repeats -certfile once per certificate file", () => {
    expect(
      crl2pkcs7Line(crl2pkcs7Spec({ crlFile: "crl.pem", certFiles: ["a.pem", "b.pem"], outputFile: "bundle.p7b" })),
    ).toBe("openssl crl2pkcs7 -in crl.pem -certfile a.pem -certfile b.pem -out bundle.p7b");
  });

  it("skips blank certificate entries", () => {
    expect(crl2pkcs7Line(crl2pkcs7Spec({ certFiles: ["", "a.pem", "  "] }))).toBe("openssl crl2pkcs7 -certfile a.pem");
  });

  it("renders -nocrl", () => {
    expect(crl2pkcs7Line(crl2pkcs7Spec({ certFiles: ["a.pem"], flags: { nocrl: true } }))).toBe(
      "openssl crl2pkcs7 -certfile a.pem -nocrl",
    );
  });
});

describe("describeSpec", () => {
  it("does not throw for any of the 5 subcommands", () => {
    expect(() => describeSpec(reqSpec())).not.toThrow();
    expect(() => describeSpec(caSpec())).not.toThrow();
    expect(() => describeSpec(x509Spec())).not.toThrow();
    expect(() => describeSpec(crlSpec())).not.toThrow();
    expect(() => describeSpec(crl2pkcs7Spec())).not.toThrow();
  });
});

describe("presets", () => {
  it("every preset has a unique id", () => {
    const ids = CERT_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(4);
  });

  it("req-new-csr applies and renders", () => {
    const applied = getCertPreset("req-new-csr")!.apply(createSpec({ id: "x" }));
    expect(reqLine(applied as OpensslReqSpec)).toBe("openssl req -new -newkey rsa:2048 -out csr.pem -subj /CN=example.com");
  });

  it("req-new-x509-selfsigned applies and renders", () => {
    const applied = getCertPreset("req-new-x509-selfsigned")!.apply(createSpec({ id: "x" }));
    expect(reqLine(applied as OpensslReqSpec)).toBe(
      "openssl req -new -x509 -days 365 -nodes -newkey rsa:2048 -out cert.pem -subj /CN=example.com",
    );
  });

  it("x509-selfsign-csr applies and renders", () => {
    const applied = getCertPreset("x509-selfsign-csr")!.apply(createSpec({ id: "x" }));
    expect(x509Line(applied as OpensslX509Spec)).toBe("openssl x509 -in csr.pem -out cert.pem -signkey key.pem -days 365 -req");
  });

  it("x509-view-details applies and renders", () => {
    const applied = getCertPreset("x509-view-details")!.apply(createSpec({ id: "x" }));
    expect(x509Line(applied as OpensslX509Spec)).toBe("openssl x509 -in cert.pem -text -noout");
  });

  it("crl-view-details applies and renders", () => {
    const applied = getCertPreset("crl-view-details")!.apply(createSpec({ id: "x" }));
    expect(crlLine(applied as OpensslCrlSpec)).toBe("openssl crl -in crl.pem -text -noout");
  });
});
