import type { CrontabSpec } from "../spec";

export function describeSpec(spec: CrontabSpec): string {
  const user = spec.user.trim();
  const who = user !== "" ? `${user}'s` : "the current user's";

  switch (spec.action) {
    case "list":
      return `List ${who} crontab.`;
    case "edit":
      return `Open ${who} crontab in an editor.`;
    case "remove":
      return `Remove ${who} entire crontab, wiping every scheduled job.`;
  }
}
