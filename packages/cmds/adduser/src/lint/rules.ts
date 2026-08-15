import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { AdduserSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

const noUsername: LintRule<AdduserSpec> = {
  code: "ADD001",
  check(spec) {
    if (spec.username.trim() !== "") return [];
    return [
      {
        code: "ADD001",
        level: "error",
        message: "adduser needs a username for the new account.",
        field: "username",
      },
    ];
  },
};

/**
 * --disabled-login and --disabled-password both control the account's
 * password field in /etc/shadow, just to different values — setting both is
 * legal (adduser doesn't reject it) but only one actually takes effect.
 */
const conflictingDisabledFlags: LintRule<AdduserSpec> = {
  code: "ADD002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<AdduserSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "ADD002",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} both set the account's password field — only one takes effect.`,
        detail: "Pick whichever one matches the account's intended login story: --disabled-login for su/sudo-only access, --disabled-password for SSH-key-only access.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const systemAccountAdvisory: LintRule<AdduserSpec> = {
  code: "ADD003",
  check(spec) {
    if (!flagBool(spec, "system")) return [];
    return [
      {
        code: "ADD003",
        level: "info",
        message: "--system accounts get no home directory or login shell by default.",
        detail: "Fine for service accounts as-is; add --home and --shell explicitly if this account needs to log in normally.",
        flagIds: ["system"],
      },
    ];
  },
};

const forceBadnameAdvisory: LintRule<AdduserSpec> = {
  code: "ADD004",
  check(spec) {
    if (!flagBool(spec, "forceBadname")) return [];
    return [
      {
        code: "ADD004",
        level: "info",
        message: "--force-badname skips adduser's username validation.",
        detail: "Other tools that assume a standard POSIX username (lowercase, no leading digit, limited length) may misbehave with an unusual one.",
        flagIds: ["forceBadname"],
      },
    ];
  },
};

export const RULES: readonly LintRule<AdduserSpec>[] = [
  noUsername,
  conflictingDisabledFlags,
  systemAccountAdvisory,
  forceBadnameAdvisory,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
