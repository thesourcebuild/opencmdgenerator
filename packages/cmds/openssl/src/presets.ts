import type { Preset } from "@cmdgen/engine";
import type { OpensslDgstSpec, OpensslEncSpec, OpensslSpec, OpensslSubcommand, OpensslVerifySpec, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";
import { KEYGEN_PRESETS } from "./presets-keygen";
import { CERT_PRESETS } from "./presets-cert";
import { PKCS_PRESETS } from "./presets-pkcs";
import { TLS_PRESETS } from "./presets-tls";
import { PKI_PRESETS } from "./presets-pki";
import { SMIME_PRESETS } from "./presets-smime";
import { DIAG_PRESETS } from "./presets-diag";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
  subcommand?: OpensslSubcommand;
}

/**
 * Every subcommand's default object, keyed by `subcommand` — the canonical
 * factory the UI's subcommand switcher calls on every change (discarding the
 * previous branch's fields entirely). Mirrors `@cmdgen/git`'s `createSpec`.
 */
export function createSpec(options: CreateSpecOptions = {}): OpensslSpec {
  const base = {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? ("posix" as ShellDialect),
    flags: {},
  };
  const subcommand = options.subcommand ?? "version";

  switch (subcommand) {
    case "genrsa":
      return { ...base, subcommand, outputFile: "", bits: 2048 };
    case "genpkey":
      return { ...base, subcommand, algorithm: "RSA", outputFile: "", bits: 2048, curveName: "" };
    case "gendsa":
      return { ...base, subcommand, paramFile: "", outputFile: "" };
    case "rsa":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "dsa":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "ec":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "pkey":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "dhparam":
      return { ...base, subcommand, outputFile: "", bits: 2048 };
    case "ecparam":
      return { ...base, subcommand, curveName: "prime256v1", outputFile: "" };
    case "dsaparam":
      return { ...base, subcommand, outputFile: "", bits: 2048 };
    case "pkeyparam":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "req":
      return { ...base, subcommand, keyFile: "", outputFile: "", newKeySpec: "", subject: "" };
    case "ca":
      return { ...base, subcommand, configFile: "", inFile: "", outputFile: "" };
    case "x509":
      return { ...base, subcommand, inFile: "", outputFile: "", signKeyFile: "", days: 365 };
    case "crl":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "crl2pkcs7":
      return { ...base, subcommand, crlFile: "", certFiles: [], outputFile: "" };
    case "verify":
      return { ...base, subcommand, certFiles: [], caFile: "" };
    case "enc":
      return { ...base, subcommand, cipher: "aes-256-cbc", inFile: "", outputFile: "", inputMode: "text", text: "123456789" };
    case "rsautl":
      return { ...base, subcommand, keyFile: "", inFile: "", outputFile: "" };
    case "pkeyutl":
      return { ...base, subcommand, keyFile: "", inFile: "", outputFile: "" };
    case "dgst":
      return { ...base, subcommand, algorithm: "sha256", files: [], inputMode: "text", text: "123456789" };
    case "mac":
      return { ...base, subcommand, macType: "HMAC", keyFile: "", inFile: "" };
    case "pkcs12":
      return { ...base, subcommand, inFile: "", outputFile: "", keyFile: "", certFile: "" };
    case "pkcs7":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "pkcs8":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "passwd":
      return { ...base, subcommand, passwords: [] };
    case "kdf":
      return { ...base, subcommand, kdfName: "PBKDF2", keyLength: 32 };
    case "rand":
      // -base64 defaulted on: bare `openssl rand 32` dumps raw binary bytes to
      // the terminal, which renders as garbage and is useless to paste anywhere.
      return { ...base, subcommand, numBytes: 32, outputFile: "", flags: { base64: true } };
    case "prime":
      return { ...base, subcommand, number: "" };
    case "s_client":
      return { ...base, subcommand, connectTarget: "" };
    case "s_server":
      return { ...base, subcommand, acceptPort: "" };
    case "s_time":
      return { ...base, subcommand, connectTarget: "" };
    case "sess_id":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "ocsp":
      return { ...base, subcommand, issuerFile: "", certFile: "", url: "" };
    case "ts":
      return { ...base, subcommand, action: "query", inFile: "", outputFile: "" };
    case "cmp":
      return { ...base, subcommand, server: "" };
    case "cms":
      return { ...base, subcommand, action: "sign", inFile: "", outputFile: "" };
    case "smime":
      return { ...base, subcommand, action: "sign", inFile: "", outputFile: "" };
    case "spkac":
      return { ...base, subcommand, challenge: "", keyFile: "" };
    case "srp":
      return { ...base, subcommand, username: "" };
    case "storeutl":
      return { ...base, subcommand, uri: "" };
    case "skeyutl":
      return { ...base, subcommand, outputFile: "" };
    case "configutl":
      return { ...base, subcommand, configFile: "" };
    case "asn1parse":
      return { ...base, subcommand, inFile: "" };
    case "ciphers":
      return { ...base, subcommand, filter: "DEFAULT" };
    case "errstr":
      return { ...base, subcommand, errorCode: "" };
    case "info":
      return { ...base, subcommand, query: "" };
    case "list":
      return { ...base, subcommand, what: "standard-commands" };
    case "version":
      return { ...base, subcommand };
    case "help":
      return { ...base, subcommand, topic: "" };
    case "rehash":
      return { ...base, subcommand, dir: "" };
    case "nseq":
      return { ...base, subcommand, inFile: "", outputFile: "" };
    case "fipsinstall":
      return { ...base, subcommand, outputFile: "", moduleFile: "" };
    case "ech":
      return { ...base, subcommand, publicName: "", outputFile: "" };
  }
}

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule as `@cmdgen/git`'s presets.
export const PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "verify-against-ca",
    label: "Verify a certificate against a CA",
    category: "Verification",
    summary: "verify -CAfile — checks a certificate's chain of trust.",
    commandExample: "openssl verify -CAfile ca.pem cert.pem",
    apply: (spec) => ({ ...(createSpec({ id: spec.id, subcommand: "verify" }) as OpensslVerifySpec), caFile: "ca.pem", certFiles: ["cert.pem"] }),
  },
  {
    id: "encrypt-file-aes256",
    label: "Encrypt a file with AES-256",
    category: "Encryption & Decryption",
    summary: "enc -aes-256-cbc -pbkdf2 — symmetric-encrypts a file with a passphrase.",
    commandExample: "openssl enc -aes-256-cbc -pbkdf2 -in file.txt -out file.txt.enc",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "enc" }) as OpensslEncSpec),
      cipher: "aes-256-cbc",
      inputMode: "files",
      inFile: "file.txt",
      outputFile: "file.txt.enc",
      flags: { pbkdf2: true, encrypt: true },
    }),
  },
  {
    id: "decrypt-file-aes256",
    label: "Decrypt an AES-256 file",
    category: "Encryption & Decryption",
    summary: "enc -d -aes-256-cbc -pbkdf2 — reverses the AES-256 encryption preset above.",
    commandExample: "openssl enc -d -aes-256-cbc -pbkdf2 -in file.txt.enc -out file.txt",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "enc" }) as OpensslEncSpec),
      cipher: "aes-256-cbc",
      inputMode: "files",
      inFile: "file.txt.enc",
      outputFile: "file.txt",
      flags: { pbkdf2: true, decrypt: true },
    }),
  },
  {
    id: "encrypt-text-aes256",
    label: "Encrypt text with AES-256",
    category: "Encryption & Decryption",
    summary: "enc -aes-256-cbc -pbkdf2 — symmetric-encrypts literal text piped in as stdin, byte-exact (no trailing newline added).",
    commandExample: "printf %s '123456789' | openssl enc -aes-256-cbc -pbkdf2 -out secret.txt.enc",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "enc" }) as OpensslEncSpec),
      cipher: "aes-256-cbc",
      inputMode: "text",
      text: "123456789",
      outputFile: "secret.txt.enc",
      flags: { pbkdf2: true, encrypt: true },
    }),
  },
  {
    id: "sha256-text",
    label: "SHA-256 hash a text input",
    category: "Digests & MAC",
    summary: "dgst -sha256 — prints the SHA-256 digest of literal text piped in as stdin, byte-exact (no trailing newline added).",
    commandExample: "printf %s '123456789' | openssl dgst -sha256",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "dgst" }) as OpensslDgstSpec),
      algorithm: "sha256",
      inputMode: "text",
      text: "123456789",
    }),
  },
  {
    id: "sha256-file",
    label: "SHA-256 hash a file",
    category: "Digests & MAC",
    summary: "dgst -sha256 — prints the SHA-256 digest of a file.",
    commandExample: "openssl dgst -sha256 file.txt",
    apply: (spec) => ({ ...(createSpec({ id: spec.id, subcommand: "dgst" }) as OpensslDgstSpec), algorithm: "sha256", inputMode: "files", files: ["file.txt"] }),
  },
  ...KEYGEN_PRESETS,
  ...CERT_PRESETS,
  ...PKCS_PRESETS,
  ...TLS_PRESETS,
  ...PKI_PRESETS,
  ...SMIME_PRESETS,
  ...DIAG_PRESETS,
];

export function getPreset(id: string): Preset<OpensslSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
