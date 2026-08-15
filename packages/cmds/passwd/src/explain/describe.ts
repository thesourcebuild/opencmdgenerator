import type { PasswdSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: PasswdSpec): string {
  const username = spec.username.trim();
  const possessive = username !== "" ? `${username}'s` : "your own";

  const actions: string[] = [];
  if (flagBool(spec, "lock")) actions.push(`lock ${possessive} account`);
  if (flagBool(spec, "unlock")) actions.push(`unlock ${possessive} account`);
  if (flagBool(spec, "deletePassword")) actions.push(`delete ${possessive} password, leaving the account passwordless`);
  if (flagBool(spec, "expire")) actions.push(`force ${possessive} password to expire immediately`);
  if (flagBool(spec, "status")) actions.push(`show ${possessive} password status`);

  let sentence: string;
  if (actions.length === 0) {
    sentence = `change ${possessive} password`;
  } else if (actions.length === 1) {
    sentence = actions[0]!;
  } else {
    sentence = `${actions.slice(0, -1).join(", ")}, and ${actions[actions.length - 1]}`;
  }

  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
}
