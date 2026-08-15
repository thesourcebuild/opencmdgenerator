import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type TlsFlagDef = FlagDefGeneric<FlagGroup>;

/** Modeled from the real `openssl rand -help` output. */
export const RAND_FLAGS: readonly TlsFlagDef[] = [
  {
    id: "base64",
    long: "-base64",
    group: "options",
    kind: "boolean",
    conflictsWith: ["hex"],
    summary: "Base64-encode the random output.",
    detail: "The common choice whenever the bytes need to survive as printable text, e.g. pasted into a config file or the shell.",
    order: 10,
  },
  {
    id: "hex",
    long: "-hex",
    group: "options",
    kind: "boolean",
    conflictsWith: ["base64"],
    summary: "Hex-encode the random output instead.",
    detail: "Mutually exclusive with -base64 — real rand only ever encodes the output one way at a time.",
    order: 20,
  },
] as const;
export const RAND_CATALOGUE = createFlagCatalogue<FlagGroup>(RAND_FLAGS);

/** Modeled from the real `openssl prime -help` output. */
export const PRIME_FLAGS: readonly TlsFlagDef[] = [
  {
    id: "generate",
    long: "-generate",
    group: "options",
    kind: "boolean",
    summary: "Generate a new prime instead of checking one.",
    detail: "When set, real prime does not accept a trailing positional number at all — it produces a fresh prime of -bits size.",
    order: 10,
  },
  {
    id: "bits",
    long: "-bits",
    group: "options",
    kind: "number",
    arg: { placeholder: "2048", separator: " " },
    requires: ["generate"],
    summary: "Size in bits of the generated prime.",
    detail: "Only meaningful together with -generate — ignored otherwise since there's nothing to generate.",
    order: 20,
  },
  {
    id: "hex",
    long: "-hex",
    group: "options",
    kind: "boolean",
    summary: "Treat/print the number in hex form.",
    detail: "Applies to both the checked number and a freshly generated one.",
    order: 30,
  },
] as const;
export const PRIME_CATALOGUE = createFlagCatalogue<FlagGroup>(PRIME_FLAGS);

/** Modeled from the real `openssl s_client -help` output. */
export const S_CLIENT_FLAGS: readonly TlsFlagDef[] = [
  {
    id: "tls1_2",
    long: "-tls1_2",
    group: "options",
    kind: "boolean",
    conflictsWith: ["tls1_3"],
    summary: "Force the connection to use TLS 1.2.",
    detail: "Useful for confirming a server still accepts an older protocol version, or reproducing a client stuck on it.",
    order: 10,
  },
  {
    id: "tls1_3",
    long: "-tls1_3",
    group: "options",
    kind: "boolean",
    conflictsWith: ["tls1_2"],
    summary: "Force the connection to use TLS 1.3.",
    detail: "Mutually exclusive with -tls1_2 — real s_client only ever pins one protocol version at a time via these flags.",
    order: 20,
  },
  {
    id: "showcerts",
    long: "-showcerts",
    group: "options",
    kind: "boolean",
    summary: "Show the full certificate chain the server presents, not just the leaf.",
    detail: "Essential for diagnosing an incomplete chain — servers routinely forget to send their intermediates.",
    order: 30,
  },
  {
    id: "quiet",
    long: "-quiet",
    group: "options",
    kind: "boolean",
    summary: "Suppress the extra diagnostic output, showing only the actual protocol data.",
    detail: "Useful when piping the session into another tool that expects just the raw exchanged bytes.",
    order: 40,
  },
  {
    id: "servername",
    long: "-servername",
    group: "options",
    kind: "text",
    arg: { placeholder: "example.com", separator: " " },
    summary: "SNI hostname to present during the TLS handshake.",
    detail: "Important for real-world use — many servers rely on this to pick the right certificate for a shared IP.",
    order: 50,
  },
  {
    id: "cert",
    long: "-cert",
    group: "options",
    kind: "path",
    arg: { placeholder: "client.pem", separator: " " },
    summary: "A client certificate, for mutual-TLS testing.",
    detail: "Paired with -key — the server must be configured to request and trust this certificate.",
    order: 60,
  },
  {
    id: "key",
    long: "-key",
    group: "options",
    kind: "path",
    arg: { placeholder: "client.key", separator: " " },
    summary: "The client certificate's private key.",
    detail: "Only meaningful alongside -cert — a key with no matching certificate is useless to the handshake.",
    order: 70,
  },
] as const;
export const S_CLIENT_CATALOGUE = createFlagCatalogue<FlagGroup>(S_CLIENT_FLAGS);

/** Modeled from the real `openssl s_server -help` output. */
export const S_SERVER_FLAGS: readonly TlsFlagDef[] = [
  {
    id: "cert",
    long: "-cert",
    group: "options",
    kind: "path",
    arg: { placeholder: "server.pem", separator: " " },
    summary: "The server's certificate.",
    detail: "Presented to every connecting client — paired with -key.",
    order: 10,
  },
  {
    id: "key",
    long: "-key",
    group: "options",
    kind: "path",
    arg: { placeholder: "server.key", separator: " " },
    summary: "The server certificate's private key.",
    detail: "Only meaningful alongside -cert — a key with no matching certificate is useless to the handshake.",
    order: 20,
  },
  {
    id: "www",
    long: "-www",
    group: "options",
    kind: "boolean",
    summary: "Serve a simple built-in test page over HTTPS.",
    detail: "A real, common quick-testing flag — turns s_server into a minimal HTTPS server for probing clients against.",
    order: 30,
  },
  {
    id: "tls1_3",
    long: "-tls1_3",
    group: "options",
    kind: "boolean",
    summary: "Force the server to use TLS 1.3.",
    detail: "Useful for testing a client's behavior against a server pinned to the newest protocol version.",
    order: 40,
  },
] as const;
export const S_SERVER_CATALOGUE = createFlagCatalogue<FlagGroup>(S_SERVER_FLAGS);

/** Modeled from the real `openssl s_time -help` output. */
export const S_TIME_FLAGS: readonly TlsFlagDef[] = [
  {
    id: "time",
    long: "-time",
    group: "options",
    kind: "number",
    arg: { placeholder: "30", separator: " " },
    summary: "How long to run the benchmark, in seconds.",
    detail: "Real s_time defaults to 30 seconds of repeated connections when this is left unset.",
    order: 10,
  },
  {
    id: "www",
    long: "-www",
    group: "options",
    kind: "text",
    arg: { placeholder: "/", separator: " " },
    summary: "The URL path to request repeatedly during the benchmark.",
    detail: "Sent as the HTTP request path on each connection made during the timed run.",
    order: 20,
  },
] as const;
export const S_TIME_CATALOGUE = createFlagCatalogue<FlagGroup>(S_TIME_FLAGS);

/** Modeled from the real `openssl sess_id -help` output. */
export const SESS_ID_FLAGS: readonly TlsFlagDef[] = [
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the session in human-readable text form.",
    detail: "Purely informational — shows the session parameters (protocol, cipher, session ID, etc.) instead of the encoded blob.",
    order: 10,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded session itself.",
    detail: "Typically combined with -text to print only the human-readable form.",
    order: 20,
  },
] as const;
export const SESS_ID_CATALOGUE = createFlagCatalogue<FlagGroup>(SESS_ID_FLAGS);
