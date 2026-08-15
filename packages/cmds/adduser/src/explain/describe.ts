import type { AdduserSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: AdduserSpec): string {
  const username = spec.username.trim();
  const target = username !== "" ? username : "SOME_USERNAME";
  const isSystem = flagBool(spec, "system");

  const parts: string[] = [
    isSystem ? `Create a new system account named ${target}` : `Create a new user account named ${target}`,
  ];

  if (flagBool(spec, "disabledLogin")) parts.push("with its password login disabled");
  if (flagBool(spec, "disabledPassword")) parts.push("leaving it without a usable password");

  const shell = flagString(spec, "shell");
  if (shell) parts.push(`with ${shell} as its login shell`);

  const home = flagString(spec, "home");
  if (home) parts.push(`using ${home} as its home directory`);

  const ingroup = flagString(spec, "ingroup");
  if (ingroup) parts.push(`in the ${ingroup} group`);

  const gecos = flagString(spec, "gecos");
  if (gecos) parts.push(`with GECOS info "${gecos}"`);

  const uid = flagString(spec, "uid");
  if (uid) parts.push(`using UID ${uid}`);

  if (flagBool(spec, "forceBadname")) parts.push("skipping username validation");

  return `${parts.join(", ")}.`;
}
