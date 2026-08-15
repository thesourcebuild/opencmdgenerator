import { describe, expect, it } from "vitest";
import { createSpec, PRESETS, type CurlDataEntry, type CurlSpec } from "@cmdgen/curl";

type CurlFlagValues = CurlSpec["flags"];

/**
 * Approximates every httpbingo preset's rendered request via `fetch` against
 * the live server — the same class of bug the unit tests cannot see (e.g. a
 * preset that's a syntactically valid curl invocation but targets an
 * endpoint that doesn't actually behave as documented, like the
 * websocket-echo preset needing wss:// instead of https://).
 *
 * Deliberately does not spawn curl itself — this repo's "no process
 * spawning anywhere" rule (see eslint.config.mjs) applies to test code too —
 * so a few things curl does aren't reproduced exactly: HTTP Digest auth
 * (fetch has no built-in challenge/response support) and the wss://
 * WebSocket upgrade handshake (fetch only speaks http/https) are each
 * verified as closely as a plain fetch request can; see the per-preset
 * expectations below.
 *
 * Skips entirely when httpbingo.org isn't reachable, so it never fails a
 * sandboxed or offline run — this is a network smoke test, not a
 * correctness guarantee that runs everywhere.
 */

const PROBE_TIMEOUT_MS = 5_000;
const REQUEST_TIMEOUT_MS = 15_000;

async function probeInternet(): Promise<boolean> {
  try {
    const res = await fetch("https://httpbingo.org/get", { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
    return res.ok;
  } catch {
    return false;
  }
}

const internetAvailable = await probeInternet();
if (!internetAvailable) {
  console.warn("curl-live.test.ts: httpbingo.org is unreachable — skipping live preset verification.");
}

function methodFor(flags: CurlFlagValues, hasBody: boolean): string {
  if (typeof flags.request === "string" && flags.request) return flags.request;
  if (flags.head) return "HEAD";
  if (flags.uploadFile) return "PUT";
  return hasBody ? "POST" : "GET";
}

/** Digest is handled as its own expected-401-challenge case below, not here. */
function authHeader(flags: CurlFlagValues): string | undefined {
  if (flags.digest) return undefined;
  if (typeof flags.user === "string" && flags.user) return `Basic ${Buffer.from(flags.user).toString("base64")}`;
  if (typeof flags.oauth2Bearer === "string" && flags.oauth2Bearer) return `Bearer ${flags.oauth2Bearer}`;
  return undefined;
}

function bodyFor(dataEntries: readonly CurlDataEntry[], flags: CurlFlagValues): { body?: string; contentType?: string } {
  if (flags.uploadFile) return { body: "cmdgen live-test fixture\n" };
  const nonEmpty = dataEntries.filter((e) => e.value.trim() !== "");
  if (nonEmpty.length === 0) return {};
  if (nonEmpty.some((e) => e.mode === "json")) return { body: nonEmpty.map((e) => e.value).join(""), contentType: "application/json" };
  return { body: nonEmpty.map((e) => e.value).join("&"), contentType: "application/x-www-form-urlencoded" };
}

/**
 * Endpoints a plain fetch can't exercise exactly as curl would (no Digest
 * round-trip, no WebSocket upgrade), or that intentionally respond with a
 * non-2xx status — each mapped to the status a correctly-targeted request
 * actually gets, confirmed live against the real server.
 */
const EXPECTED_STATUS: Record<string, number> = {
  "httpbingo-status": 418,
  "httpbingo-deny": 200,
  // go-httpbin documents /brotli as returning brotli-encoded data but has
  // never actually implemented it — confirmed live even with plain curl and
  // no client involved, so this 501 is the server's own permanent behavior,
  // not a bug here (the preset's own summary already says as much).
  "httpbingo-brotli": 501,
  // A single unauthenticated request gets the 401 challenge; that still
  // confirms the endpoint/path/algorithm segment is correct (the
  // www-authenticate check below confirms the challenge scheme).
  "httpbingo-digest-auth": 401,
  // fetch can't perform the ws:// Upgrade handshake; a plain HTTPS GET to a
  // WebSocket endpoint correctly gets rejected with 400. The real wss://
  // handshake (101 Switching Protocols) was confirmed manually with curl.
  "httpbingo-websocket-echo": 400,
};

// Fails ~50% of the time by design — either status is "working as intended".
const ANY_OF_STATUS: Record<string, number[]> = {
  "httpbingo-unstable": [200, 500],
};

const UNSUPPORTED_SCHEME_PRESETS = new Set([
  "dict-define",
  "dict-match",
  "imap-list-inbox",
  "imap-fetch-uid",
  "ipfs-fetch-cid",
  "mqtt-subscribe",
  "mqtt-publish",
  "pop3-list",
  "pop3-retrieve",
  "smtp-send",
  "telnet-connect",
  "tftp-download",
  "tftp-upload",
]);

describe.skipIf(!internetAvailable)("curl httpbingo presets — live network verification", () => {
  for (const preset of PRESETS) {
    const test = UNSUPPORTED_SCHEME_PRESETS.has(preset.id) ? it.skip : it;
    test(
      `${preset.id} matches its rendered request against the real httpbingo.org endpoint`,
      async () => {
        const applied = preset.apply(createSpec({ id: "live-test" }));
        const url = applied.urls.find((u) => u.trim() !== "");
        expect(url, `${preset.id} produced no URL`).toBeTruthy();

        // fetch only speaks http/https; probe the websocket endpoint over
        // https since its wss:// handshake can't be driven from fetch.
        const requestUrl = preset.id === "httpbingo-websocket-echo" ? url!.replace(/^wss:/, "https:") : url!;

        const { body, contentType } = bodyFor(applied.dataEntries, applied.flags);
        const headers = new Headers();
        for (const header of applied.headers) {
          const sep = header.indexOf(":");
          if (sep > 0) headers.set(header.slice(0, sep).trim(), header.slice(sep + 1).trim());
        }
        if (contentType && !headers.has("content-type")) headers.set("content-type", contentType);
        const auth = authHeader(applied.flags);
        if (auth) headers.set("authorization", auth);

        const res = await fetch(requestUrl, {
          method: methodFor(applied.flags, Boolean(body)),
          headers,
          body,
          redirect: "follow",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        await res.arrayBuffer().catch(() => undefined); // drain so the connection closes cleanly

        if (preset.id in EXPECTED_STATUS) {
          expect(res.status, preset.id).toBe(EXPECTED_STATUS[preset.id]);
          if (preset.id === "httpbingo-digest-auth") {
            expect(res.headers.get("www-authenticate") ?? "", preset.id).toMatch(/^Digest/i);
          }
          return;
        }
        if (preset.id in ANY_OF_STATUS) {
          expect(ANY_OF_STATUS[preset.id], preset.id).toContain(res.status);
          return;
        }
        expect(res.ok, `${preset.id} -> ${res.status} ${res.statusText}`).toBe(true);
      },
      REQUEST_TIMEOUT_MS + 5_000,
    );
  }
});
