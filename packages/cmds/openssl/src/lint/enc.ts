import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool, flagString, setFlag } from "../pure";

const encNosaltRisk: LintRule<OpensslSpec> = {
  code: "OSSL002",
  check(spec) {
    if (spec.subcommand !== "enc" || !flagBool(spec, "nosalt")) return [];
    return [
      {
        code: "OSSL002",
        level: "warning",
        message: "-nosalt makes the derived key identical every time the same passphrase is used.",
        detail: "Real, meaningful weakening — an attacker can precompute a dictionary attack against every ciphertext using this passphrase.",
        flagIds: ["nosalt"],
        fix: { label: "Remove -nosalt", apply: (s) => (s.subcommand === "enc" ? setFlag(s, "nosalt", undefined) : s) },
      },
    ];
  },
};

const encPassWithoutPbkdf2: LintRule<OpensslSpec> = {
  code: "OSSL003",
  check(spec) {
    if (spec.subcommand !== "enc") return [];
    if (!flagString(spec, "pass")?.trim()) return [];
    if (flagBool(spec, "pbkdf2")) return [];
    return [
      {
        code: "OSSL003",
        level: "info",
        message: "Real openssl warns when a passphrase is given without -pbkdf2.",
        detail: "Without it, an older and weaker key-derivation scheme is used. Modern openssl recommends -pbkdf2 (optionally with -iter) whenever a passphrase is set.",
        flagIds: ["pass"],
        fix: { label: "Add -pbkdf2", apply: (s) => (s.subcommand === "enc" ? setFlag(s, "pbkdf2", true) : s) },
      },
    ];
  },
};

const rsautlPkeyutlNoAction: LintRule<OpensslSpec> = {
  code: "OSSL004",
  check(spec) {
    if (spec.subcommand !== "rsautl" && spec.subcommand !== "pkeyutl") return [];
    const hasAction =
      flagBool(spec, "encrypt") ||
      flagBool(spec, "decrypt") ||
      flagBool(spec, "sign") ||
      flagBool(spec, "verify") ||
      (spec.subcommand === "pkeyutl" && flagBool(spec, "derive"));
    if (hasAction) return [];
    return [
      {
        code: "OSSL004",
        level: "info",
        message: "No operation selected — pick one of Encrypt/Decrypt/Sign/Verify" + (spec.subcommand === "pkeyutl" ? "/Derive" : "") + ".",
        detail: "Real openssl requires exactly one of these to know what to do with the key and input.",
      },
    ];
  },
};

const rsautlPkeyutlNoKey: LintRule<OpensslSpec> = {
  code: "OSSL005",
  check(spec) {
    if (spec.subcommand !== "rsautl" && spec.subcommand !== "pkeyutl") return [];
    if (spec.keyFile.trim() !== "") return [];
    return [
      {
        code: "OSSL005",
        level: "error",
        message: "A key file is required — this operation has nothing to operate with otherwise.",
        field: "keyFile",
      },
    ];
  },
};

export const ENC_RULES: readonly LintRule<OpensslSpec>[] = [
  encNosaltRisk,
  encPassWithoutPbkdf2,
  rsautlPkeyutlNoAction,
  rsautlPkeyutlNoKey,
];
