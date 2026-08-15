import type { TopSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: TopSpec): string {
  const parts: string[] = ["Display an interactively updating list of running processes, sorted by resource usage"];

  const iterations = flagString(spec, "iterations");
  if (flagBool(spec, "batchMode")) {
    parts.push(iterations ? `running in batch mode for ${iterations} update(s)` : "running in batch mode");
  } else if (iterations) {
    parts.push(`exiting after ${iterations} update(s)`);
  }

  const delay = flagString(spec, "delay");
  if (delay) parts.push(`refreshing every ${delay} second(s)`);

  const pid = flagString(spec, "pid");
  if (pid) parts.push(`limited to process ID(s) ${pid}`);

  const user = flagString(spec, "user");
  if (user) parts.push(`limited to processes owned by ${user}`);

  if (flagBool(spec, "threadMode")) parts.push("showing individual threads instead of per-process summaries");

  return `${parts.join(", ")}.`;
}
