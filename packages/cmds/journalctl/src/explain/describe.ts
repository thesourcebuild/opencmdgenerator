import type { JournalctlSpec } from "../spec";
import { flagBool, flagNumber, flagString } from "../pure";

export function describeSpec(spec: JournalctlSpec): string {
  const unit = spec.unit.trim();
  const scope = unit !== "" ? `the ${unit} unit's journal` : "the system journal";

  const parts: string[] = [flagBool(spec, "follow") ? `Follow ${scope} live` : `Show ${scope}`];

  const lines = flagNumber(spec, "lines");
  if (lines !== undefined) parts.push(`limited to the last ${lines} entries`);

  if (flagBool(spec, "boot")) parts.push("only from the current boot");
  if (flagBool(spec, "dmesg")) parts.push("kernel messages only");

  const priority = flagString(spec, "priority");
  if (priority) parts.push(`at or above priority ${priority}`);

  const since = flagString(spec, "since");
  if (since) parts.push(`since ${since}`);

  const until = flagString(spec, "until");
  if (until) parts.push(`until ${until}`);

  if (flagBool(spec, "reverse")) parts.push("newest entries first");

  return `${parts.join(", ")}.`;
}
