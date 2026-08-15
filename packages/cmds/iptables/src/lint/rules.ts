import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { IptablesSpec } from "../spec";

/**
 * Real iptables requires an explicit protocol (-p tcp or -p udp) before
 * --dport has any effect at all — without it, the port match is silently
 * ignored and the rule matches every protocol regardless of what the user
 * typed into `port`. A warning, not an error, since `buildArgv` still
 * renders --dport in this case (see the note there) rather than dropping it
 * — this rule exists purely to flag the likely mistake. No mechanical
 * `fix`: picking tcp vs. udp is a real decision this app can't make for the
 * user, same reasoning as `@cmdgen/dd`'s DD003.
 */
const dportWithoutProtocol: LintRule<IptablesSpec> = {
  code: "IPTABLES001",
  check(spec) {
    if (spec.port.trim() === "" || spec.protocol !== "any") return [];
    const diagnostic: Diagnostic<IptablesSpec> = {
      code: "IPTABLES001",
      level: "warning",
      message: "A destination port needs an explicit protocol (tcp or udp) to have any effect — --dport is ignored without -p.",
      field: "port",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<IptablesSpec>[] = [dportWithoutProtocol];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
