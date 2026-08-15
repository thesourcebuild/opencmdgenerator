import type { IptablesAction, IptablesJump, IptablesSpec } from "../spec";

const ACTION_PREFIX: Record<IptablesAction, string> = {
  append: "Append a rule to",
  insert: "Insert a rule at the top of",
  delete: "Delete a rule from",
};

const JUMP_VERB: Record<IptablesJump, string> = {
  ACCEPT: "allowing",
  DROP: "dropping",
  REJECT: "rejecting",
};

/**
 * One sentence describing the rule. delete always uses "matching" for the
 * verb, regardless of jump target, since a delete doesn't actually allow,
 * drop, or reject anything itself — it removes a rule that would have —
 * append/insert use the jump-target verb instead. The protocol/port/source
 * clauses are each omitted when the corresponding field is empty; chain and
 * jump target are always mentioned.
 */
export function describeSpec(spec: IptablesSpec): string {
  const port = spec.port.trim();
  const source = spec.source.trim();

  let traffic = spec.protocol !== "any" ? `${spec.protocol} traffic` : "traffic";
  if (port !== "") traffic += ` on port ${port}`;
  if (source !== "") traffic += ` from ${source}`;

  const verb = spec.action === "delete" ? "matching" : JUMP_VERB[spec.jumpTarget];

  return `${ACTION_PREFIX[spec.action]} ${spec.chain} ${verb} ${traffic} (jump: ${spec.jumpTarget}).`;
}
