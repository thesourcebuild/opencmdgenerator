import type { GroupmodSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: GroupmodSpec): string {
  const groupname = spec.groupname.trim();
  const target = groupname !== "" ? groupname : "SOME_GROUPNAME";

  const parts: string[] = [`Modify the ${target} group`];

  const gid = flagString(spec, "gid");
  if (gid) parts.push(`changing its GID to ${gid}`);

  const newName = flagString(spec, "newName");
  if (newName) parts.push(`renaming it to ${newName}`);

  if (flagBool(spec, "nonUnique")) parts.push("allowing that GID to duplicate another group's");

  return `${parts.join(", ")}.`;
}
