import { describe, expect, it } from "vitest";
import { CATALOGUE, type FlagDef } from "@cmdgen/curl";

/**
 * Every option in curl's own `--help all`, transcribed verbatim. This is the
 * completeness contract for the largest catalogue in this app: if an option
 * appears here, the catalogue must be able to emit it.
 */
const HELP_ALL_OPTIONS = [
  "--abstract-unix-socket", "--alt-svc", "--anyauth", "-a", "--append", "--aws-sigv4",
  "--basic", "--ca-native", "--cacert", "--capath", "-E", "--cert", "--cert-status",
  "--cert-type", "--ciphers", "--compressed", "--compressed-ssh", "-K", "--config",
  "--connect-timeout", "--connect-to", "-C", "--continue-at", "-b", "--cookie", "-c",
  "--cookie-jar", "--create-dirs", "--create-file-mode", "--crlf", "--crlfile",
  "--curves", "-d", "--data", "--data-ascii", "--data-binary", "--data-raw",
  "--data-urlencode", "--delegation", "-q", "--disable", "--disable-eprt",
  "--disable-epsv", "--disallow-username-in-url", "--digest", "--dns-interface",
  "--dns-ipv4-addr", "--dns-ipv6-addr", "--dns-servers", "--doh-cert-status",
  "--doh-insecure", "--doh-url", "--dump-ca-embed", "-D", "--dump-header", "--ech",
  "--egd-file", "--engine", "--etag-compare", "--etag-save", "--expect100-timeout",
  "-f", "--fail", "--fail-early", "--fail-with-body", "--false-start", "--follow",
  "-F", "--form", "--form-escape", "--form-string", "--ftp-account",
  "--ftp-alternative-to-user", "--ftp-create-dirs", "--ftp-method", "--ftp-pasv",
  "-P", "--ftp-port", "--ftp-pret", "--ftp-skip-pasv-ip", "--ftp-ssl-ccc",
  "--ftp-ssl-ccc-mode", "--ftp-ssl-control", "-G", "--get", "-g", "--globoff",
  "--happy-eyeballs-timeout-ms", "--haproxy-clientip", "--haproxy-protocol", "-I",
  "--head", "-H", "--header", "-h", "--help", "--hostpubmd5", "--hostpubsha256",
  "--hsts", "--http0.9", "-0", "--http1.0", "--http1.1", "--http2",
  "--http2-prior-knowledge", "--http3", "--http3-only", "--ignore-content-length",
  "-k", "--insecure", "--interface", "--ip-tos", "--ipfs-gateway", "-4", "--ipv4",
  "-6", "--ipv6", "--json", "-j", "--junk-session-cookies", "--keepalive-cnt",
  "--keepalive-time", "--key", "--key-type", "--knownhosts", "--krb", "--libcurl",
  "--limit-rate", "-l", "--list-only", "--local-port", "-L", "--location",
  "--location-trusted", "--login-options", "--mail-auth", "--mail-from",
  "--mail-rcpt", "--mail-rcpt-allowfails", "-M", "--manual", "--max-filesize",
  "--max-redirs", "-m", "--max-time", "--metalink", "--mptcp", "--negotiate", "-n",
  "--netrc", "--netrc-file", "--netrc-optional", "-:", "--next", "--no-alpn", "-N",
  "--no-buffer", "--no-clobber", "--no-keepalive", "--no-npn", "--no-progress-meter",
  "--no-sessionid", "--noproxy", "--ntlm", "--ntlm-wb", "--oauth2-bearer",
  "--out-null", "-o", "--output", "--output-dir", "-Z", "--parallel",
  "--parallel-immediate", "--parallel-max", "--parallel-max-host", "--pass",
  "--path-as-is", "--pinnedpubkey", "--post301", "--post302", "--post303",
  "--preproxy", "-#", "--progress-bar", "--proto", "--proto-default",
  "--proto-redir", "-x", "--proxy", "--proxy-anyauth", "--proxy-basic",
  "--proxy-ca-native", "--proxy-cacert", "--proxy-capath", "--proxy-cert",
  "--proxy-cert-type", "--proxy-ciphers", "--proxy-crlfile", "--proxy-digest",
  "--proxy-header", "--proxy-http2", "--proxy-http3", "--proxy-insecure",
  "--proxy-key", "--proxy-key-type", "--proxy-negotiate", "--proxy-ntlm",
  "--proxy-pass", "--proxy-pinnedpubkey", "--proxy-service-name",
  "--proxy-ssl-allow-beast", "--proxy-ssl-auto-client-cert", "--proxy-tls13-ciphers",
  "--proxy-tlsauthtype", "--proxy-tlspassword", "--proxy-tlsuser", "--proxy-tlsv1",
  "-U", "--proxy-user", "--proxy1.0", "-p", "--proxytunnel", "--pubkey", "-Q",
  "--quote", "--random-file", "-r", "--range", "--rate", "--raw", "-e", "--referer",
  "-J", "--remote-header-name", "-O", "--remote-name", "--remote-name-all", "-R",
  "--remote-time", "--remove-on-error", "-X", "--request", "--request-target",
  "--resolve", "--retry", "--retry-all-errors", "--retry-connrefused",
  "--retry-delay", "--retry-max-time", "--sasl-authzid", "--sasl-ir",
  "--service-name", "-S", "--show-error", "-i", "--show-headers", "--sigalgs", "-s",
  "--silent", "--skip-existing", "--socks4", "--socks4a", "--socks5",
  "--socks5-basic", "--socks5-gssapi", "--socks5-gssapi-nec",
  "--socks5-gssapi-service", "--socks5-hostname", "-Y", "--speed-limit", "-y",
  "--speed-time", "--ssl", "--ssl-allow-beast", "--ssl-auto-client-cert",
  "--ssl-no-revoke", "--ssl-reqd", "--ssl-revoke-best-effort", "--ssl-sessions",
  "-2", "--sslv2", "-3", "--sslv3", "--stderr", "--styled-output",
  "--suppress-connect-headers", "--tcp-fastopen", "--tcp-nodelay", "-t",
  "--telnet-option", "--tftp-blksize", "--tftp-no-options", "-z", "--time-cond",
  "--tls-earlydata", "--tls-max", "--tls13-ciphers", "--tlsauthtype",
  "--tlspassword", "--tlsuser", "-1", "--tlsv1", "--tlsv1.0", "--tlsv1.1",
  "--tlsv1.2", "--tlsv1.3", "--tr-encoding", "--trace", "--trace-ascii",
  "--trace-config", "--trace-ids", "--trace-time", "--unix-socket", "-T",
  "--upload-file", "--upload-flags", "--url", "--url-query", "-B", "--use-ascii",
  "-u", "--user", "-A", "--user-agent", "--variable", "-v", "--verbose", "-V",
  "--version", "--vlan-priority", "-w", "--write-out", "--xattr",
] as const;

/** Doc-viewer flags — excluded the same way every command here excludes its own --help/--version. */
const NOT_A_BUILDABLE_OPTION = ["-h", "--help", "-V", "--version", "-M", "--manual"];

/** Not a separate flag — spec.urls already models this (see catalogue/flags.ts header comment). */
const URL_FIELD_OPTIONS = ["--url"];

/**
 * Genuinely repeatable in real curl (multiple -H, multiple -d concatenated
 * with &, multiple -F for multiple parts) — modeled as `spec.headers` /
 * `spec.dataEntries` / `spec.formEntries` instead of catalogue flags.
 */
const REPEATABLE_BODY_FIELD_OPTIONS = [
  "-H", "--header",
  "-d", "--data", "--data-ascii", "--data-binary", "--data-raw", "--data-urlencode", "--json",
  "-F", "--form", "--form-string",
];

function spellingsOf(flag: FlagDef): string[] {
  const out: string[] = [];
  if (flag.short) out.push(flag.short);
  out.push(flag.long.split("=")[0]!);
  for (const option of flag.options ?? []) {
    if (option.renders === "") continue;
    for (const part of option.renders.split(/\s+/)) out.push(part.split("=")[0]!);
  }
  return out;
}

function emittableTokens(): Set<string> {
  const tokens = new Set<string>();
  for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
    for (const spelling of spellingsOf(flag)) tokens.add(spelling);
  }
  return tokens;
}

describe("curl --help all coverage", () => {
  const tokens = emittableTokens();

  it("has no duplicate order values (flagsInArgvOrder sorts the whole catalogue)", () => {
    const orders = CATALOGUE.flags.map((f) => f.order);
    const duplicates = orders.filter((o, i) => orders.indexOf(o) !== i);
    expect(duplicates).toEqual([]);
  });

  it("has no duplicate flag ids", () => {
    const ids = CATALOGUE.flags.map((f) => f.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it("can represent every option curl's --help all lists", () => {
    const missing = HELP_ALL_OPTIONS.filter((opt) => {
      if (NOT_A_BUILDABLE_OPTION.includes(opt)) return false;
      if (URL_FIELD_OPTIONS.includes(opt)) return false;
      if (REPEATABLE_BODY_FIELD_OPTIONS.includes(opt)) return false;
      return !tokens.has(opt);
    });
    expect(missing).toEqual([]);
  });

  it("every enum flag offers the engine's inactive sentinel as its first option", () => {
    for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
      if (flag.kind !== "enum") continue;
      expect(flag.options?.[0]?.value, `${flag.id}'s first option must be "none"`).toBe("none");
      expect(flag.options?.[0]?.renders, `${flag.id}'s "none" must render nothing`).toBe("");
    }
  });

  it("every conflictsWith/requires reference points at a real flag id", () => {
    const ids = new Set(CATALOGUE.flags.map((f) => f.id));
    const dangling: string[] = [];
    for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
      for (const ref of [...(flag.conflictsWith ?? []), ...(flag.requires ?? [])]) {
        if (!ids.has(ref)) dangling.push(`${flag.id} -> ${ref}`);
      }
    }
    expect(dangling).toEqual([]);
  });
});
