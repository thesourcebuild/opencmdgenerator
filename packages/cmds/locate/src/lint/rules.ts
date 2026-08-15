import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LocateSpec } from "../spec";

const noPattern: LintRule<LocateSpec> = {
  code: "LOC001",
  check(spec) {
    if (spec.pattern.trim() !== "") return [];
    return [{ code: "LOC001", level: "error", message: "No pattern to search for.", field: "pattern" }];
  },
};

/** A real, common gotcha: locate only ever searches its own prebuilt database, not the live filesystem. Always worth surfacing, not conditioned on anything else. */
const staleDatabaseCaveat: LintRule<LocateSpec> = {
  code: "LOC002",
  check() {
    return [
      {
        code: "LOC002",
        level: "info",
        message: "locate searches a prebuilt database, not the live filesystem.",
        detail:
          "That database is normally refreshed by updatedb, often via a daily cron job. A file created (or deleted) since the last refresh won't show up correctly here until updatedb runs again.",
      },
    ];
  },
};

export const RULES: readonly LintRule<LocateSpec>[] = [noPattern, staleDatabaseCaveat];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
