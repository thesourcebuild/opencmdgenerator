import type { Arg, Argv } from "@cmdgen/engine";
import type { CrontabSpec } from "../spec";

export type { Arg, Argv };

const ACTION_FLAG: Record<CrontabSpec["action"], string> = {
  list: "-l",
  edit: "-e",
  remove: "-r",
};

/**
 * Build the crontab invocation. Real synopsis is `crontab [-u user]
 * -l|-e|-r` — `-u user` (when given) comes first, then the action flag,
 * matching the documented BSD/Linux crontab synopsis order. Neither is a
 * catalogue flag (see `catalogue/flags.ts` — `FLAGS` is empty); both are
 * pushed directly, the same pattern as `@cmdgen/service`'s bare
 * name/action tokens.
 */
export function buildArgv(spec: CrontabSpec): Argv {
  const args: Arg[] = [];

  const user = spec.user.trim();
  if (user !== "") {
    args.push({ text: "-u", role: "flag" });
    args.push({ text: user, role: "value" });
  }

  args.push({ text: ACTION_FLAG[spec.action], role: "flag" });

  return { binary: "crontab", args };
}
