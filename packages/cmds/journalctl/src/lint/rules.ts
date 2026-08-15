import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { JournalctlSpec } from "../spec";
import { flagBool, flagString } from "../pure";

/**
 * journalctl is read-only, so there is no destructive/caution footgun here —
 * only genuine mistakes worth a nudge, matching the "no danger" scope this
 * command was given.
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

export const RULES: readonly LintRule<JournalctlSpec>[] = [followWithBoundedRange, sinceAfterUntil];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
