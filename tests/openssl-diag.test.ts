import { describe, expect, it } from "vitest";
import { validateCatalogue, renderOneLine, type Arg, type Argv } from "@cmdgen/engine";
import {
  ASN1PARSE_FLAGS,
  CIPHERS_FLAGS,
  DIAG_RULES,
  ERRSTR_FLAGS,
  HELP_FLAGS,
  INFO_FLAGS,
  LIST_FLAGS,
  NSEQ_FLAGS,
  REHASH_FLAGS,
  VERSION_FLAGS,
  buildAsn1parseArgv,
  buildCiphersArgv,
  buildErrstrArgv,
  buildHelpArgv,
  buildInfoArgv,
  buildListArgv,
  buildNseqArgv,
  buildRehashArgv,
  buildVersionArgv,
  createSpec,
  describeSpec,
  getDiagPreset,
  type OpensslAsn1parseSpec,
  type OpensslCiphersSpec,
  type OpensslErrstrSpec,
  type OpensslHelpSpec,
  type OpensslInfoSpec,
  type OpensslListSpec,
  type OpensslNseqSpec,
  type OpensslRehashSpec,
  type OpensslSpec,
  type OpensslVersionSpec,
} from "@cmdgen/openssl";

/**
 * `build/argv.ts` (the top-level subcommand dispatcher) is a shared file this
 * batch is not allowed to touch — its `diag` cases get wired in by a later
 * integration pass. So these tests exercise each `build<Name>Argv` function
 * directly, wrapping it exactly the way `build/argv.ts` will: a leading
 * `{ text: subcommand, role: "value" }` token followed by the delegate's args.
 */
function lineFor(subcommand: string, delegateArgs: Arg[], shell: OpensslSpec["shell"] = "posix"): string {
  const argv: Argv = { binary: "openssl", args: [{ text: subcommand, role: "value" }, ...delegateArgs] };
  return renderOneLine(argv, { shell });
}

/**
 * `lint/rules.ts` (the shared aggregator `RULES` array) hasn't been wired to
 * include `DIAG_RULES` yet either — same integration boundary as above — so
 * these run `DIAG_RULES` directly rather than going through `lint()`.
 */
function diagLintCodes(spec: OpensslSpec): string[] {
  return DIAG_RULES.flatMap((rule) => rule.check(spec)).map((d) => d.code);
}

const asn1parseSpec = (partial: Partial<OpensslAsn1parseSpec> = {}): OpensslAsn1parseSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "asn1parse" }) as OpensslAsn1parseSpec),
  ...partial,
});
const ciphersSpec = (partial: Partial<OpensslCiphersSpec> = {}): OpensslCiphersSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "ciphers" }) as OpensslCiphersSpec),
  ...partial,
});
const errstrSpec = (partial: Partial<OpensslErrstrSpec> = {}): OpensslErrstrSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "errstr" }) as OpensslErrstrSpec),
  ...partial,
});
const infoSpec = (partial: Partial<OpensslInfoSpec> = {}): OpensslInfoSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "info" }) as OpensslInfoSpec),
  ...partial,
});
const listSpec = (partial: Partial<OpensslListSpec> = {}): OpensslListSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "list" }) as OpensslListSpec),
  ...partial,
});
const versionSpec = (partial: Partial<OpensslVersionSpec> = {}): OpensslVersionSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "version" }) as OpensslVersionSpec),
  ...partial,
});
const helpSpec = (partial: Partial<OpensslHelpSpec> = {}): OpensslHelpSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "help" }) as OpensslHelpSpec),
  ...partial,
});
const rehashSpec = (partial: Partial<OpensslRehashSpec> = {}): OpensslRehashSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "rehash" }) as OpensslRehashSpec),
  ...partial,
});
const nseqSpec = (partial: Partial<OpensslNseqSpec> = {}): OpensslNseqSpec => ({
  ...(createSpec({ id: "test-spec", subcommand: "nseq" }) as OpensslNseqSpec),
  ...partial,
});

describe("diag catalogue integrity", () => {
  it("every diag catalogue is internally consistent", () => {
    expect(validateCatalogue(ASN1PARSE_FLAGS)).toEqual([]);
    expect(validateCatalogue(CIPHERS_FLAGS)).toEqual([]);
    expect(validateCatalogue(ERRSTR_FLAGS)).toEqual([]);
    expect(validateCatalogue(INFO_FLAGS)).toEqual([]);
    expect(validateCatalogue(LIST_FLAGS)).toEqual([]);
    expect(validateCatalogue(VERSION_FLAGS)).toEqual([]);
    expect(validateCatalogue(HELP_FLAGS)).toEqual([]);
    expect(validateCatalogue(REHASH_FLAGS)).toEqual([]);
    expect(validateCatalogue(NSEQ_FLAGS)).toEqual([]);
  });
});

describe("asn1parse", () => {
  it("renders -in then flags", () => {
    const spec = asn1parseSpec({ inFile: "cert.der", flags: { offset: 10, length: 128 } });
    expect(lineFor("asn1parse", buildAsn1parseArgv(spec))).toBe("openssl asn1parse -in cert.der -offset 10 -length 128");
  });

  it("renders with no input file (reads from stdin)", () => {
    expect(lineFor("asn1parse", buildAsn1parseArgv(asn1parseSpec()))).toBe("openssl asn1parse");
  });

  it("flags -strparse with no inFile as an info note", () => {
    expect(diagLintCodes(asn1parseSpec({ flags: { strparse: 0 } }))).toContain("OSSLD001");
    expect(diagLintCodes(asn1parseSpec({ inFile: "cert.der", flags: { strparse: 0 } }))).not.toContain("OSSLD001");
  });
});

describe("ciphers", () => {
  it("renders the filter as a bare trailing positional, defaulting to DEFAULT", () => {
    expect(lineFor("ciphers", buildCiphersArgv(ciphersSpec()))).toBe("openssl ciphers DEFAULT");
  });

  it("renders flags before the filter", () => {
    // `!` is quoted by the posix renderer (shell history-expansion character) — real, correct quoting, not a bug.
    const spec = ciphersSpec({ filter: "HIGH:!aNULL", flags: { v: true, s: true } });
    expect(lineFor("ciphers", buildCiphersArgv(spec))).toBe("openssl ciphers -v -s 'HIGH:!aNULL'");
  });
});

describe("errstr", () => {
  it("renders the error code as a bare positional", () => {
    expect(lineFor("errstr", buildErrstrArgv(errstrSpec({ errorCode: "0906D06C" })))).toBe("openssl errstr 0906D06C");
  });

  it("renders nothing extra when empty", () => {
    expect(lineFor("errstr", buildErrstrArgv(errstrSpec()))).toBe("openssl errstr");
  });

  it("flags an empty error code as an info note", () => {
    expect(diagLintCodes(errstrSpec())).toContain("OSSLD002");
    expect(diagLintCodes(errstrSpec({ errorCode: "0906D06C" }))).not.toContain("OSSLD002");
  });
});

describe("info", () => {
  it("renders the query directly as its own bare flag", () => {
    expect(lineFor("info", buildInfoArgv(infoSpec({ query: "configdir" })))).toBe("openssl info -configdir");
  });

  it("renders bare with no query", () => {
    expect(lineFor("info", buildInfoArgv(infoSpec()))).toBe("openssl info");
  });
});

describe("list", () => {
  it("renders `what` directly as its own bare flag", () => {
    expect(lineFor("list", buildListArgv(listSpec()))).toBe("openssl list -standard-commands");
    expect(lineFor("list", buildListArgv(listSpec({ what: "digest-commands" })))).toBe("openssl list -digest-commands");
  });
});

describe("version", () => {
  it("renders -a when set", () => {
    expect(lineFor("version", buildVersionArgv(versionSpec()))).toBe("openssl version");
    expect(lineFor("version", buildVersionArgv(versionSpec({ flags: { all: true } })))).toBe("openssl version -a");
  });
});

describe("help", () => {
  it("renders the topic as a bare positional, only when non-empty", () => {
    expect(lineFor("help", buildHelpArgv(helpSpec()))).toBe("openssl help");
    expect(lineFor("help", buildHelpArgv(helpSpec({ topic: "req" })))).toBe("openssl help req");
  });
});

describe("rehash", () => {
  it("renders the directory as a bare positional, only when non-empty", () => {
    expect(lineFor("rehash", buildRehashArgv(rehashSpec()))).toBe("openssl rehash");
    expect(lineFor("rehash", buildRehashArgv(rehashSpec({ dir: "/etc/ssl/certs" })))).toBe("openssl rehash /etc/ssl/certs");
  });
});

describe("nseq", () => {
  it("renders -in/-out and -toseq", () => {
    const spec = nseqSpec({ inFile: "certs.pem", outputFile: "certs.seq", flags: { toseq: true } });
    expect(lineFor("nseq", buildNseqArgv(spec))).toBe("openssl nseq -toseq -in certs.pem -out certs.seq");
  });

  it("renders bare with no fields set", () => {
    expect(lineFor("nseq", buildNseqArgv(nseqSpec()))).toBe("openssl nseq");
  });
});

describe("diag presets", () => {
  it("list-standard-commands applies", () => {
    const preset = getDiagPreset("list-standard-commands")!;
    expect(preset).toBeTruthy();
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslListSpec;
    expect(applied.subcommand).toBe("list");
    expect(lineFor("list", buildListArgv(applied))).toBe("openssl list -standard-commands");
  });

  it("list-cipher-commands applies", () => {
    const preset = getDiagPreset("list-cipher-commands")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslCiphersSpec;
    expect(applied.subcommand).toBe("ciphers");
    expect(lineFor("ciphers", buildCiphersArgv(applied))).toBe("openssl ciphers -v DEFAULT");
  });

  it("version-all applies", () => {
    const preset = getDiagPreset("version-all")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslVersionSpec;
    expect(applied.subcommand).toBe("version");
    expect(lineFor("version", buildVersionArgv(applied))).toBe("openssl version -a");
  });

  it("decode-error-code applies", () => {
    const preset = getDiagPreset("decode-error-code")!;
    const applied = preset.apply(createSpec({ id: "x" })) as OpensslErrstrSpec;
    expect(applied.subcommand).toBe("errstr");
    expect(lineFor("errstr", buildErrstrArgv(applied))).toBe("openssl errstr 0906D06C");
  });

  it("describeSpec does not throw for any diag subcommand", () => {
    for (const subcommand of [
      "asn1parse",
      "ciphers",
      "errstr",
      "info",
      "list",
      "version",
      "help",
      "rehash",
      "nseq",
    ] as const) {
      expect(() => describeSpec(createSpec({ id: "x", subcommand }))).not.toThrow();
    }
  });
});
