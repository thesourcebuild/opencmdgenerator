import type { RsyncSpec } from "../spec";
import { flagBool, flagEnum } from "../pure";
import { endpointLabel } from "../argv/endpoint";

const DELETE_LABEL: Record<string, string> = {
  plain: "deleting destination files that no longer exist in the source",
  during: "deleting missing files as it goes",
  before: "deleting missing files before transferring anything",
  after: "deleting missing files only after the transfer succeeds",
  delay: "collecting deletions and applying them at the end",
};

/**
 * A prose sentence describing what the command does. Users verify a sentence
 * far faster than they verify a row of flags, so this is the primary
 * confirmation surface — not a decoration.
 */
export function describeSpec(spec: RsyncSpec): string {
  const parts: string[] = [];

  const verb = flagBool(spec, "dryRun") ? "Preview copying" : "Copy";
  const what = spec.contentsOnly ? "the contents of" : "the directory";
  parts.push(`${verb} ${what} ${endpointLabel(spec.source)} to ${endpointLabel(spec.destination)}`);

  const transport =
    spec.source.kind === "ssh" || spec.destination.kind === "ssh"
      ? "over SSH"
      : spec.source.kind === "daemon" || spec.destination.kind === "daemon"
        ? "via an rsync daemon"
        : undefined;
  if (transport) parts.push(transport);

  const preserved: string[] = [];
  if (flagBool(spec, "archive")) preserved.push("permissions, timestamps and ownership");
  else {
    if (flagBool(spec, "perms")) preserved.push("permissions");
    if (flagBool(spec, "times")) preserved.push("timestamps");
    if (flagBool(spec, "owner") || flagBool(spec, "group")) preserved.push("ownership");
  }
  if (flagBool(spec, "acls")) preserved.push("ACLs");
  if (flagBool(spec, "xattrs")) preserved.push("extended attributes");
  if (flagBool(spec, "hardLinks")) preserved.push("hard links");
  if (preserved.length > 0) parts.push(`preserving ${joinList(preserved)}`);

  const mode = flagEnum(spec, "delete", ["plain", "during", "before", "after", "delay"]);
  if (mode) parts.push(DELETE_LABEL[mode] ?? "deleting missing files");

  const activeFilters = spec.filters.filter((f) => f.enabled && f.pattern.trim() !== "");
  if (activeFilters.length > 0) {
    parts.push(`applying ${activeFilters.length} filter rule${activeFilters.length === 1 ? "" : "s"}`);
  }

  const bwlimit = spec.flags.bwlimit;
  if (typeof bwlimit === "string" && bwlimit.trim() !== "") {
    parts.push(`limited to ${bwlimit.trim()}/s`);
  }

  if (flagBool(spec, "compress")) parts.push("compressing data in transit");
  if (flagBool(spec, "checksum")) parts.push("comparing files by checksum rather than size and time");

  return `${parts.join(", ")}.`;
}

function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}
