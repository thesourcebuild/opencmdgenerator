import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { VERIFY_RULES } from "./verify";
import { ENC_RULES } from "./enc";
import { DIGEST_RULES } from "./digest";
import { KEYGEN_RULES } from "./keygen";
import { CERT_RULES } from "./cert";
import { PKCS_RULES } from "./pkcs";
import { TLS_RULES } from "./tls";
import { PKI_RULES } from "./pki";
import { SMIME_RULES } from "./smime";
import { DIAG_RULES } from "./diag";

export const RULES: readonly LintRule<OpensslSpec>[] = [
  ...VERIFY_RULES,
  ...ENC_RULES,
  ...DIGEST_RULES,
  ...KEYGEN_RULES,
  ...CERT_RULES,
  ...PKCS_RULES,
  ...TLS_RULES,
  ...PKI_RULES,
  ...SMIME_RULES,
  ...DIAG_RULES,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
