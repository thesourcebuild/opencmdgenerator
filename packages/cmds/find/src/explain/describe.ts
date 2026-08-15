import type { FindSpec } from "../spec";
import { flagBool, flagEnum, flagNumber, flagString } from "../pure";

const TYPE_LABEL: Record<"f" | "d" | "l", string> = {
  f: "regular files",
  d: "directories",
  l: "symbolic links",
};

export function describeSpec(spec: FindSpec): string {
  const paths = spec.paths.map((p) => p.trim()).filter((p) => p !== "");
  const target = paths.length > 0 ? paths.join(", ") : ".";

  const parts: string[] = [`Search ${target}`];

  const mindepth = flagNumber(spec, "mindepth");
  if (mindepth !== undefined) parts.push(`starting at depth ${mindepth}`);

  const maxdepth = flagNumber(spec, "maxdepth");
  if (maxdepth !== undefined) parts.push(`no deeper than depth ${maxdepth}`);

  const type = flagEnum(spec, "type", ["f", "d", "l"] as const);
  if (type) parts.push(`for ${TYPE_LABEL[type]}`);

  const name = flagString(spec, "name");
  if (name) parts.push(`named ${name}`);

  const mtime = flagNumber(spec, "mtime");
  if (mtime !== undefined) parts.push(`last modified exactly ${mtime} day${mtime === 1 ? "" : "s"} ago`);

  const size = flagString(spec, "size");
  if (size) parts.push(`sized ${size}`);

  if (flagBool(spec, "delete")) parts.push("deleting every match permanently");

  const exec = spec.exec.trim();
  if (exec !== "") parts.push(`running "${exec}" on every match`);

  return `${parts.join(", ")}.`;
}
