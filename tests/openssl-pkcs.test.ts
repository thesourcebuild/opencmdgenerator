import { describe, expect, it } from "vitest";
import { lint as lintGeneric, applyAllFixes as applyAllFixesGeneric, renderOneLine, validateCatalogue, type Arg } from "@cmdgen/engine";
import {
  KDF_FLAGS,
  PASSWD_FLAGS,
  PKCS12_FLAGS,
  PKCS7_FLAGS,
  PKCS8_FLAGS,
  PKCS_RULES,
  PKCS_PRESETS,
  buildKdfArgv,
  buildPasswdArgv,
  buildPkcs12Argv,
  buildPkcs7Argv,
  buildPkcs8Argv,
  createSpec,
  getPkcsPreset,
  type OpensslKdfSpec,
  type OpensslPasswdSpec,
  type OpensslPkcs12Spec,
  type OpensslPkcs7Spec,
  type OpensslPkcs8Spec,
  type OpensslSpec,
} from "@cmdgen/openssl";

function lineFor(subcommand: string, args: Arg[]): string {
  return renderOneLine({ binary: "openssl", args: [{ text: subcommand, role: "value" }, ...args] }, { shell: "posix" });
}

const lint = (spec: OpensslSpec) => lintGeneric(spec, PKCS_RULES);
const applyAllFixes = (spec: OpensslSpec) => applyAllFixesGeneric(spec, PKCS_RULES);

const pkcs12Spec = (partial: Partial<OpensslPkcs12Spec> = {}): OpensslPkcs12Spec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pkcs12" }) as OpensslPkcs12Spec),
  ...partial,
});
const pkcs7Spec = (partial: Partial<OpensslPkcs7Spec> = {}): OpensslPkcs7Spec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pkcs7" }) as OpensslPkcs7Spec),
  ...partial,
});
const pkcs8Spec = (partial: Partial<OpensslPkcs8Spec> = {}): OpensslPkcs8Spec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pkcs8" }) as OpensslPkcs8Spec),
  ...partial,
});
const passwdSpec = (partial: Partial<OpensslPasswdSpec> = {}): OpensslPasswdSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "passwd" }) as OpensslPasswdSpec),
  ...partial,
});
const kdfSpec = (partial: Partial<OpensslKdfSpec> = {}): OpensslKdfSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "kdf" }) as OpensslKdfSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every pkcs-category catalogue is internally consistent", () => {
    expect(validateCatalogue(PKCS12_FLAGS)).toEqual([]);
    expect(validateCatalogue(PKCS7_FLAGS)).toEqual([]);
    expect(validateCatalogue(PKCS8_FLAGS)).toEqual([]);
    expect(validateCatalogue(PASSWD_FLAGS)).toEqual([]);
    expect(validateCatalogue(KDF_FLAGS)).toEqual([]);
  });
});

describe("pkcs12", () => {
  it("renders export mode as -export -inkey -in -out", () => {
    const spec = pkcs12Spec({ keyFile: "key.pem", certFile: "cert.pem", outputFile: "bundle.p12", flags: { export: true } });
    expect(lineFor("pkcs12", buildPkcs12Argv(spec))).toBe("openssl pkcs12 -export -inkey key.pem -in cert.pem -out bundle.p12");
  });

  it("renders extract mode as -in -out, reusing inFile as the .p12 itself", () => {
    const spec = pkcs12Spec({ inFile: "bundle.p12", outputFile: "key.pem", flags: { nodes: true } });
    expect(lineFor("pkcs12", buildPkcs12Argv(spec))).toBe("openssl pkcs12 -nodes -in bundle.p12 -out key.pem");
  });

  it("flags missing key/cert fields in export mode as errors", () => {
    const spec = pkcs12Spec({ flags: { export: true } });
    const diags = lint(spec).diagnostics.filter((d) => d.code === "OSSLP001");
    expect(diags.length).toBe(2);
    expect(diags.some((d) => d.field === "keyFile")).toBe(true);
    expect(diags.some((d) => d.field === "certFile")).toBe(true);
  });

  it("does not flag export mode once both fields are set", () => {
    const spec = pkcs12Spec({ keyFile: "key.pem", certFile: "cert.pem", flags: { export: true } });
    expect(lint(spec).diagnostics.some((d) => d.code === "OSSLP001")).toBe(false);
  });

  it("flags a missing inFile in extract mode as an error", () => {
    expect(lint(pkcs12Spec()).diagnostics.some((d) => d.code === "OSSLP002")).toBe(true);
    expect(lint(pkcs12Spec({ inFile: "bundle.p12" })).diagnostics.some((d) => d.code === "OSSLP002")).toBe(false);
  });
});

describe("pkcs7", () => {
  it("renders -print_certs/-text with -in/-out", () => {
    const spec = pkcs7Spec({ inFile: "bundle.p7b", outputFile: "out.pem", flags: { printCerts: true, text: true } });
    expect(lineFor("pkcs7", buildPkcs7Argv(spec))).toBe("openssl pkcs7 -print_certs -text -in bundle.p7b -out out.pem");
  });

  it("renders with no flags and no files", () => {
    expect(lineFor("pkcs7", buildPkcs7Argv(pkcs7Spec()))).toBe("openssl pkcs7");
  });
});

describe("pkcs8", () => {
  it("renders -topk8 -v2 with -in/-out", () => {
    const spec = pkcs8Spec({ inFile: "key.pem", outputFile: "key.p8", flags: { topk8: true, v2: "aes256" } });
    expect(lineFor("pkcs8", buildPkcs8Argv(spec))).toBe("openssl pkcs8 -topk8 -v2 aes256 -in key.pem -out key.p8");
  });

  it("flags -nocrypt without -topk8 as an info note, and the fix silences it", () => {
    const spec = pkcs8Spec({ flags: { nocrypt: true } });
    const diag = lint(spec).diagnostics.find((d) => d.code === "OSSLP003");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLP003")).toBe(false);
  });

  it("does not flag -nocrypt alongside -topk8", () => {
    expect(lint(pkcs8Spec({ flags: { nocrypt: true, topk8: true } })).diagnostics.some((d) => d.code === "OSSLP003")).toBe(false);
  });
});

describe("passwd", () => {
  it("renders passwords as bare trailing positionals after flags", () => {
    const spec = passwdSpec({ passwords: ["hunter2", "swordfish"], flags: { sha512: true } });
    expect(lineFor("passwd", buildPasswdArgv(spec))).toBe("openssl passwd -6 hunter2 swordfish");
  });

  it("skips blank password entries", () => {
    expect(lineFor("passwd", buildPasswdArgv(passwdSpec({ passwords: ["", "hunter2", "  "] })))).toBe("openssl passwd hunter2");
  });

  it("renders -salt with its value", () => {
    expect(lineFor("passwd", buildPasswdArgv(passwdSpec({ flags: { salt: "abc" } })))).toBe("openssl passwd -salt abc");
  });

  it("flags multiple algorithm flags as an error, and the fix keeps only the first", () => {
    const spec = passwdSpec({ flags: { sha512: true, md5: true } });
    const diag = lint(spec).diagnostics.find((d) => d.code === "OSSLP004");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = applyAllFixes(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSLP004")).toBe(false);
    expect(fixed.flags.sha512).toBe(true);
    expect(fixed.flags.md5).toBeUndefined();
  });

  it("does not flag a single algorithm flag", () => {
    expect(lint(passwdSpec({ flags: { sha512: true } })).diagnostics.some((d) => d.code === "OSSLP004")).toBe(false);
  });

  it("flags -salt as an info note", () => {
    expect(lint(passwdSpec({ flags: { salt: "abc" } })).diagnostics.some((d) => d.code === "OSSLP005")).toBe(true);
    expect(lint(passwdSpec()).diagnostics.some((d) => d.code === "OSSLP005")).toBe(false);
  });
});

describe("kdf", () => {
  it("renders -kdfopt and -keylen with the KDF name trailing last", () => {
    const spec = kdfSpec({ kdfName: "PBKDF2", keyLength: 32, flags: { kdfopt: "digest:SHA256" } });
    expect(lineFor("kdf", buildKdfArgv(spec))).toBe("openssl kdf -kdfopt digest:SHA256 -keylen 32 PBKDF2");
  });

  it("always renders -keylen even with no other flags", () => {
    expect(lineFor("kdf", buildKdfArgv(kdfSpec({ kdfName: "HKDF", keyLength: 16 })))).toBe("openssl kdf -keylen 16 HKDF");
  });
});

describe("presets", () => {
  it("every preset has a unique id", () => {
    const seenIds = new Set<string>();
    for (const preset of PKCS_PRESETS) {
      expect(seenIds.has(preset.id)).toBe(false);
      seenIds.add(preset.id);
    }
    expect(seenIds.size).toBe(PKCS_PRESETS.length);
  });

  it("pkcs12-export-bundle applies and renders", () => {
    const preset = getPkcsPreset("pkcs12-export-bundle")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslPkcs12Spec;
    expect(lineFor("pkcs12", buildPkcs12Argv(applied))).toBe("openssl pkcs12 -export -inkey key.pem -in cert.pem -out bundle.p12");
  });

  it("pkcs12-extract-key applies and renders", () => {
    const preset = getPkcsPreset("pkcs12-extract-key")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslPkcs12Spec;
    expect(lineFor("pkcs12", buildPkcs12Argv(applied))).toBe("openssl pkcs12 -nodes -in bundle.p12 -out key.pem");
  });

  it("pkcs8-convert-to-pkcs8 applies and renders", () => {
    const preset = getPkcsPreset("pkcs8-convert-to-pkcs8")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslPkcs8Spec;
    expect(lineFor("pkcs8", buildPkcs8Argv(applied))).toBe("openssl pkcs8 -topk8 -in key.pem -out key.p8");
  });

  it("passwd-hash-sha512 applies and renders", () => {
    const preset = getPkcsPreset("passwd-hash-sha512")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslPasswdSpec;
    expect(lineFor("passwd", buildPasswdArgv(applied))).toBe("openssl passwd -6 hunter2");
  });
});
