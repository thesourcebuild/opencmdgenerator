import type { AtSpec } from "../spec";

export function describeSpec(spec: AtSpec): string {
  switch (spec.action) {
    case "schedule": {
      const time = spec.time.trim() || "SOME_TIME";
      const command = spec.command.trim() || "SOME_COMMAND";
      return `Schedule "${command}" to run once at ${time}.`;
    }
    case "list":
      return "List every job currently scheduled with at.";
    case "remove": {
      const jobId = spec.jobId.trim() || "SOME_JOB_ID";
      return `Cancel scheduled job ${jobId}.`;
    }
  }
}
