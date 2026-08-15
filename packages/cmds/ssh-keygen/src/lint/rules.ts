import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SshKeygenSpec } from "../spec";
import { flagBool } from "../pure";

const emptyPassphrase: LintRule<SshKeygenSpec> = {
  code: "SKG001",
  check(spec) {
    if (!spec.setPassphrase || spec.passphrase.trim() !== "") return [];
    return [
      {
        code: "SKG001",
        level: "warning",
        message: "-N '' creates a key with no passphrase at all.",
        detail: "Anyone who obtains the private key file can use it immediately, with nothing else to break through. Only do this deliberately (e.g. for an automated deploy key) — leave -N unset for an interactive prompt instead.",
        field: "passphrase",
      },
    ];
  },
};

const exportIgnoresKeyFields: LintRule<SshKeygenSpec> = {
  code: "SKG002",
  check(spec) {
    if (!flagBool(spec, "exportPublicKey")) return [];
    return [
      {
        code: "SKG002",
        level: "info",
        message: "-y ignores key type, bit length, comment, and passphrase — only -f (and -q) apply here.",
        detail: "-y reads an existing private key and prints its public key; it never generates anything new.",
        flagIds: ["exportPublicKey"],
      },
    ];
  },
};

const exportNeedsOutputFile: LintRule<SshKeygenSpec> = {
  code: "SKG003",
  check(spec) {
    if (!flagBool(spec, "exportPublicKey") || spec.outputFile.trim() !== "") return [];
    return [
      {
        code: "SKG003",
        level: "error",
        message: "-y needs -f pointing at the private key file to read.",
        field: "outputFile",
      },
    ];
  },
};

const bitsIgnoredForEd25519: LintRule<SshKeygenSpec> = {
  code: "SKG004",
  check(spec) {
    if (flagBool(spec, "exportPublicKey")) return [];
    if (spec.keyType !== "ed25519" || spec.bits.trim() === "") return [];
    return [
      {
        code: "SKG004",
        level: "warning",
        message: "-b has no effect for ed25519 keys — their size is fixed.",
        field: "bits",
        fix: { label: "Clear the bit length", apply: (s) => ({ ...s, bits: "" }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<SshKeygenSpec>[] = [
  emptyPassphrase,
  exportIgnoresKeyFields,
  exportNeedsOutputFile,
  bitsIgnoredForEd25519,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
