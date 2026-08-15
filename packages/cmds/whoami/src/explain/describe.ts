import type { WhoamiSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: WhoamiSpec): string {
  if (flagBool(spec, "allInfo")) return "Print the current user's name, group membership, and privileges.";
  if (flagBool(spec, "groups")) return "Print the current user's group membership.";
  if (flagBool(spec, "privileges")) return "Print the current user's security privileges.";
  return "Print the current user's name.";
}
