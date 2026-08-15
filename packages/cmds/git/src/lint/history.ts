import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { flagBool, flagString } from "../pure";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** Real git requires exactly one path with --follow — it can only track renames for a single file. */
const logFollowNeedsOnePath: LintRule<GitSpec> = {
  code: "GIT031",
  check(spec) {
    if (spec.subcommand !== "log" || !flagBool(spec, "follow")) return [];
    if (nonEmpty(spec.paths).length === 1) return [];
    return [
      {
        code: "GIT031",
        level: "warning",
        message: "--follow only works with exactly one path.",
        detail: "Real git rejects --follow with zero or multiple paths — it can only track renames for a single followed file.",
        flagIds: ["follow"],
        field: "paths",
      },
    ];
  },
};

/** --short/--long/--porcelain form a mutually exclusive TRIO — any two together is a real git error, not just a pair. */
const statusModeExclusivity: LintRule<GitSpec> = {
  code: "GIT032",
  check(spec) {
    if (spec.subcommand !== "status") return [];
    const modesOn = [
      flagBool(spec, "short"),
      flagBool(spec, "long"),
      flagString(spec, "porcelain") !== undefined,
    ].filter(Boolean).length;
    if (modesOn < 2) return [];
    return [
      {
        code: "GIT032",
        level: "error",
        message: "--short, --long, and --porcelain are mutually exclusive — real git rejects combining any two.",
        flagIds: ["short", "long", "porcelain"],
      },
    ];
  },
};

export const HISTORY_RULES: readonly LintRule<GitSpec>[] = [logFollowNeedsOnePath, statusModeExclusivity];
