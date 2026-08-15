import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/** Mirrors curl's own `--help category` groupings (auth/connection/dns/...), consolidating the three mail protocols (pop3/imap/smtp) into one `mail` group and folding curl's own "deprecated" category in verbatim. */
export const FLAG_GROUPS = [
  "global",
  "auth",
  "connection",
  "dns",
  "tls",
  "proxy",
  "http",
  "post",
  "upload",
  "ftp",
  "ssh",
  "mail",
  "telnet",
  "tftp",
  "output",
  "timeout",
  "transfer",
  "deprecated",
] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  global: {
    id: "global",
    label: "Global behavior",
    summary: "curl-level options not tied to any one protocol.",
    order: 10,
    collapsedByDefault: false,
  },
  auth: {
    id: "auth",
    label: "Authentication",
    summary: "Credentials and the method used to present them.",
    order: 20,
    collapsedByDefault: false,
  },
  connection: {
    id: "connection",
    label: "Connection",
    summary: "Interfaces, sockets, keepalive and low-level network tuning.",
    order: 30,
    collapsedByDefault: true,
  },
  dns: {
    id: "dns",
    label: "DNS",
    summary: "Name resolution, including DNS-over-HTTPS.",
    order: 40,
    collapsedByDefault: true,
  },
  tls: {
    id: "tls",
    label: "TLS / SSL",
    summary: "Certificates, ciphers, protocol versions and certificate verification.",
    order: 50,
    collapsedByDefault: false,
  },
  proxy: {
    id: "proxy",
    label: "Proxy",
    summary: "HTTP(S) and SOCKS proxying, including proxy-specific TLS and auth.",
    order: 60,
    collapsedByDefault: true,
  },
  http: {
    id: "http",
    label: "HTTP",
    summary: "Method, redirects, HTTP version, cookies and other HTTP-specific behavior.",
    order: 70,
    collapsedByDefault: false,
  },
  post: {
    id: "post",
    label: "Request body",
    summary: "How -d/-F body entries are shaped and sent.",
    order: 80,
    collapsedByDefault: false,
  },
  upload: {
    id: "upload",
    label: "Upload",
    summary: "Sending a local file as the request body.",
    order: 90,
    collapsedByDefault: true,
  },
  ftp: {
    id: "ftp",
    label: "FTP",
    summary: "FTP-protocol-specific transfer behavior.",
    order: 100,
    collapsedByDefault: true,
  },
  ssh: {
    id: "ssh",
    label: "SSH / SCP / SFTP",
    summary: "Host key and public key handling shared by the SSH-family protocols.",
    order: 110,
    collapsedByDefault: true,
  },
  mail: {
    id: "mail",
    label: "Mail (SMTP/POP3/IMAP)",
    summary: "Envelope and login options for the mail protocols.",
    order: 120,
    collapsedByDefault: true,
  },
  telnet: {
    id: "telnet",
    label: "Telnet",
    summary: "Options passed through to a telnet session.",
    order: 130,
    collapsedByDefault: true,
  },
  tftp: {
    id: "tftp",
    label: "TFTP",
    summary: "TFTP block size and option negotiation.",
    order: 140,
    collapsedByDefault: true,
  },
  output: {
    id: "output",
    label: "Output",
    summary: "What curl prints, saves, and where — verbosity, tracing, saving to a file.",
    order: 150,
    collapsedByDefault: false,
  },
  timeout: {
    id: "timeout",
    label: "Timeouts & retries",
    summary: "Time limits, retry behavior and rate/speed limiting.",
    order: 160,
    collapsedByDefault: true,
  },
  transfer: {
    id: "transfer",
    label: "Transfer range & resume",
    summary: "Byte ranges, resuming a partial transfer, and preserving remote timestamps.",
    order: 170,
    collapsedByDefault: true,
  },
  deprecated: {
    id: "deprecated",
    label: "Legacy / deprecated",
    summary: "Options curl itself documents as obsolete, insecure, or no longer functional — kept for scripts that still pass them.",
    order: 180,
    collapsedByDefault: true,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
