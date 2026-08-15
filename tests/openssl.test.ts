import { describe, expect, it } from "vitest";
import { validateCatalogue } from "@cmdgen/engine";
import {
  DGST_FLAGS,
  ENC_FLAGS,
  MAC_FLAGS,
  PKEYUTL_FLAGS,
  RSAUTL_FLAGS,
  VERIFY_FLAGS,
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type OpensslDgstSpec,
  type OpensslEncSpec,
  type OpensslMacSpec,
  type OpensslPkeyutlSpec,
  type OpensslRsautlSpec,
  type OpensslSpec,
  type OpensslVerifySpec,
} from "@cmdgen/openssl";

const line = (spec: OpensslSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const verifySpec = (partial: Partial<OpensslVerifySpec> = {}): OpensslVerifySpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "verify" }) as OpensslVerifySpec),
  ...partial,
});
const encSpec = (partial: Partial<OpensslEncSpec> = {}): OpensslEncSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "enc" }) as OpensslEncSpec),
  ...partial,
});
const rsautlSpec = (partial: Partial<OpensslRsautlSpec> = {}): OpensslRsautlSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "rsautl" }) as OpensslRsautlSpec),
  ...partial,
});
const pkeyutlSpec = (partial: Partial<OpensslPkeyutlSpec> = {}): OpensslPkeyutlSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "pkeyutl" }) as OpensslPkeyutlSpec),
  ...partial,
});
const dgstSpec = (partial: Partial<OpensslDgstSpec> = {}): OpensslDgstSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "dgst" }) as OpensslDgstSpec),
  ...partial,
});
const macSpec = (partial: Partial<OpensslMacSpec> = {}): OpensslMacSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "mac" }) as OpensslMacSpec),
  ...partial,
});

describe("catalogue integrity", () => {
  it("every reference-category catalogue is internally consistent", () => {
    expect(validateCatalogue(VERIFY_FLAGS)).toEqual([]);
    expect(validateCatalogue(ENC_FLAGS)).toEqual([]);
    expect(validateCatalogue(RSAUTL_FLAGS)).toEqual([]);
    expect(validateCatalogue(PKEYUTL_FLAGS)).toEqual([]);
    expect(validateCatalogue(DGST_FLAGS)).toEqual([]);
    expect(validateCatalogue(MAC_FLAGS)).toEqual([]);
  });
});

describe("createSpec covers every subcommand", () => {
  it("produces a valid default for all 54 subcommands without throwing", () => {
    const subcommands = [
      "genrsa", "genpkey", "gendsa", "rsa", "dsa", "ec", "pkey", "dhparam", "ecparam", "dsaparam", "pkeyparam",
      "req", "ca", "x509", "crl", "crl2pkcs7", "verify", "enc", "rsautl", "pkeyutl", "dgst", "mac",
      "pkcs12", "pkcs7", "pkcs8", "passwd", "kdf", "rand", "prime", "s_client", "s_server", "s_time", "sess_id",
      "ocsp", "ts", "cmp", "cms", "smime", "spkac", "srp", "storeutl", "skeyutl", "configutl",
      "asn1parse", "ciphers", "errstr", "info", "list", "version", "help", "rehash", "nseq", "fipsinstall", "ech",
    ] as const;
    expect(subcommands.length).toBe(54);
    for (const subcommand of subcommands) {
      const spec = createSpec({ id: "x", subcommand });
      expect(spec.subcommand).toBe(subcommand);
      expect(() => describeSpec(spec)).not.toThrow();
      expect(() => buildArgv(spec)).not.toThrow();
      expect(() => lint(spec)).not.toThrow();
    }
  });
});

describe("verify", () => {
  it("renders with CAfile and a certificate", () => {
    expect(line(verifySpec({ caFile: "ca.pem", certFiles: ["cert.pem"] }))).toBe("openssl verify -CAfile ca.pem cert.pem");
  });

  it("renders with no certificate (reads from stdin)", () => {
    expect(line(verifySpec({ certFiles: [] }))).toBe("openssl verify");
  });

  it("skips blank certificate entries", () => {
    expect(line(verifySpec({ certFiles: ["", "cert.pem", "  "] }))).toBe("openssl verify cert.pem");
  });

  it("renders -no_check_time and flags it as a lint warning", () => {
    const spec = verifySpec({ flags: { noCheckTime: true } });
    expect(line(spec)).toBe("openssl verify -no_check_time");
    const result = lint(spec);
    expect(result.diagnostics.some((d) => d.code === "OSSL001")).toBe(true);
  });
});

describe("enc", () => {
  it("renders the cipher as its own bare flag", () => {
    expect(line(encSpec({ cipher: "aes-256-cbc", inputMode: "files", inFile: "a.txt", outputFile: "a.enc" }))).toBe(
      "openssl enc -aes-256-cbc -in a.txt -out a.enc",
    );
  });

  it("renders base64 and passphrase flags", () => {
    expect(line(encSpec({ cipher: "aes-256-cbc", flags: { base64: true, pass: "pass:hunter2" } }))).toBe(
      "openssl enc -aes-256-cbc -a -pass pass:hunter2",
    );
  });

  it("text input mode is the default and pipes the text via stdin instead of -in", () => {
    const spec = encSpec({ cipher: "aes-256-cbc", text: "123456789", outputFile: "a.enc" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe("printf %s 123456789 | openssl enc -aes-256-cbc -out a.enc");
  });

  it("text input mode (cmd) uses the <nul set /p= trick", () => {
    const spec = encSpec({ cipher: "aes-256-cbc", text: "hello", shell: "cmd" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe('<nul set /p ="hello" | openssl enc -aes-256-cbc');
  });

  it("text input mode (powershell) delegates to a nested cmd /c", () => {
    const spec = encSpec({ cipher: "aes-256-cbc", text: "hello", shell: "powershell" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe(`cmd /c '<nul set /p ="hello" | openssl enc -aes-256-cbc'`);
  });

  it("text input mode with blank text falls back to the bare command (no pipe, no -in)", () => {
    const spec = encSpec({ cipher: "aes-256-cbc", inputMode: "text", text: "  ", inFile: "ignored.txt" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe("openssl enc -aes-256-cbc");
  });

  it("flags -nosalt as a lint warning with a fix", () => {
    const spec = encSpec({ flags: { nosalt: true } });
    const result = lint(spec);
    const diag = result.diagnostics.find((d) => d.code === "OSSL002");
    expect(diag).toBeTruthy();
    expect(diag!.fix).toBeTruthy();
    const fixed = diag!.fix!.apply(spec);
    expect(lint(fixed).diagnostics.some((d) => d.code === "OSSL002")).toBe(false);
  });

  it("flags a passphrase set without -pbkdf2 as an info note", () => {
    const spec = encSpec({ flags: { pass: "pass:hunter2" } });
    expect(lint(spec).diagnostics.some((d) => d.code === "OSSL003")).toBe(true);
    expect(lint(encSpec({ flags: { pass: "pass:hunter2", pbkdf2: true } })).diagnostics.some((d) => d.code === "OSSL003")).toBe(false);
  });
});

describe("rsautl / pkeyutl", () => {
  it("renders -inkey/-in/-out with an action flag", () => {
    expect(line(rsautlSpec({ keyFile: "priv.pem", inFile: "a.bin", outputFile: "b.bin", flags: { decrypt: true } }))).toBe(
      "openssl rsautl -decrypt -inkey priv.pem -in a.bin -out b.bin",
    );
    expect(line(pkeyutlSpec({ keyFile: "priv.pem", flags: { sign: true } }))).toBe("openssl pkeyutl -sign -inkey priv.pem");
  });

  it("flags no action selected as an info note", () => {
    expect(lint(rsautlSpec({ keyFile: "priv.pem" })).diagnostics.some((d) => d.code === "OSSL004")).toBe(true);
    expect(lint(rsautlSpec({ keyFile: "priv.pem", flags: { encrypt: true } })).diagnostics.some((d) => d.code === "OSSL004")).toBe(false);
  });

  it("flags a missing key file as an error", () => {
    expect(lint(pkeyutlSpec({ flags: { sign: true } })).diagnostics.some((d) => d.code === "OSSL005")).toBe(true);
  });
});

describe("dgst / mac", () => {
  it("renders the algorithm as its own bare flag with trailing files", () => {
    expect(line(dgstSpec({ algorithm: "sha256", inputMode: "files", files: ["a.txt", "b.txt"] }))).toBe(
      "openssl dgst -sha256 a.txt b.txt",
    );
  });

  it("renders mac with the MAC type as a positional", () => {
    expect(line(macSpec({ macType: "HMAC", keyFile: "hexkey", inFile: "a.txt" }))).toBe(
      "openssl mac HMAC -macopt key:hexkey -in a.txt",
    );
  });

  it("flags -verify without -signature as an error", () => {
    const spec = dgstSpec({ flags: { verify: "pub.pem" } });
    expect(lint(spec).diagnostics.some((d) => d.code === "OSSL006")).toBe(true);
    expect(
      lint(dgstSpec({ flags: { verify: "pub.pem", signature: "sig.bin" } })).diagnostics.some((d) => d.code === "OSSL006"),
    ).toBe(false);
  });

  it("text input mode (posix) pipes the text in via printf %s — byte-exact, no trailing newline — instead of rendering file positionals", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: "123456789", files: ["ignored.txt"] });
    // Passing the full spec (not just {shell}) is what triggers the pipe prefix — see render.ts.
    // printf '%s' (not echo) is load-bearing: echo appends a trailing newline on every real shell,
    // which changes the resulting hash — verified empirically against a real openssl install.
    expect(renderOneLine(buildArgv(spec), spec)).toBe("printf %s 123456789 | openssl dgst -sha256");
  });

  it("text input mode (cmd) uses the <nul set /p= trick, verified byte-exact against a real cmd.exe/openssl install", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: "hello", shell: "cmd" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe('<nul set /p ="hello" | openssl dgst -sha256');
  });

  it("text input mode (cmd) always quotes, even when the text contains a double quote — verified against real cmd.exe that set /p= strips only the outer first/last quote characters, so embedded quotes come through byte-exact with no doubling needed", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: 'say "hi" now', shell: "cmd" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe('<nul set /p ="say "hi" now" | openssl dgst -sha256');
  });

  it("text input mode (cmd) quotes protect real cmd metacharacters like | and &", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: "a|b&c", shell: "cmd" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe('<nul set /p ="a|b&c" | openssl dgst -sha256');
  });

  it("text input mode (powershell) delegates to a nested cmd /c, verified byte-exact against a real PowerShell/cmd.exe/openssl install — PowerShell itself has no way to pipe a string into stdin without appending a trailing CRLF", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: "hello", shell: "powershell" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe(`cmd /c '<nul set /p ="hello" | openssl dgst -sha256'`);
  });

  it("text input mode (powershell) delegation carries an embedded double quote through untouched — PowerShell single-quoted strings don't treat \" specially", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: 'say "hi" now', shell: "powershell" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe(`cmd /c '<nul set /p ="say "hi" now" | openssl dgst -sha256'`);
  });

  it("text input mode (powershell) escapes an embedded single quote at the outer PowerShell layer (doubled, per PowerShell's own single-quote escaping rule)", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: "it's here", shell: "powershell" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe(`cmd /c '<nul set /p ="it''s here" | openssl dgst -sha256'`);
  });

  it("files input mode renders trailing file positionals, unaffected by the text field", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "files", files: ["a.txt"], text: "unused" });
    expect(line(spec)).toBe("openssl dgst -sha256 a.txt");
  });

  it("text input mode is the default — a bare dgst spec renders a text pipe when text is present", () => {
    const spec = dgstSpec({ algorithm: "sha256", text: "123456789" });
    expect(renderOneLine(buildArgv(spec), spec)).toBe("printf %s 123456789 | openssl dgst -sha256");
  });

  it("text input mode with blank text falls back to the bare command (no pipe, no files)", () => {
    const spec = dgstSpec({ algorithm: "sha256", inputMode: "text", text: "  ", files: ["ignored.txt"] });
    expect(renderOneLine(buildArgv(spec), spec)).toBe("openssl dgst -sha256");
  });

  it("supports the full real digest algorithm list without throwing", () => {
    const algorithms = [
      "blake2b512", "blake2s256", "md4", "md5", "mdc2", "rmd160", "sha1", "sha224", "sha256",
      "sha3-224", "sha3-256", "sha3-384", "sha3-512", "sha384", "sha512", "sha512-224", "sha512-256",
      "shake128", "shake256", "sm3",
    ];
    for (const algorithm of algorithms) {
      expect(line(dgstSpec({ algorithm, inputMode: "files", files: ["a.txt"] }))).toBe(
        `openssl dgst -${algorithm} a.txt`,
      );
    }
  });
});

describe("presets", () => {
  it("every preset has a unique id", () => {
    const seenIds = new Set<string>();
    const preset = getPreset("verify-against-ca");
    expect(preset).toBeTruthy();
    expect(seenIds.has(preset!.id)).toBe(false);
  });

  it("verify-against-ca applies and renders", () => {
    const preset = getPreset("verify-against-ca")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe("openssl verify -CAfile ca.pem cert.pem");
  });

  it("encrypt-file-aes256 applies and renders", () => {
    const preset = getPreset("encrypt-file-aes256")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe("openssl enc -aes-256-cbc -e -pbkdf2 -in file.txt -out file.txt.enc");
  });

  it("encrypt-text-aes256 applies and renders a text pipe", () => {
    const preset = getPreset("encrypt-text-aes256")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(renderOneLine(buildArgv(applied), applied)).toBe(
      "printf %s 123456789 | openssl enc -aes-256-cbc -e -pbkdf2 -out secret.txt.enc",
    );
  });

  it("sha256-file applies and renders", () => {
    const preset = getPreset("sha256-file")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(line(applied)).toBe("openssl dgst -sha256 file.txt");
  });

  it("sha256-text applies and renders a text pipe", () => {
    const preset = getPreset("sha256-text")!;
    const applied = preset.apply(createSpec({ id: "x" }));
    expect(renderOneLine(buildArgv(applied), applied)).toBe("printf %s 123456789 | openssl dgst -sha256");
  });
});
