import type { PsSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: PsSpec): string {
  const pid = flagString(spec, "pid");
  const everyone = flagBool(spec, "everyone");
  const allWithTty = flagBool(spec, "allWithTty");
  const withoutTty = flagBool(spec, "withoutTty");

  const scope = pid
    ? `List the process(es) matching PID ${pid}`
    : everyone
      ? "List every process on the system"
      : allWithTty && withoutTty
        ? "List every process, with or without a controlling terminal"
        : allWithTty
          ? "List every process attached to a terminal, except session leaders"
          : withoutTty
            ? "List processes without a controlling terminal, in addition to the default terminal-attached set"
            : "List the processes running in the current terminal for the current user";

  const parts: string[] = [scope];

  if (flagBool(spec, "fullFormat")) {
    parts.push("using the full-format listing (UID, PPID, start time, and the full command line)");
  }
  if (flagBool(spec, "userFormat")) {
    parts.push("using the user-oriented format (%CPU, %MEM, and start time)");
  }

  const format = flagString(spec, "format");
  if (format) parts.push(`showing only the columns ${format}`);

  const sortBy = flagString(spec, "sortBy");
  if (sortBy) parts.push(`sorted by ${sortBy}`);

  return `${parts.join(", ")}.`;
}
