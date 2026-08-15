import type { GroupaddSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: GroupaddSpec): string {
  const groupname = spec.groupname.trim();
  const target = groupname !== "" ? groupname : "SOME_GROUPNAME";

  const parts: string[] = [`Create a new group named ${target}`];

  if (flagBool(spec, "system")) parts.push("as a system group");

  const gid = flagString(spec, "gid");
  if (gid) parts.push(`using GID ${gid}`);

  if (flagBool(spec, "force")) parts.push("succeeding without error if it already exists");

  const key = flagString(spec, "key");
  if (key) parts.push(`overriding the login.defs setting ${key} for this invocation`);

  return `${parts.join(", ")}.`;
}
