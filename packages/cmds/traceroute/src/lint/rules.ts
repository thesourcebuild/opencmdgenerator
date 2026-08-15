import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { TracerouteSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const emptyHost: LintRule<TracerouteSpec> = {
  code: "TRACEROUTE001",
  check(spec) {
    if (spec.host.trim() !== "") return [];
    return [
      {
        code: "TRACEROUTE001",
        level: "error",
        message: "traceroute needs a host to trace a path to.",
        field: "host",
      },
    ];
  },
};

const contradictoryFlags: LintRule<TracerouteSpec> = {
  code: "TRACEROUTE002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<TracerouteSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "TRACEROUTE002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<TracerouteSpec>[] = [emptyHost, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
