import type { Preset } from "@cmdgen/engine";
import type { ShellDialect } from "@cmdgen/contracts";
import type { CurlSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): CurlSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    urls: [""],
    headers: [],
    dataEntries: [],
    formEntries: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

const HTTPBINGO = "https://httpbingo.org";

/**
 * One preset per endpoint documented in `go-httpbin`'s own man page
 * (httpbingo.org) — a request/response testing service purpose-built for
 * exercising an HTTP client. Path parameters (`:n`, `:user`, `:code`, ...)
 * are filled with a representative concrete value; query-string parameters
 * likewise. Every preset does a full-replace of `urls`/`flags`/`headers`/
 * `dataEntries`/`formEntries` — the same convention every other preset in
 * this app uses — so switching between httpbingo presets never leaves a
 * stale header or body behind from whichever one ran before it.
 */
const HTTPBINGO_PRESETS: readonly Preset<CurlSpec>[] = [
  // ── Request inspection ────────────────────────────────────────────────
  {
    id: "httpbingo-get",
    label: "GET /get",
    category: "HTTP - httpbingo",
    summary: "Echoes back the query string, headers and origin IP of a plain GET.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/get?foo=bar`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-anything",
    label: "GET /anything/:anything",
    category: "HTTP - httpbingo",
    summary: "Echoes back literally anything sent to it, for any HTTP method.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/anything/test-path`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-headers",
    label: "GET /headers",
    category: "HTTP - httpbingo",
    summary: "Returns the request headers dict — useful for confirming exactly what curl sent.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/headers`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-ip",
    label: "GET /ip",
    category: "HTTP - httpbingo",
    summary: "Returns the origin IP address the server saw.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/ip`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-user-agent",
    label: "GET /user-agent",
    category: "HTTP - httpbingo",
    summary: "Returns the User-Agent header curl sent.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/user-agent`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-uuid",
    label: "GET /uuid",
    category: "HTTP - httpbingo",
    summary: "Generates and returns a fresh UUIDv4 value.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/uuid`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-hostname",
    label: "GET /hostname",
    category: "HTTP - httpbingo",
    summary: "Returns the name of the host actually serving the request — useful behind a load balancer.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/hostname`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-dump-request",
    label: "GET /dump/request",
    category: "HTTP - httpbingo",
    summary: "Returns the request in its approximate raw HTTP/1.x wire representation, not JSON.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/dump/request?foo=bar`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-env",
    label: "GET /env",
    category: "HTTP - httpbingo",
    summary: "Returns every environment variable on the server that starts with HTTPBIN_ENV_.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/env`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── Methods (POST/PUT/PATCH/DELETE) ────────────────────────────────────
  {
    id: "httpbingo-post",
    label: "POST /post",
    category: "HTTP - httpbingo",
    summary: "Accepts only POST, and echoes back the body curl sent — -d alone is enough, curl infers POST.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/post`], headers: [], dataEntries: [{ mode: "data", value: "key=value" }], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-put",
    label: "PUT /put",
    category: "HTTP - httpbingo",
    summary: "Accepts only PUT, and echoes back the body curl sent.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/put`], headers: [], dataEntries: [{ mode: "data", value: "key=value" }], formEntries: [], flags: { request: "PUT" } }),
  },
  {
    id: "httpbingo-patch",
    label: "PATCH /patch",
    category: "HTTP - httpbingo",
    summary: "Accepts only PATCH, and echoes back the body curl sent.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/patch`], headers: [], dataEntries: [{ mode: "data", value: "key=value" }], formEntries: [], flags: { request: "PATCH" } }),
  },
  {
    id: "httpbingo-delete",
    label: "DELETE /delete",
    category: "HTTP - httpbingo",
    summary: "Accepts only DELETE, and echoes back the request data.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/delete`], headers: [], dataEntries: [], formEntries: [], flags: { request: "DELETE" } }),
  },
  {
    id: "httpbingo-head",
    label: "HEAD /head",
    category: "HTTP - httpbingo",
    summary: "Accepts only HEAD — returns response headers, no body.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/head`], headers: [], dataEntries: [], formEntries: [], flags: { head: true } }),
  },

  // ── Auth ───────────────────────────────────────────────────────────────
  {
    id: "httpbingo-basic-auth",
    label: "GET /basic-auth/:user/:password",
    category: "HTTP - httpbingo",
    summary: "Challenges HTTP Basic auth — returns 401 without matching credentials, 200 with them.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/basic-auth/user/pass`], headers: [], flags: { user: "user:pass" } }),
  },
  {
    id: "httpbingo-hidden-basic-auth",
    label: "GET /hidden-basic-auth/:user/:password",
    category: "HTTP - httpbingo",
    summary: "Like /basic-auth, but returns 404 instead of 401 on failure — the challenge itself is hidden.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/hidden-basic-auth/user/pass`], headers: [], flags: { user: "user:pass" } }),
  },
  {
    id: "httpbingo-bearer",
    label: "GET /bearer",
    category: "HTTP - httpbingo",
    summary: "Checks for a Bearer token header — 401 if missing, 200 with the token echoed back if present.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/bearer`], headers: [], flags: { oauth2Bearer: "test-token" } }),
  },
  {
    id: "httpbingo-digest-auth",
    label: "GET /digest-auth/:qop/:user/:password/:algorithm",
    category: "HTTP - httpbingo",
    summary: "Challenges HTTP Digest auth using SHA-256 — a stronger alternative to Basic that never sends the password itself.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/digest-auth/auth/user/pass/SHA-256`], headers: [], flags: { digest: true, user: "user:pass" } }),
  },

  // ── Status & headers ──────────────────────────────────────────────────
  {
    id: "httpbingo-status",
    label: "GET /status/:code",
    category: "HTTP - httpbingo",
    summary: "Returns exactly the given HTTP status code — 418 (I'm a teapot) by default, edit the URL for any other.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/status/418`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-response-headers",
    label: "GET /response-headers",
    category: "HTTP - httpbingo",
    summary: "Echoes back whatever query-string keys/values are given, as response headers instead of body.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/response-headers?X-Test=value`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-cache",
    label: "GET /cache",
    category: "HTTP - httpbingo",
    summary: "Returns 200 normally, or 304 if an If-Modified-Since/If-None-Match header is present.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/cache`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-cache-n",
    label: "GET /cache/:n",
    category: "HTTP - httpbingo",
    summary: "Sets Cache-Control for 60 seconds — useful for testing a client's own cache behavior.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/cache/60`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-etag",
    label: "GET /etag/:etag",
    category: "HTTP - httpbingo",
    summary: "Assumes the resource carries the given ETag; combine with If-None-Match/If-Match headers to test conditional requests.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/etag/abc123`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-trailers",
    label: "GET /trailers",
    category: "HTTP - httpbingo",
    summary: "Returns a JSON response with the given query params added back as HTTP trailers.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/trailers?X-Test=value`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── Redirects ──────────────────────────────────────────────────────────
  {
    id: "httpbingo-redirect-n",
    label: "GET /redirect/:n",
    category: "HTTP - httpbingo",
    summary: "Redirects 3 times (relative) before finally responding — -L makes curl follow the whole chain.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/redirect/3`], headers: [], dataEntries: [], formEntries: [], flags: { location: true } }),
  },
  {
    id: "httpbingo-absolute-redirect-n",
    label: "GET /absolute-redirect/:n",
    category: "HTTP - httpbingo",
    summary: "Same as /redirect but with absolute (full-URL) Location headers instead of relative paths.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/absolute-redirect/3`], headers: [], dataEntries: [], formEntries: [], flags: { location: true } }),
  },
  {
    id: "httpbingo-relative-redirect-n",
    label: "GET /relative-redirect/:n",
    category: "HTTP - httpbingo",
    summary: "Same as /redirect but explicitly relative-path Location headers.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/relative-redirect/3`], headers: [], dataEntries: [], formEntries: [], flags: { location: true } }),
  },
  {
    id: "httpbingo-redirect-to",
    label: "GET /redirect-to",
    category: "HTTP - httpbingo",
    summary: "Redirects (307) to a URL you choose via the ?url= query parameter.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/redirect-to?url=https://example.com&status_code=307`], headers: [], dataEntries: [], formEntries: [], flags: { location: true } }),
  },

  // ── Cookies ────────────────────────────────────────────────────────────
  {
    id: "httpbingo-cookies",
    label: "GET /cookies",
    category: "HTTP - httpbingo",
    summary: "Returns whatever cookies curl sent, as JSON.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/cookies`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-cookies-set",
    label: "GET /cookies/set",
    category: "HTTP - httpbingo",
    summary: "Sets a cookie via query string, then redirects to /cookies — pair with -c to capture it.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/cookies/set?name=session&value=abc123`], headers: [], dataEntries: [], formEntries: [], flags: { location: true, cookieJar: "cookies.txt" } }),
  },
  {
    id: "httpbingo-cookies-delete",
    label: "GET /cookies/delete",
    category: "HTTP - httpbingo",
    summary: "Deletes the named cookie, then redirects to /cookies.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/cookies/delete?name=session`], headers: [], dataEntries: [], formEntries: [], flags: { location: true } }),
  },

  // ── Encoding & compression ─────────────────────────────────────────────
  {
    id: "httpbingo-gzip",
    label: "GET /gzip",
    category: "HTTP - httpbingo",
    summary: "Returns a gzip-encoded response — pair with --compressed to have curl decode it automatically.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/gzip`], headers: [], dataEntries: [], formEntries: [], flags: { compressed: true } }),
  },
  {
    id: "httpbingo-deflate",
    label: "GET /deflate",
    category: "HTTP - httpbingo",
    summary: "Returns a deflate-encoded response — pair with --compressed to have curl decode it automatically.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/deflate`], headers: [], dataEntries: [], formEntries: [], flags: { compressed: true } }),
  },
  {
    id: "httpbingo-brotli",
    label: "GET /brotli",
    category: "HTTP - httpbingo",
    summary: "Documented as returning brotli-encoded data, but go-httpbin has not actually implemented this endpoint yet.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/brotli`], headers: [], dataEntries: [], formEntries: [], flags: { compressed: true } }),
  },
  {
    id: "httpbingo-encoding-utf8",
    label: "GET /encoding/utf8",
    category: "HTTP - httpbingo",
    summary: "Returns a page of UTF-8 text — a quick check that curl's output isn't mangling multi-byte characters.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/encoding/utf8`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-base64-decode",
    label: "GET /base64/:value (decode)",
    category: "HTTP - httpbingo",
    summary: "Decodes a Base64-encoded string in the URL path — this example decodes to \"hello world\".",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/base64/aGVsbG8gd29ybGQ=`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-base64-encode",
    label: "GET /base64/encode/:value",
    category: "HTTP - httpbingo",
    summary: "Encodes the given string into URL-safe Base64.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/base64/encode/HelloWorld`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── Content types ──────────────────────────────────────────────────────
  {
    id: "httpbingo-json",
    label: "GET /json",
    category: "HTTP - httpbingo",
    summary: "Returns a small, fixed sample JSON document.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/json`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-html",
    label: "GET /html",
    category: "HTTP - httpbingo",
    summary: "Renders a plain HTML page.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/html`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-xml",
    label: "GET /xml",
    category: "HTTP - httpbingo",
    summary: "Returns a small sample XML document.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/xml`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-image",
    label: "GET /image",
    category: "HTTP - httpbingo",
    summary: "Returns an image whose format is chosen from the Accept header you send.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/image`], headers: ["Accept: image/webp"], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-image-jpeg",
    label: "GET /image/jpeg",
    category: "HTTP - httpbingo",
    summary: "Returns a JPEG image directly.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/image/jpeg`], headers: [], dataEntries: [], formEntries: [], flags: { output: "image.jpg" } }),
  },
  {
    id: "httpbingo-image-png",
    label: "GET /image/png",
    category: "HTTP - httpbingo",
    summary: "Returns a PNG image directly.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/image/png`], headers: [], dataEntries: [], formEntries: [], flags: { output: "image.png" } }),
  },
  {
    id: "httpbingo-image-svg",
    label: "GET /image/svg",
    category: "HTTP - httpbingo",
    summary: "Returns an SVG image directly.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/image/svg`], headers: [], dataEntries: [], formEntries: [], flags: { output: "image.svg" } }),
  },
  {
    id: "httpbingo-image-webp",
    label: "GET /image/webp",
    category: "HTTP - httpbingo",
    summary: "Returns a WEBP image directly.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/image/webp`], headers: [], dataEntries: [], formEntries: [], flags: { output: "image.webp" } }),
  },
  {
    id: "httpbingo-forms-post",
    label: "GET /forms/post",
    category: "HTTP - httpbingo",
    summary: "An HTML form page that itself submits to /post — fetch it to see the form's own markup.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/forms/post`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-robots-txt",
    label: "GET /robots.txt",
    category: "HTTP - httpbingo",
    summary: "Returns a sample robots.txt.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/robots.txt`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-deny",
    label: "GET /deny",
    category: "HTTP - httpbingo",
    summary: "An endpoint /robots.txt disallows — fetch it directly to see the page a compliant crawler would skip.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/deny`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── Streaming & timing ─────────────────────────────────────────────────
  {
    id: "httpbingo-delay-n",
    label: "GET /delay/:n",
    category: "HTTP - httpbingo",
    summary: "Waits 3 seconds (capped at 10) before responding — good for testing timeouts.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/delay/3`], headers: [], dataEntries: [], formEntries: [], flags: { maxTime: 5 } }),
  },
  {
    id: "httpbingo-drip",
    label: "GET /drip",
    category: "HTTP - httpbingo",
    summary: "Dribbles 512 bytes out over 5 seconds after a 1-second initial delay — simulates a slow server.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/drip?numbytes=512&duration=5&delay=1&code=200`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-bytes-n",
    label: "GET /bytes/:n",
    category: "HTTP - httpbingo",
    summary: "Generates 128 random bytes of binary data.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/bytes/128`], headers: [], dataEntries: [], formEntries: [], flags: { output: "random.bin" } }),
  },
  {
    id: "httpbingo-stream-bytes-n",
    label: "GET /stream-bytes/:n",
    category: "HTTP - httpbingo",
    summary: "Streams 256 random bytes rather than sending them all at once.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/stream-bytes/256`], headers: [], dataEntries: [], formEntries: [], flags: { output: "stream.bin" } }),
  },
  {
    id: "httpbingo-stream-n",
    label: "GET /stream/:n",
    category: "HTTP - httpbingo",
    summary: "Streams 5 lines of newline-delimited JSON (capped at 100).",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/stream/5`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-range",
    label: "GET /range/1024",
    category: "HTTP - httpbingo",
    summary: "Streams 1024 bytes and honors a Range header to select a subset — pair with -r to test partial fetches.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/range/1024?duration=1s&chunk_size=10`], headers: [], dataEntries: [], formEntries: [], flags: { range: "0-99" } }),
  },
  {
    id: "httpbingo-sse",
    label: "GET /sse",
    category: "HTTP - httpbingo",
    summary: "A stream of server-sent events, 5 of them over about 5 seconds.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/sse?delay=1s&duration=5s&count=5`], headers: [], dataEntries: [], formEntries: [], flags: { noBuffer: true } }),
  },
  {
    id: "httpbingo-jsonl",
    label: "GET /jsonl",
    category: "HTTP - httpbingo",
    summary: "Streams 5 lines of JSON Lines data over about 2 seconds.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/jsonl?count=5&duration=2s`], headers: [], dataEntries: [], formEntries: [], flags: { noBuffer: true } }),
  },
  {
    id: "httpbingo-unstable",
    label: "GET /unstable",
    category: "HTTP - httpbingo",
    summary: "Fails about half the time by design — good for exercising --retry.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/unstable?failure_rate=0.5`], headers: [], dataEntries: [], formEntries: [], flags: { retry: 3 } }),
  },
  {
    id: "httpbingo-websocket-echo",
    label: "GET /websocket/echo",
    category: "HTTP - httpbingo",
    summary: "A WebSocket echo endpoint — curl 8.x+ speaks wss:// natively and completes the upgrade handshake.",
    apply: (spec) => ({ ...spec, urls: ["wss://httpbingo.org/websocket/echo?max_fragment_size=2048&max_message_size=10240"], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── Misc ───────────────────────────────────────────────────────────────
  {
    id: "httpbingo-links",
    label: "GET /links/:n",
    category: "HTTP - httpbingo",
    summary: "Returns a page containing 5 HTML links.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/links/5`], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "httpbingo-upload",
    label: "POST /upload",
    category: "HTTP - httpbingo",
    summary: "Discards the request body — purpose-built for measuring raw upload throughput, not for inspecting content.",
    apply: (spec) => ({ ...spec, urls: [`${HTTPBINGO}/upload`], headers: [], dataEntries: [], formEntries: [], flags: { uploadFile: "/path/to/file" } }),
  },
];

/**
 * curl speaks several non-HTTP protocols natively — one category per
 * protocol, matching the httpbingo batch's own convention of a category the
 * user can pick before narrowing to a preset. Real, publicly reachable
 * services are used where one safely exists (DICT's dict.org, MQTT's
 * test.mosquitto.org, TELNET's classic towel.blinkenlights.nl demo, IPFS via
 * a public gateway) — each confirmed live against the real service while
 * building this list. IMAP, POP3, SMTP and TFTP have no safe anonymous
 * public server to demonstrate against (they need the user's own mailbox or
 * device), so those use the same clearly-a-placeholder `*.example.com`
 * convention already used elsewhere in this app (e.g. ssh's host field).
 */
const OTHER_PROTOCOL_PRESETS: readonly Preset<CurlSpec>[] = [
  // ── DICT ─────────────────────────────────────────────────────────────
  {
    id: "dict-define",
    label: "Define a word",
    category: "DICT",
    summary: "Looks up a word in dict.org's public dictionary server — DICT protocol, RFC 2229.",
    apply: (spec) => ({ ...spec, urls: ["dict://dict.org/d:curl"], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "dict-match",
    label: "Find matching words",
    category: "DICT",
    summary: "Lists every headword in dict.org's default database that matches, instead of a full definition.",
    apply: (spec) => ({ ...spec, urls: ["dict://dict.org/m:curl"], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── IMAP ─────────────────────────────────────────────────────────────
  {
    id: "imap-list-inbox",
    label: "List messages in INBOX",
    category: "IMAP",
    summary: "Replace the host and credentials with your own mail account — no public anonymous IMAP server exists to demo against.",
    apply: (spec) => ({ ...spec, urls: ["imap://imap.example.com/INBOX"], headers: [], dataEntries: [], formEntries: [], flags: { user: "user:password" } }),
  },
  {
    id: "imap-fetch-uid",
    label: "Fetch a message by UID",
    category: "IMAP",
    summary: "The ;UID=n suffix selects one message instead of listing the whole mailbox.",
    apply: (spec) => ({ ...spec, urls: ["imap://imap.example.com/INBOX;UID=1"], headers: [], dataEntries: [], formEntries: [], flags: { user: "user:password" } }),
  },

  // ── IPFS ─────────────────────────────────────────────────────────────
  {
    id: "ipfs-fetch-cid",
    label: "Fetch content by CID",
    category: "IPFS",
    summary:
      "curl 8.4+ speaks ipfs:// natively but needs a gateway — a local IPFS node, IPFS_GATEWAY, or (as here) an explicit public one. The CID shown is IPFS's own canonical empty-directory object, confirmed reachable through this gateway.",
    apply: (spec) => ({
      ...spec,
      urls: ["ipfs://QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn"],
      headers: [],
      dataEntries: [],
      formEntries: [],
      flags: { ipfsGateway: "https://ipfs.io" },
    }),
  },

  // ── MQTT ─────────────────────────────────────────────────────────────
  {
    id: "mqtt-subscribe",
    label: "Subscribe to a topic",
    category: "MQTT",
    summary: "Connects to the public Eclipse Mosquitto test broker and waits for one message on the topic. Blocks until a message arrives — Ctrl+C to stop.",
    apply: (spec) => ({ ...spec, urls: ["mqtt://test.mosquitto.org/curl-cmd-generator-demo"], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },
  {
    id: "mqtt-publish",
    label: "Publish to a topic",
    category: "MQTT",
    summary: "Publishes one message to the same public test broker/topic and exits immediately — curl's MQTT support switches to publish mode whenever a body is given.",
    apply: (spec) => ({
      ...spec,
      urls: ["mqtt://test.mosquitto.org/curl-cmd-generator-demo"],
      headers: [],
      dataEntries: [{ mode: "data", value: "hello from curl" }],
      formEntries: [],
      flags: {},
    }),
  },

  // ── POP3 ─────────────────────────────────────────────────────────────
  {
    id: "pop3-list",
    label: "List messages",
    category: "POP3",
    summary: "Replace the host and credentials with your own mail account — no public anonymous POP3 server exists to demo against.",
    apply: (spec) => ({ ...spec, urls: ["pop3://pop.example.com/"], headers: [], dataEntries: [], formEntries: [], flags: { user: "user:password" } }),
  },
  {
    id: "pop3-retrieve",
    label: "Retrieve message 1",
    category: "POP3",
    summary: "The trailing number selects one message by its POP3 sequence number instead of listing the mailbox.",
    apply: (spec) => ({ ...spec, urls: ["pop3://pop.example.com/1"], headers: [], dataEntries: [], formEntries: [], flags: { user: "user:password" } }),
  },

  // ── SMTP ─────────────────────────────────────────────────────────────
  {
    id: "smtp-send",
    label: "Send an email",
    category: "SMTP",
    summary: "Replace the host with your own mail server — no public anonymous SMTP relay exists to demo against. --mail-from/--mail-rcpt set the envelope; --upload-file supplies the message itself (headers included).",
    apply: (spec) => ({
      ...spec,
      urls: ["smtp://smtp.example.com"],
      headers: [],
      dataEntries: [],
      formEntries: [],
      flags: { mailFrom: "sender@example.com", mailRcpt: "recipient@example.com", uploadFile: "email.txt" },
    }),
  },

  // ── TELNET ───────────────────────────────────────────────────────────
  {
    id: "telnet-connect",
    label: "Connect to a service",
    category: "TELNET",
    summary: "The classic ASCII Star Wars over telnet — a real, long-running public demo, good for confirming curl's telnet:// support works at all.",
    apply: (spec) => ({ ...spec, urls: ["telnet://towel.blinkenlights.nl:23"], headers: [], dataEntries: [], formEntries: [], flags: {} }),
  },

  // ── TFTP ─────────────────────────────────────────────────────────────
  {
    id: "tftp-download",
    label: "Download a file",
    category: "TFTP",
    summary: "Replace the host with your own TFTP server — TFTP is UDP-based and almost always LAN-local (firmware/PXE boot), so no public server exists to demo against.",
    apply: (spec) => ({ ...spec, urls: ["tftp://tftp.example.com/file.bin"], headers: [], dataEntries: [], formEntries: [], flags: { output: "file.bin" } }),
  },
  {
    id: "tftp-upload",
    label: "Upload a file",
    category: "TFTP",
    summary: "--upload-file sends a TFTP write request (WRQ) instead of a read request — replace the host and local file with your own.",
    apply: (spec) => ({ ...spec, urls: ["tftp://tftp.example.com/file.bin"], headers: [], dataEntries: [], formEntries: [], flags: { uploadFile: "file.bin" } }),
  },
];

export const PRESETS: readonly Preset<CurlSpec>[] = [...HTTPBINGO_PRESETS, ...OTHER_PROTOCOL_PRESETS];

export function getPreset(id: string): Preset<CurlSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
