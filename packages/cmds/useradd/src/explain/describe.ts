import type { UseraddSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: UseraddSpec): string {
  const username = spec.username.trim();
  const target = username !== "" ? username : "SOME_USERNAME";

  const parts: string[] = [`Create a new user account named ${target}`];

  if (flagBool(spec, "createHome")) parts.push("creating its home directory if it doesn't already exist");

  const homeDir = flagString(spec, "homeDir");
  if (homeDir) parts.push(`using ${homeDir} as its home directory`);

  const shell = flagString(spec, "shell");
  if (shell) parts.push(`with ${shell} as its login shell`);

  const primaryGroup = flagString(spec, "primaryGroup");
  if (primaryGroup) parts.push(`with ${primaryGroup} as its primary group`);

  const secondaryGroups = flagString(spec, "secondaryGroups");
  if (secondaryGroups) parts.push(`adding it to the ${secondaryGroups} group(s)`);

  const uid = flagString(spec, "uid");
  if (uid) parts.push(`using UID ${uid}`);

  const comment = flagString(spec, "comment");
  if (comment) parts.push(`with comment "${comment}"`);

  const expireDate = flagString(spec, "expireDate");
  if (expireDate) parts.push(`set to expire on ${expireDate}`);

  return `${parts.join(", ")}.`;
}
