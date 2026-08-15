/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/git/pure` and `@cmdgen/apt/pure`.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { OpensslSpec, OpensslSubcommand } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "openssl" as const;

/**
 * `flags` sits at the same key/type on every branch of the `OpensslSpec`
 * union, so these generic flag helpers work directly on the union, exactly
 * like `@cmdgen/git`'s own `flagBool`/`setFlag`.
 */
export function flagBool(spec: OpensslSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: OpensslSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: OpensslSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: OpensslSpec, id: string, value: FlagValue | undefined): OpensslSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: OpensslSpec, patch: Record<string, FlagValue | undefined>): OpensslSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

/**
 * The 15 categories this app's openssl support is organized into (matches
 * the app's `Preset.category` grouping and the subcommand picker's
 * `<optgroup>`s) — a UI/organizational concept, deliberately never a spec
 * field: category is 100% derived from `subcommand`, so the two can never
 * drift apart. Mirrors `@cmdgen/git`'s `GIT_CATEGORIES` pattern exactly.
 */
export const OPENSSL_CATEGORIES = [
  { id: "keygen", label: "Key Generation" },
  { id: "csr", label: "Certificate Requests & CA" },
  { id: "cert", label: "Certificate & CRL Management" },
  { id: "verify", label: "Verification" },
  { id: "enc", label: "Encryption & Decryption" },
  { id: "digest", label: "Digests & MAC" },
  { id: "pkcs", label: "PKCS Containers" },
  { id: "passwd", label: "Password & KDF" },
  { id: "rand", label: "Random & Primes" },
  { id: "tls", label: "TLS/Network Testing" },
  { id: "pki", label: "PKI Protocols" },
  { id: "smime", label: "Secure Messaging & Legacy" },
  { id: "store", label: "Store & Key Utilities" },
  { id: "diag", label: "Diagnostics & Info" },
  { id: "advanced", label: "Advanced/Misc" },
] as const;
export type OpensslCategoryId = (typeof OPENSSL_CATEGORIES)[number]["id"];

export const OPENSSL_SUBCOMMAND_META: Record<OpensslSubcommand, { label: string; category: OpensslCategoryId }> = {
  genrsa: { label: "genrsa", category: "keygen" },
  genpkey: { label: "genpkey", category: "keygen" },
  gendsa: { label: "gendsa", category: "keygen" },
  rsa: { label: "rsa", category: "keygen" },
  dsa: { label: "dsa", category: "keygen" },
  ec: { label: "ec", category: "keygen" },
  pkey: { label: "pkey", category: "keygen" },
  dhparam: { label: "dhparam", category: "keygen" },
  ecparam: { label: "ecparam", category: "keygen" },
  dsaparam: { label: "dsaparam", category: "keygen" },
  pkeyparam: { label: "pkeyparam", category: "keygen" },
  req: { label: "req", category: "csr" },
  ca: { label: "ca", category: "csr" },
  x509: { label: "x509", category: "cert" },
  crl: { label: "crl", category: "cert" },
  crl2pkcs7: { label: "crl2pkcs7", category: "cert" },
  verify: { label: "verify", category: "verify" },
  enc: { label: "enc", category: "enc" },
  rsautl: { label: "rsautl", category: "enc" },
  pkeyutl: { label: "pkeyutl", category: "enc" },
  dgst: { label: "dgst", category: "digest" },
  mac: { label: "mac", category: "digest" },
  pkcs12: { label: "pkcs12", category: "pkcs" },
  pkcs7: { label: "pkcs7", category: "pkcs" },
  pkcs8: { label: "pkcs8", category: "pkcs" },
  passwd: { label: "passwd", category: "passwd" },
  kdf: { label: "kdf", category: "passwd" },
  rand: { label: "rand", category: "rand" },
  prime: { label: "prime", category: "rand" },
  s_client: { label: "s_client", category: "tls" },
  s_server: { label: "s_server", category: "tls" },
  s_time: { label: "s_time", category: "tls" },
  sess_id: { label: "sess_id", category: "tls" },
  ocsp: { label: "ocsp", category: "pki" },
  ts: { label: "ts", category: "pki" },
  cmp: { label: "cmp", category: "pki" },
  cms: { label: "cms", category: "pki" },
  smime: { label: "smime", category: "smime" },
  spkac: { label: "spkac", category: "smime" },
  srp: { label: "srp", category: "smime" },
  storeutl: { label: "storeutl", category: "store" },
  skeyutl: { label: "skeyutl", category: "store" },
  configutl: { label: "configutl", category: "store" },
  asn1parse: { label: "asn1parse", category: "diag" },
  ciphers: { label: "ciphers", category: "diag" },
  errstr: { label: "errstr", category: "diag" },
  info: { label: "info", category: "diag" },
  list: { label: "list", category: "diag" },
  version: { label: "version", category: "diag" },
  help: { label: "help", category: "diag" },
  rehash: { label: "rehash", category: "diag" },
  nseq: { label: "nseq", category: "diag" },
  fipsinstall: { label: "fipsinstall", category: "advanced" },
  ech: { label: "ech", category: "advanced" },
};

export function subcommandsInCategory(category: OpensslCategoryId): OpensslSubcommand[] {
  return (Object.keys(OPENSSL_SUBCOMMAND_META) as OpensslSubcommand[]).filter(
    (sub) => OPENSSL_SUBCOMMAND_META[sub].category === category,
  );
}
