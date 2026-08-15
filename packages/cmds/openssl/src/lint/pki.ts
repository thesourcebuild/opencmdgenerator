import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool, flagString, setFlag } from "../pure";

const ocspNoverifyRisk: LintRule<OpensslSpec> = {
  code: "OSSLPK001",
  check(spec) {
    if (spec.subcommand !== "ocsp" || !flagBool(spec, "noverify")) return [];
    return [
      {
        code: "OSSLPK001",
        level: "warning",
        message: "-noverify skips checking the OCSP response's own signature.",
        detail: "Defeats the point of an OCSP check — a forged or tampered revocation-status response would be accepted just as readily as a genuine one.",
        flagIds: ["noverify"],
        fix: { label: "Remove -noverify", apply: (s) => (s.subcommand === "ocsp" ? setFlag(s, "noverify", undefined) : s) },
      },
    ];
  },
};

const ocspMissingCore: LintRule<OpensslSpec> = {
  code: "OSSLPK002",
  check(spec) {
    if (spec.subcommand !== "ocsp") return [];
    if (spec.certFile.trim() !== "" && spec.url.trim() !== "") return [];
    return [
      {
        code: "OSSLPK002",
        level: "error",
        message: "A certificate to check and a responder URL are both required.",
        detail: "Real ocsp has nothing to query and nowhere to send the query without a certificate (-cert) and a responder URL (-url).",
        field: spec.certFile.trim() === "" ? "certFile" : "url",
      },
    ];
  },
};

const tsVerifyWithoutCaFile: LintRule<OpensslSpec> = {
  code: "OSSLPK003",
  check(spec) {
    if (spec.subcommand !== "ts" || spec.action !== "verify") return [];
    if (flagString(spec, "caFile")?.trim()) return [];
    return [
      {
        code: "OSSLPK003",
        level: "warning",
        message: "-verify with no -CAfile has no trust anchor to check the timestamp against.",
        detail: "Real ts -verify needs a CA file (or an equivalent trust store) to validate the TSA's signature on the response.",
        flagIds: ["caFile"],
      },
    ];
  },
};

const tsQueryInFileAndData: LintRule<OpensslSpec> = {
  code: "OSSLPK004",
  check(spec) {
    if (spec.subcommand !== "ts" || spec.action !== "query") return [];
    if (spec.inFile.trim() === "" || !flagString(spec, "data")?.trim()) return [];
    return [
      {
        code: "OSSLPK004",
        level: "error",
        message: "-query rejects both an existing request file and -data in the same invocation.",
        detail: "In file and -data are alternative sources for the same query — real ts errors out if both are given at once.",
        field: "inFile",
        flagIds: ["data"],
      },
    ];
  },
};

const cmsEncryptWithoutRecip: LintRule<OpensslSpec> = {
  code: "OSSLPK005",
  check(spec) {
    if (spec.subcommand !== "cms" || spec.action !== "encrypt") return [];
    if (flagString(spec, "recip")?.trim()) return [];
    return [
      {
        code: "OSSLPK005",
        level: "error",
        message: "-encrypt requires a recipient certificate.",
        detail: "Without -recip, real cms has no public key to encrypt the content to.",
        flagIds: ["recip"],
      },
    ];
  },
};

const cmsSignWithoutSigner: LintRule<OpensslSpec> = {
  code: "OSSLPK006",
  check(spec) {
    if (spec.subcommand !== "cms" || spec.action !== "sign") return [];
    if (flagString(spec, "signer")?.trim()) return [];
    return [
      {
        code: "OSSLPK006",
        level: "error",
        message: "-sign requires a signer certificate.",
        detail: "Without -signer, real cms has no certificate to embed alongside the signature.",
        flagIds: ["signer"],
      },
    ];
  },
};

const cmsDecryptWithoutInkey: LintRule<OpensslSpec> = {
  code: "OSSLPK007",
  check(spec) {
    if (spec.subcommand !== "cms" || spec.action !== "decrypt") return [];
    if (flagString(spec, "inkey")?.trim()) return [];
    return [
      {
        code: "OSSLPK007",
        level: "error",
        message: "-decrypt requires the recipient's private key.",
        detail: "Without -inkey, real cms has no private key to decrypt the content with.",
        flagIds: ["inkey"],
      },
    ];
  },
};

export const PKI_RULES: readonly LintRule<OpensslSpec>[] = [
  ocspNoverifyRisk,
  ocspMissingCore,
  tsVerifyWithoutCaFile,
  tsQueryInFileAndData,
  cmsEncryptWithoutRecip,
  cmsSignWithoutSigner,
  cmsDecryptWithoutInkey,
];
