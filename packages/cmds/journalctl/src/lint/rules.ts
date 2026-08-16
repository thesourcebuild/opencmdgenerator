import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { JournalctlSpec } from "../spec";
import { flagBool, flagNumber, flagString } from "../pure";

/**
 * Most journalctl queries are read-only; maintenance switches such as vacuum,
 * rotate, flush and FSS key setup are modeled now, so lint keeps the old query
 * mistakes and adds explicit warnings for operations that mutate journal state.
 */
const followWithBoundedRange: LintRule<JournalctlSpec> = {
  code: "JCT001",
  check(spec) {
    if (!flagBool(spec, "follow")) return [];
    const until = flagString(spec, "until");
    if (!until) return [];
    return [
      {
        code: "JCT001",
        level: "warning",
        message: "--follow with --until rarely does what's intended.",
        detail: "--follow waits forever for new entries, but --until caps the range to the past — the command will just wait and print nothing new.",
        flagIds: ["follow", "until"],
      },
    ];
  },
};

const sinceAfterUntil: LintRule<JournalctlSpec> = {
  code: "JCT002",
  check(spec) {
    const since = flagString(spec, "since");
    const until = flagString(spec, "until");
    if (!since || !until) return [];
    // Only a cheap, deliberately conservative check: compares them as exact
    // ISO-ish date strings, not a full date parser (journalctl accepts many
    // relative forms this app cannot reliably compare, e.g. "yesterday").
    const sinceDate = Date.parse(since);
    const untilDate = Date.parse(until);
    if (Number.isNaN(sinceDate) || Number.isNaN(untilDate) || sinceDate < untilDate) return [];
    return [
      {
        code: "JCT002",
        level: "warning",
        message: "--since is not before --until — this range matches nothing.",
        flagIds: ["since", "until"],
      },
    ];
  },
};

const maintenanceMutation: LintRule<JournalctlSpec> = {
  code: "JCT003",
  check(spec) {
    const risky = ["vacuumSize", "vacuumTime", "vacuumFiles", "rotate", "flush", "relinquishVar", "smartRelinquishVar", "updateCatalog", "setupKeys", "force"]
      .filter((id) => flagBool(spec, id) || flagString(spec, id) || flagNumber(spec, id) !== undefined);
    if (risky.length === 0) return [];
    return [
      {
        code: "JCT003",
        level: "warning",
        message: "Selected journalctl maintenance options can modify journal files or catalog/key state.",
        detail: `Review before running: ${risky.join(", ")}. Regular log-reading options are read-only; these are not.`,
        flagIds: risky,
      },
    ];
  },
};

export const RULES: readonly LintRule<JournalctlSpec>[] = [followWithBoundedRange, sinceAfterUntil, maintenanceMutation];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
