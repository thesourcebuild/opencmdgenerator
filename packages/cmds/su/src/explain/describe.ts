import type { SuSpec } from "../spec";
import { effectiveTarget, flagBool, flagString } from "../pure";

export function describeSpec(spec: SuSpec): string {
  const target = effectiveTarget(spec);

  const parts: string[] = [`Switch to the ${target} user`];

  if (flagBool(spec, "login")) parts.push("starting a full login shell");

  const command = flagString(spec, "command");
  if (command) parts.push(`running "${command}" instead of an interactive shell`);

  const shell = flagString(spec, "shell");
  if (shell) parts.push(`using ${shell} instead of its configured login shell`);

  return `${parts.join(", ")}.`;
}
