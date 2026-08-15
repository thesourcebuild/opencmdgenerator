import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { AtSpec } from "../spec";

const noTime: LintRule<AtSpec> = {
  code: "AT001",
  check(spec) {
    if (spec.action !== "schedule" || spec.time.trim() !== "") return [];
    return [
      {
        code: "AT001",
        level: "error",
        message: "No time given to schedule this job at.",
        field: "time",
      },
    ];
  },
};

const noCommand: LintRule<AtSpec> = {
  code: "AT002",
  check(spec) {
    if (spec.action !== "schedule" || spec.command.trim() !== "") return [];
    return [
      {
        code: "AT002",
        level: "error",
        message: "No command given to schedule.",
        detail: "Without one, the generated command would pipe an empty job into at, scheduling nothing useful.",
        field: "command",
      },
    ];
  },
};

const noJobId: LintRule<AtSpec> = {
  code: "AT003",
  check(spec) {
    if (spec.action !== "remove" || spec.jobId.trim() !== "") return [];
    return [
      {
        code: "AT003",
        level: "error",
        message: "No job id given to cancel.",
        detail: "atrm needs the job number shown by atq (or by at's own confirmation when the job was scheduled).",
        field: "jobId",
      },
    ];
  },
};

/**
 * atrm's real footgun: it cancels a scheduled job with zero confirmation
 * prompt. Unlike `@cmdgen/crontab`'s remove action (which wipes the entire
 * crontab outright, unrecoverable without a backup), this is recoverable —
 * the same job can simply be rescheduled — so it's a caution-level warning,
 * not destructive.
 */
const removeCaution: LintRule<AtSpec> = {
  code: "AT004",
  check(spec) {
    if (spec.action !== "remove") return [];
    const jobId = spec.jobId.trim() || "this job";
    return [
      {
        code: "AT004",
        level: "warning",
        message: `Cancels scheduled job ${jobId} with no confirmation prompt.`,
        detail: "Recoverable — reschedule the same job with at if this was cancelled by mistake — but there's no undo command for atrm itself.",
        field: "jobId",
      },
    ];
  },
};

export const RULES: readonly LintRule<AtSpec>[] = [noTime, noCommand, noJobId, removeCaution];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
