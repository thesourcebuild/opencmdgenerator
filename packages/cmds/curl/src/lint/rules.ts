import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, unmetRequirements } from "@cmdgen/engine";
import type { CurlSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagString, setFlag, validUrls } from "../pure";

function activeFlagIds(spec: CurlSpec): string[] {
  return CATALOGUE.flagsInArgvOrder()
    .filter((f) => {
      const v = spec.flags[f.id];
      if (v === undefined) return false;
      if (f.kind === "boolean") return v === true;
      if (f.kind === "enum") return typeof v === "string" && v !== "" && v !== "none";
      return true;
    })
    .map((f) => f.id);
}

const noUrl: LintRule<CurlSpec> = {
  code: "CURL001",
  check(spec) {
    if (validUrls(spec).length > 0) return [];
    return [
      {
        code: "CURL001",
        level: "error",
        message: "No URL to fetch.",
        detail: "curl needs at least one target — add a URL.",
        field: "urls",
      },
    ];
  },
};

const contradictoryFlags: LintRule<CurlSpec> = {
  code: "CURL002",
  check(spec) {
    const active = activeFlagIds(spec);
    return conflictingPairs(CATALOGUE, active).map(([a, b]): Diagnostic<CurlSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CURL002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const missingPrerequisite: LintRule<CurlSpec> = {
  code: "CURL003",
  check(spec) {
    const active = activeFlagIds(spec);
    return unmetRequirements(CATALOGUE, active).map(([id, need]): Diagnostic<CurlSpec> => {
      const def = CATALOGUE.getFlag(id);
      const needDef = CATALOGUE.getFlag(need);
      return {
        code: "CURL003",
        level: "warning",
        message: `${def ? flagLabel(def) : id} has no effect without ${needDef ? flagLabel(needDef) : need}.`,
        flagIds: [id, need],
        fix: {
          label: `Enable ${needDef ? flagLabel(needDef) : need}`,
          apply: (s) => setFlag(s, need, needDef?.kind === "boolean" ? true : s.flags[need]),
        },
      };
    });
  },
};

const insecureRisk: LintRule<CurlSpec> = {
  code: "CURL004",
  check(spec) {
    if (!flagBool(spec, "insecure")) return [];
    return [
      {
        code: "CURL004",
        level: "destructive",
        message: "-k/--insecure disables TLS certificate verification.",
        detail:
          "The connection is no longer protected against interception — anyone able to intercept traffic to this host can read or alter it undetected. Only use this against a server you already trust for other reasons (e.g. a self-signed dev cert you issued yourself).",
        flagIds: ["insecure"],
        fix: { label: "Remove -k", apply: (s) => setFlag(s, "insecure", undefined) },
      },
    ];
  },
};

const credentialsInCommandLine: LintRule<CurlSpec> = {
  code: "CURL005",
  check(spec) {
    const flagged = (["user", "proxyUser", "oauth2Bearer", "pass", "proxyPass"] as const).filter((id) => flagString(spec, id));
    if (flagged.length === 0) return [];
    const labels = flagged.map((id) => flagLabel(CATALOGUE.requireFlag(id)));
    return [
      {
        code: "CURL005",
        level: "warning",
        message: `${labels.join(", ")} ${labels.length === 1 ? "puts a credential" : "put credentials"} directly on the command line.`,
        detail:
          "Anything typed here lands in shell history and is visible to anyone who can list processes on this machine while curl runs. --netrc (or a config file read with -K) keeps credentials out of both.",
        flagIds: [...flagged],
      },
    ];
  },
};

const locationTrustedRisk: LintRule<CurlSpec> = {
  code: "CURL006",
  check(spec) {
    if (!flagBool(spec, "locationTrusted")) return [];
    return [
      {
        code: "CURL006",
        level: "destructive",
        message: "--location-trusted resends your credentials to any host a redirect points at.",
        detail:
          "Plain --location strips the Authorization header on a cross-host redirect specifically to stop this from happening. This flag disables that protection — a malicious or compromised server could redirect to a host of its choosing and receive your --user credentials.",
        flagIds: ["locationTrusted"],
        fix: { label: "Remove --location-trusted", apply: (s) => setFlag(s, "locationTrusted", undefined) },
      },
    ];
  },
};

const multipleHttpVersions: LintRule<CurlSpec> = {
  code: "CURL007",
  check(spec) {
    const ids = ["http10", "http11", "http2", "http2PriorKnowledge", "http3", "http3Only"] as const;
    const active = ids.filter((id) => flagBool(spec, id));
    if (active.length < 2) return [];
    const labels = active.map((id) => flagLabel(CATALOGUE.requireFlag(id)));
    return [
      {
        code: "CURL007",
        level: "warning",
        message: `More than one HTTP version selected: ${labels.join(", ")}.`,
        detail: "curl uses whichever of these came last on the command line — pick one to avoid depending on that ordering.",
        flagIds: [...active],
      },
    ];
  },
};

const multipleProxyProtocols: LintRule<CurlSpec> = {
  code: "CURL008",
  check(spec) {
    const ids = ["proxy", "socks4", "socks4a", "socks5", "socks5Hostname"] as const;
    const active = ids.filter((id) => flagString(spec, id));
    if (active.length < 2) return [];
    const labels = active.map((id) => flagLabel(CATALOGUE.requireFlag(id)));
    return [
      {
        code: "CURL008",
        level: "error",
        message: `More than one proxy selected: ${labels.join(", ")}.`,
        detail: "Only one proxy can be in effect — pick the one you actually want.",
        flagIds: [...active],
      },
    ];
  },
};

const bodyAndUploadTogether: LintRule<CurlSpec> = {
  code: "CURL009",
  check(spec) {
    const hasUploadFile = flagString(spec, "uploadFile");
    const hasData = spec.dataEntries.some((e) => e.value.trim() !== "");
    if (!hasUploadFile || !hasData) return [];
    return [
      {
        code: "CURL009",
        level: "error",
        message: "-T/--upload-file and a -d/--data body are both set.",
        detail: "A request has one body. curl sends whichever it resolves internally, which depends on option order — treat this as a mistake rather than something to rely on.",
        flagIds: ["uploadFile"],
        field: "dataEntries",
      },
    ];
  },
};

const dataAndFormTogether: LintRule<CurlSpec> = {
  code: "CURL010",
  check(spec) {
    const hasData = spec.dataEntries.some((e) => e.value.trim() !== "");
    const hasForm = spec.formEntries.some((e) => e.value.trim() !== "");
    if (!hasData || !hasForm) return [];
    return [
      {
        code: "CURL010",
        level: "error",
        message: "-d/--data entries and -F/--form entries are both set.",
        detail: "curl rejects mixing a plain data body with a multipart form body in the same request — pick one shape for this request.",
        field: "dataEntries",
      },
    ];
  },
};

const jsonModeWithOtherData: LintRule<CurlSpec> = {
  code: "CURL011",
  check(spec) {
    const hasJson = spec.dataEntries.some((e) => e.mode === "json" && e.value.trim() !== "");
    const hasOtherData = spec.dataEntries.some((e) => e.mode !== "json" && e.value.trim() !== "");
    if (!hasJson || !hasOtherData) return [];
    return [
      {
        code: "CURL011",
        level: "warning",
        message: "A --json entry is mixed with other -d/--data-* entries.",
        detail: "--json also sets Content-Type/Accept headers for you — combining it with a plain -d chunk usually means the body is not the JSON document you intended.",
        field: "dataEntries",
      },
    ];
  },
};

const remoteNameWithoutPath: LintRule<CurlSpec> = {
  code: "CURL012",
  check(spec) {
    if (!flagBool(spec, "remoteName")) return [];
    const bare = validUrls(spec).filter((u) => {
      const afterScheme = u.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, "");
      const slash = afterScheme.indexOf("/");
      return slash === -1 || afterScheme.slice(slash + 1).trim() === "";
    });
    if (bare.length === 0) return [];
    return [
      {
        code: "CURL012",
        level: "warning",
        message: "-O/--remote-name needs a filename in the URL, and at least one URL here has none.",
        detail: "A URL with no path segment (e.g. https://example.com) has no name for curl to save under — it will fail with \"Remote file name has no length\".",
        flagIds: ["remoteName"],
        field: "urls",
      },
    ];
  },
};

const netrcWithExplicitUser: LintRule<CurlSpec> = {
  code: "CURL013",
  check(spec) {
    const netrc = flagBool(spec, "netrc") || flagBool(spec, "netrcOptional");
    if (!netrc || !flagString(spec, "user")) return [];
    return [
      {
        code: "CURL013",
        level: "info",
        message: "--netrc(-optional) and --user are both set.",
        detail: "--user on the command line takes priority over anything in the netrc file — the netrc lookup will not actually run for this host.",
        flagIds: ["user"],
      },
    ];
  },
};

const insecureWithCertPinning: LintRule<CurlSpec> = {
  code: "CURL014",
  check(spec) {
    if (!flagBool(spec, "insecure")) return [];
    const pinned = (["cacert", "capath", "pinnedpubkey"] as const).filter((id) => flagString(spec, id));
    if (pinned.length === 0) return [];
    const labels = pinned.map((id) => flagLabel(CATALOGUE.requireFlag(id)));
    return [
      {
        code: "CURL014",
        level: "info",
        message: `${labels.join(", ")} ${labels.length === 1 ? "has" : "have"} no effect while -k/--insecure is set.`,
        detail: "-k skips certificate verification entirely, so nothing that only tightens verification changes anything.",
        flagIds: ["insecure", ...pinned],
      },
    ];
  },
};

const headOnlyWithBody: LintRule<CurlSpec> = {
  code: "CURL015",
  check(spec) {
    if (!flagBool(spec, "head")) return [];
    const hasData = spec.dataEntries.some((e) => e.value.trim() !== "");
    const hasForm = spec.formEntries.some((e) => e.value.trim() !== "");
    const hasUpload = Boolean(flagString(spec, "uploadFile"));
    if (!hasData && !hasForm && !hasUpload) return [];
    return [
      {
        code: "CURL015",
        level: "warning",
        message: "-I/--head is set alongside a request body.",
        detail: "HEAD requests fetch headers only — a body may still be sent, but most servers ignore it for this method, and there is never a response body to see the effect.",
        flagIds: ["head"],
      },
    ];
  },
};

const retryDefaultsWithoutRetry: LintRule<CurlSpec> = {
  code: "CURL016",
  check(spec) {
    if (flagString(spec, "retry") !== undefined) return [];
    const tuning = (["retryDelay", "retryMaxTime", "retryConnrefused", "retryAllErrors"] as const).filter(
      (id) => spec.flags[id] !== undefined,
    );
    if (tuning.length === 0) return [];
    const labels = tuning.map((id) => flagLabel(CATALOGUE.requireFlag(id)));
    return [
      {
        code: "CURL016",
        level: "warning",
        message: `${labels.join(", ")} ${labels.length === 1 ? "has" : "have"} no effect without --retry.`,
        detail: "All of curl's retry tuning flags only matter once --retry sets a nonzero retry count.",
        flagIds: [...tuning],
        fix: { label: "Set --retry 3", apply: (s) => setFlag(s, "retry", 3) },
      },
    ];
  },
};

const rangeWithUploadOrData: LintRule<CurlSpec> = {
  code: "CURL017",
  check(spec) {
    if (flagString(spec, "range") === undefined) return [];
    const hasUpload = Boolean(flagString(spec, "uploadFile"));
    const hasData = spec.dataEntries.some((e) => e.value.trim() !== "");
    if (!hasUpload && !hasData) return [];
    return [
      {
        code: "CURL017",
        level: "info",
        message: "--range is set on what looks like an upload/POST request.",
        detail: "Range applies to what curl fetches back, not to the request body being sent — it takes effect on the download side of this transfer, if there is one.",
        flagIds: ["range"],
      },
    ];
  },
};

const speedLimitDefaultTime: LintRule<CurlSpec> = {
  code: "CURL018",
  check(spec) {
    if (flagString(spec, "speedLimit") === undefined) return [];
    if (flagString(spec, "speedTime") !== undefined) return [];
    return [
      {
        code: "CURL018",
        level: "info",
        message: "--speed-limit is set without --speed-time.",
        detail: "curl uses its own default of 30 seconds before treating the transfer as too slow and aborting.",
        flagIds: ["speedLimit"],
      },
    ];
  },
};

export const RULES: readonly LintRule<CurlSpec>[] = [
  noUrl,
  contradictoryFlags,
  missingPrerequisite,
  insecureRisk,
  credentialsInCommandLine,
  locationTrustedRisk,
  multipleHttpVersions,
  multipleProxyProtocols,
  bodyAndUploadTogether,
  dataAndFormTogether,
  jsonModeWithOtherData,
  remoteNameWithoutPath,
  netrcWithExplicitUser,
  insecureWithCertPinning,
  headOnlyWithBody,
  retryDefaultsWithoutRetry,
  rangeWithUploadOrData,
  speedLimitDefaultTime,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);

/** Self-check that every flag id a rule references by string literal still exists in FLAGS. */
export function validateRuleFlagIds(): string[] {
  const missing: string[] = [];
  for (const id of ["insecure", "user", "proxyUser", "oauth2Bearer", "pass", "proxyPass", "locationTrusted", "retry"]) {
    if (!CATALOGUE.getFlag(id)) missing.push(id);
  }
  return missing;
}
