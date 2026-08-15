import type { UsermodSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: UsermodSpec): string {
  const username = spec.username.trim();
  const target = username !== "" ? username : "SOME_USERNAME";

  const parts: string[] = [`Modify the ${target} account`];

  const login = flagString(spec, "login");
  if (login) parts.push(`renaming its login to ${login}`);

  const home = flagString(spec, "home");
  if (home) {
    parts.push(
      flagBool(spec, "moveHome")
        ? `moving its home directory to ${home}`
        : `changing its recorded home directory to ${home} without moving any files`,
    );
  }

  const gid = flagString(spec, "gid");
  if (gid) parts.push(`changing its primary group to ${gid}`);

  const groups = flagString(spec, "groups");
  if (groups) {
    parts.push(
      flagBool(spec, "append")
        ? `adding it to the ${groups} group(s)`
        : `replacing its supplementary groups with ${groups}`,
    );
  }

  const shell = flagString(spec, "shell");
  if (shell) parts.push(`changing its login shell to ${shell}`);

  if (flagBool(spec, "lock")) parts.push("locking the account");
  if (flagBool(spec, "unlock")) parts.push("unlocking the account");

  const expireDate = flagString(spec, "expireDate");
  if (expireDate) parts.push(`set to expire on ${expireDate}`);

  return `${parts.join(", ")}.`;
}
