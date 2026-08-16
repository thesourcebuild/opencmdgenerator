import type { JournalctlSpec } from "../spec";
import { flagBool, flagNumber, flagString } from "../pure";

export function describeSpec(spec: JournalctlSpec): string {
  const unit = spec.unit.trim();
  const scope = unit !== "" ? `the ${unit} unit's journal` : "the system journal";
  const matches = (spec.matches ?? []).map((match) => match.trim()).filter(Boolean);

  const parts: string[] = [flagBool(spec, "follow") ? `Follow ${scope} live` : `Show ${scope}`];

  if (matches.length > 0) parts.push(`matching ${matches.join(", ")}`);

  const lines = flagNumber(spec, "lines");
  if (lines !== undefined) parts.push(`limited to the last ${lines} entries`);

  if (flagBool(spec, "boot")) parts.push("only from the current boot");
  const bootSelect = flagString(spec, "bootSelect");
  if (bootSelect) parts.push(`from boot ${bootSelect}`);
  if (flagBool(spec, "dmesg")) parts.push("kernel messages only");

  const priority = flagString(spec, "priority");
  if (priority) parts.push(`at or above priority ${priority}`);

  const since = flagString(spec, "since");
  if (since) parts.push(`since ${since}`);

  const until = flagString(spec, "until");
  if (until) parts.push(`until ${until}`);

  if (flagBool(spec, "reverse")) parts.push("newest entries first");
  const output = flagString(spec, "output");
  if (output) parts.push(`formatted as ${output}`);
  if (flagBool(spec, "noPager")) parts.push("without a pager");
  if (flagBool(spec, "diskUsage")) parts.push("showing journal disk usage instead of entries");
  if (flagString(spec, "vacuumSize") || flagString(spec, "vacuumTime") || flagNumber(spec, "vacuumFiles") !== undefined) {
    parts.push("vacuuming archived journal files");
  }

  return `${parts.join(", ")}.`;
}
