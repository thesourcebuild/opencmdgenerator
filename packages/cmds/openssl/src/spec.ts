import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Like `git`, openssl's 54 modeled subcommands are structurally closer to
 * unrelated mini-commands than to a single flag set with a mode axis —
 * `genrsa`'s fields (bits, outputFile) share almost nothing with `verify`'s
 * (certFiles, caFile) or `s_client`'s (connectTarget) or `dgst`'s (algorithm,
 * files). `OpensslSpec` is therefore a discriminated union keyed on
 * `subcommand`, exactly mirroring `@cmdgen/git`'s `GitSpec` — the proven
 * pattern for this shape in this codebase. Only fields structurally central
 * to a subcommand's meaning (a key file, a cipher name, a connect target) get
 * a dedicated typed field; ordinary on/off switches and short-value options
 * are catalogue flags per this app's usual discipline.
 *
 * Scope: this models the 54 entries in `openssl help`'s own "Standard
 * commands" listing (asn1parse through x509), organized into 15 categories.
 * Several of these (asn1parse, ciphers, errstr, info, list, version, help,
 * rehash, nseq, fipsinstall, ech, spkac, srp, cmp, storeutl, skeyutl,
 * configutl) are deliberately modeled with a narrow, thin field set — they
 * are either genuinely simple, informational, or legacy/niche real commands,
 * not this pass's focus. `req`/`ca`/`x509`/`verify`/`enc`/`dgst`/`s_client`/
 * `s_server` carry the bulk of real-world usage and the bulk of this
 * package's flag surface (in their own `catalogue/*.ts` files).
 */
const shared = {
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),
  /** Quoting only — openssl.exe is a real cross-platform binary (bundled with Git for Windows, and natively packaged on Linux/macOS), invoked identically from bash, cmd and PowerShell. */
  shell: ShellDialect.default("posix"),
  flags: FlagValues.default({}),
};

/**
 * Shared "where does the data come from" choice for subcommands that can hash
 * or encrypt either a file or literal typed text. Real `dgst`/`enc` read a
 * file argument, or stdin when none is given — there's no positional way to
 * feed literal text. `inputMode: "text"` is a generator-only convenience: it
 * pipes `text` in as stdin instead of rendering any file positionals, via
 * `render.ts`'s hand-assembled pipe prefix (the same two-process-pipeline
 * technique `@cmdgen/at`'s `render.ts` already uses for scheduling a job body).
 */
export const OpensslInputMode = z.enum(["files", "text"]);
export type OpensslInputMode = z.infer<typeof OpensslInputMode>;

// ── 1. Key Generation ────────────────────────────────────────────────────

export const OpensslKeyAlgorithm = z.enum(["RSA", "EC", "ED25519", "X25519", "DSA"]);
export type OpensslKeyAlgorithm = z.infer<typeof OpensslKeyAlgorithm>;

export const OpensslGenrsaSpec = z.object({
  ...shared,
  subcommand: z.literal("genrsa"),
  outputFile: z.string().default(""),
  bits: z.number().int().positive().default(2048),
});
export type OpensslGenrsaSpec = z.infer<typeof OpensslGenrsaSpec>;

export const OpensslGenpkeySpec = z.object({
  ...shared,
  subcommand: z.literal("genpkey"),
  algorithm: OpensslKeyAlgorithm.default("RSA"),
  outputFile: z.string().default(""),
  /** Only meaningful when `algorithm` is RSA/DSA. */
  bits: z.number().int().positive().default(2048),
  /** Only meaningful when `algorithm` is EC, e.g. `prime256v1`. */
  curveName: z.string().default(""),
});
export type OpensslGenpkeySpec = z.infer<typeof OpensslGenpkeySpec>;

export const OpensslGendsaSpec = z.object({
  ...shared,
  subcommand: z.literal("gendsa"),
  /** A DSA parameter file, e.g. produced by `dsaparam`. */
  paramFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslGendsaSpec = z.infer<typeof OpensslGendsaSpec>;

export const OpensslRsaSpec = z.object({
  ...shared,
  subcommand: z.literal("rsa"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslRsaSpec = z.infer<typeof OpensslRsaSpec>;

export const OpensslDsaSpec = z.object({
  ...shared,
  subcommand: z.literal("dsa"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslDsaSpec = z.infer<typeof OpensslDsaSpec>;

export const OpensslEcSpec = z.object({
  ...shared,
  subcommand: z.literal("ec"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslEcSpec = z.infer<typeof OpensslEcSpec>;

export const OpensslPkeySpec = z.object({
  ...shared,
  subcommand: z.literal("pkey"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslPkeySpec = z.infer<typeof OpensslPkeySpec>;

export const OpensslDhparamSpec = z.object({
  ...shared,
  subcommand: z.literal("dhparam"),
  outputFile: z.string().default(""),
  bits: z.number().int().positive().default(2048),
});
export type OpensslDhparamSpec = z.infer<typeof OpensslDhparamSpec>;

export const OpensslEcparamSpec = z.object({
  ...shared,
  subcommand: z.literal("ecparam"),
  /** e.g. `prime256v1`. */
  curveName: z.string().default("prime256v1"),
  outputFile: z.string().default(""),
});
export type OpensslEcparamSpec = z.infer<typeof OpensslEcparamSpec>;

export const OpensslDsaparamSpec = z.object({
  ...shared,
  subcommand: z.literal("dsaparam"),
  outputFile: z.string().default(""),
  bits: z.number().int().positive().default(2048),
});
export type OpensslDsaparamSpec = z.infer<typeof OpensslDsaparamSpec>;

export const OpensslPkeyparamSpec = z.object({
  ...shared,
  subcommand: z.literal("pkeyparam"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslPkeyparamSpec = z.infer<typeof OpensslPkeyparamSpec>;

// ── 2. Certificate Requests & CA ─────────────────────────────────────────

export const OpensslReqSpec = z.object({
  ...shared,
  subcommand: z.literal("req"),
  keyFile: z.string().default(""),
  outputFile: z.string().default(""),
  /** `-newkey`, e.g. `rsa:2048` — generates a fresh key alongside the CSR instead of using an existing `keyFile`. */
  newKeySpec: z.string().default(""),
  /** `-subj`, e.g. `/CN=example.com`. */
  subject: z.string().default(""),
});
export type OpensslReqSpec = z.infer<typeof OpensslReqSpec>;

export const OpensslCaSpec = z.object({
  ...shared,
  subcommand: z.literal("ca"),
  configFile: z.string().default(""),
  /** The CSR being signed. */
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslCaSpec = z.infer<typeof OpensslCaSpec>;

// ── 3. Certificate & CRL Management ──────────────────────────────────────

export const OpensslX509Spec = z.object({
  ...shared,
  subcommand: z.literal("x509"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
  /** `-signkey` — self-signs `inFile` (typically a CSR) with this private key. */
  signKeyFile: z.string().default(""),
  days: z.number().int().positive().default(365),
});
export type OpensslX509Spec = z.infer<typeof OpensslX509Spec>;

export const OpensslCrlSpec = z.object({
  ...shared,
  subcommand: z.literal("crl"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslCrlSpec = z.infer<typeof OpensslCrlSpec>;

export const OpensslCrl2pkcs7Spec = z.object({
  ...shared,
  subcommand: z.literal("crl2pkcs7"),
  crlFile: z.string().default(""),
  certFiles: z.array(z.string()).default([]),
  outputFile: z.string().default(""),
});
export type OpensslCrl2pkcs7Spec = z.infer<typeof OpensslCrl2pkcs7Spec>;

// ── 4. Verification ───────────────────────────────────────────────────────

export const OpensslVerifySpec = z.object({
  ...shared,
  subcommand: z.literal("verify"),
  certFiles: z.array(z.string()).default([]),
  caFile: z.string().default(""),
});
export type OpensslVerifySpec = z.infer<typeof OpensslVerifySpec>;

// ── 5. Encryption & Decryption ────────────────────────────────────────────

export const OpensslEncSpec = z.object({
  ...shared,
  subcommand: z.literal("enc"),
  cipher: z.string().default("aes-256-cbc"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
  inputMode: OpensslInputMode.default("text"),
  text: z.string().default("123456789"),
});
export type OpensslEncSpec = z.infer<typeof OpensslEncSpec>;

/** Deprecated real alias for RSA-only operations that `pkeyutl` now generalizes — kept since it's still common in the wild. */
export const OpensslRsautlSpec = z.object({
  ...shared,
  subcommand: z.literal("rsautl"),
  keyFile: z.string().default(""),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslRsautlSpec = z.infer<typeof OpensslRsautlSpec>;

export const OpensslPkeyutlSpec = z.object({
  ...shared,
  subcommand: z.literal("pkeyutl"),
  keyFile: z.string().default(""),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslPkeyutlSpec = z.infer<typeof OpensslPkeyutlSpec>;

// ── 6. Digests & MAC ──────────────────────────────────────────────────────

export const OpensslDgstSpec = z.object({
  ...shared,
  subcommand: z.literal("dgst"),
  algorithm: z.string().default("sha256"),
  files: z.array(z.string()).default([]),
  inputMode: OpensslInputMode.default("text"),
  text: z.string().default("123456789"),
});
export type OpensslDgstSpec = z.infer<typeof OpensslDgstSpec>;

export const OpensslMacType = z.enum(["HMAC", "CMAC"]);
export type OpensslMacType = z.infer<typeof OpensslMacType>;

export const OpensslMacSpec = z.object({
  ...shared,
  subcommand: z.literal("mac"),
  macType: OpensslMacType.default("HMAC"),
  keyFile: z.string().default(""),
  inFile: z.string().default(""),
});
export type OpensslMacSpec = z.infer<typeof OpensslMacSpec>;

// ── 7. PKCS Containers ────────────────────────────────────────────────────

export const OpensslPkcs12Spec = z.object({
  ...shared,
  subcommand: z.literal("pkcs12"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
  keyFile: z.string().default(""),
  certFile: z.string().default(""),
});
export type OpensslPkcs12Spec = z.infer<typeof OpensslPkcs12Spec>;

export const OpensslPkcs7Spec = z.object({
  ...shared,
  subcommand: z.literal("pkcs7"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslPkcs7Spec = z.infer<typeof OpensslPkcs7Spec>;

export const OpensslPkcs8Spec = z.object({
  ...shared,
  subcommand: z.literal("pkcs8"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslPkcs8Spec = z.infer<typeof OpensslPkcs8Spec>;

// ── 8. Password & KDF ─────────────────────────────────────────────────────

export const OpensslPasswdSpec = z.object({
  ...shared,
  subcommand: z.literal("passwd"),
  passwords: z.array(z.string()).default([]),
});
export type OpensslPasswdSpec = z.infer<typeof OpensslPasswdSpec>;

export const OpensslKdfSpec = z.object({
  ...shared,
  subcommand: z.literal("kdf"),
  kdfName: z.string().default("PBKDF2"),
  keyLength: z.number().int().positive().default(32),
});
export type OpensslKdfSpec = z.infer<typeof OpensslKdfSpec>;

// ── 9. Random & Primes ────────────────────────────────────────────────────

export const OpensslRandSpec = z.object({
  ...shared,
  subcommand: z.literal("rand"),
  numBytes: z.number().int().positive().default(32),
  outputFile: z.string().default(""),
});
export type OpensslRandSpec = z.infer<typeof OpensslRandSpec>;

export const OpensslPrimeSpec = z.object({
  ...shared,
  subcommand: z.literal("prime"),
  /** Free-typed — real `prime` either checks a given decimal/hex number or (with `-generate`, a catalogue flag) produces a new one of `-bits` size; a single field avoids fighting either form. */
  number: z.string().default(""),
});
export type OpensslPrimeSpec = z.infer<typeof OpensslPrimeSpec>;

// ── 10. TLS/Network Testing ───────────────────────────────────────────────

export const OpensslSClientSpec = z.object({
  ...shared,
  subcommand: z.literal("s_client"),
  /** `-connect host:port`. */
  connectTarget: z.string().default(""),
});
export type OpensslSClientSpec = z.infer<typeof OpensslSClientSpec>;

export const OpensslSServerSpec = z.object({
  ...shared,
  subcommand: z.literal("s_server"),
  /** `-accept port`. */
  acceptPort: z.string().default(""),
});
export type OpensslSServerSpec = z.infer<typeof OpensslSServerSpec>;

export const OpensslSTimeSpec = z.object({
  ...shared,
  subcommand: z.literal("s_time"),
  connectTarget: z.string().default(""),
});
export type OpensslSTimeSpec = z.infer<typeof OpensslSTimeSpec>;

export const OpensslSessIdSpec = z.object({
  ...shared,
  subcommand: z.literal("sess_id"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslSessIdSpec = z.infer<typeof OpensslSessIdSpec>;

// ── 11. PKI Protocols ──────────────────────────────────────────────────────

export const OpensslOcspSpec = z.object({
  ...shared,
  subcommand: z.literal("ocsp"),
  issuerFile: z.string().default(""),
  certFile: z.string().default(""),
  url: z.string().default(""),
});
export type OpensslOcspSpec = z.infer<typeof OpensslOcspSpec>;

export const OpensslTsAction = z.enum(["query", "reply", "verify"]);
export type OpensslTsAction = z.infer<typeof OpensslTsAction>;

export const OpensslTsSpec = z.object({
  ...shared,
  subcommand: z.literal("ts"),
  action: OpensslTsAction.default("query"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslTsSpec = z.infer<typeof OpensslTsSpec>;

export const OpensslCmpSpec = z.object({
  ...shared,
  subcommand: z.literal("cmp"),
  server: z.string().default(""),
});
export type OpensslCmpSpec = z.infer<typeof OpensslCmpSpec>;

export const OpensslCmsAction = z.enum(["encrypt", "decrypt", "sign", "verify"]);
export type OpensslCmsAction = z.infer<typeof OpensslCmsAction>;

export const OpensslCmsSpec = z.object({
  ...shared,
  subcommand: z.literal("cms"),
  action: OpensslCmsAction.default("sign"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslCmsSpec = z.infer<typeof OpensslCmsSpec>;

// ── 12. Secure Messaging & Legacy ─────────────────────────────────────────

export const OpensslSmimeAction = z.enum(["encrypt", "decrypt", "sign", "verify"]);
export type OpensslSmimeAction = z.infer<typeof OpensslSmimeAction>;

export const OpensslSmimeSpec = z.object({
  ...shared,
  subcommand: z.literal("smime"),
  action: OpensslSmimeAction.default("sign"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslSmimeSpec = z.infer<typeof OpensslSmimeSpec>;

/** Legacy: signed public key and challenge, historically produced by an HTML `<keygen>` form — kept minimal. */
export const OpensslSpkacSpec = z.object({
  ...shared,
  subcommand: z.literal("spkac"),
  challenge: z.string().default(""),
  keyFile: z.string().default(""),
});
export type OpensslSpkacSpec = z.infer<typeof OpensslSpkacSpec>;

/** Legacy: Secure Remote Password — kept minimal. */
export const OpensslSrpSpec = z.object({
  ...shared,
  subcommand: z.literal("srp"),
  username: z.string().default(""),
});
export type OpensslSrpSpec = z.infer<typeof OpensslSrpSpec>;

// ── 13. Store & Key Utilities ──────────────────────────────────────────────

export const OpensslStoreutlSpec = z.object({
  ...shared,
  subcommand: z.literal("storeutl"),
  uri: z.string().default(""),
});
export type OpensslStoreutlSpec = z.infer<typeof OpensslStoreutlSpec>;

export const OpensslSkeyutlSpec = z.object({
  ...shared,
  subcommand: z.literal("skeyutl"),
  outputFile: z.string().default(""),
});
export type OpensslSkeyutlSpec = z.infer<typeof OpensslSkeyutlSpec>;

export const OpensslConfigutlSpec = z.object({
  ...shared,
  subcommand: z.literal("configutl"),
  configFile: z.string().default(""),
});
export type OpensslConfigutlSpec = z.infer<typeof OpensslConfigutlSpec>;

// ── 14. Diagnostics & Info (all read-only) ────────────────────────────────

export const OpensslAsn1parseSpec = z.object({
  ...shared,
  subcommand: z.literal("asn1parse"),
  inFile: z.string().default(""),
});
export type OpensslAsn1parseSpec = z.infer<typeof OpensslAsn1parseSpec>;

export const OpensslCiphersSpec = z.object({
  ...shared,
  subcommand: z.literal("ciphers"),
  /** A cipher-list spec, e.g. `DEFAULT` or `HIGH:!aNULL`. */
  filter: z.string().default("DEFAULT"),
});
export type OpensslCiphersSpec = z.infer<typeof OpensslCiphersSpec>;

export const OpensslErrstrSpec = z.object({
  ...shared,
  subcommand: z.literal("errstr"),
  errorCode: z.string().default(""),
});
export type OpensslErrstrSpec = z.infer<typeof OpensslErrstrSpec>;

export const OpensslInfoSpec = z.object({
  ...shared,
  subcommand: z.literal("info"),
  /** e.g. `configdir`, `enginesdir`, `moduledir`. */
  query: z.string().default(""),
});
export type OpensslInfoSpec = z.infer<typeof OpensslInfoSpec>;

export const OpensslListSpec = z.object({
  ...shared,
  subcommand: z.literal("list"),
  what: z.string().default("standard-commands"),
});
export type OpensslListSpec = z.infer<typeof OpensslListSpec>;

export const OpensslVersionSpec = z.object({
  ...shared,
  subcommand: z.literal("version"),
});
export type OpensslVersionSpec = z.infer<typeof OpensslVersionSpec>;

export const OpensslHelpSpec = z.object({
  ...shared,
  subcommand: z.literal("help"),
  topic: z.string().default(""),
});
export type OpensslHelpSpec = z.infer<typeof OpensslHelpSpec>;

export const OpensslRehashSpec = z.object({
  ...shared,
  subcommand: z.literal("rehash"),
  dir: z.string().default(""),
});
export type OpensslRehashSpec = z.infer<typeof OpensslRehashSpec>;

/** Legacy: Netscape certificate sequence conversion — kept minimal. */
export const OpensslNseqSpec = z.object({
  ...shared,
  subcommand: z.literal("nseq"),
  inFile: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslNseqSpec = z.infer<typeof OpensslNseqSpec>;

// ── 15. Advanced/Misc ──────────────────────────────────────────────────────

export const OpensslFipsinstallSpec = z.object({
  ...shared,
  subcommand: z.literal("fipsinstall"),
  outputFile: z.string().default(""),
  moduleFile: z.string().default(""),
});
export type OpensslFipsinstallSpec = z.infer<typeof OpensslFipsinstallSpec>;

/** Encrypted Client Hello key/config generation — a newer, still-narrow real subcommand. */
export const OpensslEchSpec = z.object({
  ...shared,
  subcommand: z.literal("ech"),
  publicName: z.string().default(""),
  outputFile: z.string().default(""),
});
export type OpensslEchSpec = z.infer<typeof OpensslEchSpec>;

// ── The union ──────────────────────────────────────────────────────────────

export const OpensslSpec = z.discriminatedUnion("subcommand", [
  OpensslGenrsaSpec,
  OpensslGenpkeySpec,
  OpensslGendsaSpec,
  OpensslRsaSpec,
  OpensslDsaSpec,
  OpensslEcSpec,
  OpensslPkeySpec,
  OpensslDhparamSpec,
  OpensslEcparamSpec,
  OpensslDsaparamSpec,
  OpensslPkeyparamSpec,
  OpensslReqSpec,
  OpensslCaSpec,
  OpensslX509Spec,
  OpensslCrlSpec,
  OpensslCrl2pkcs7Spec,
  OpensslVerifySpec,
  OpensslEncSpec,
  OpensslRsautlSpec,
  OpensslPkeyutlSpec,
  OpensslDgstSpec,
  OpensslMacSpec,
  OpensslPkcs12Spec,
  OpensslPkcs7Spec,
  OpensslPkcs8Spec,
  OpensslPasswdSpec,
  OpensslKdfSpec,
  OpensslRandSpec,
  OpensslPrimeSpec,
  OpensslSClientSpec,
  OpensslSServerSpec,
  OpensslSTimeSpec,
  OpensslSessIdSpec,
  OpensslOcspSpec,
  OpensslTsSpec,
  OpensslCmpSpec,
  OpensslCmsSpec,
  OpensslSmimeSpec,
  OpensslSpkacSpec,
  OpensslSrpSpec,
  OpensslStoreutlSpec,
  OpensslSkeyutlSpec,
  OpensslConfigutlSpec,
  OpensslAsn1parseSpec,
  OpensslCiphersSpec,
  OpensslErrstrSpec,
  OpensslInfoSpec,
  OpensslListSpec,
  OpensslVersionSpec,
  OpensslHelpSpec,
  OpensslRehashSpec,
  OpensslNseqSpec,
  OpensslFipsinstallSpec,
  OpensslEchSpec,
]);
export type OpensslSpec = z.infer<typeof OpensslSpec>;

export type OpensslSubcommand = OpensslSpec["subcommand"];
