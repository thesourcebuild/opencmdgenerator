import type { FlagCatalogue, FlagDef } from "./flags";

/** Transitive closure of `implies` for one flag id. */
export function impliedBy(catalogue: FlagCatalogue, id: string, seen = new Set<string>()): Set<string> {
  const def = catalogue.getFlag(id);
  if (!def?.implies) return seen;
  for (const child of def.implies) {
    if (seen.has(child)) continue;
    seen.add(child);
    impliedBy(catalogue, child, seen);
  }
  return seen;
}

/**
 * Every flag id made redundant by the currently enabled flags.
 * The form uses this to grey out controls and explain why.
 */
export function redundantFlagIds(catalogue: FlagCatalogue, enabled: readonly string[]): Map<string, string> {
  const result = new Map<string, string>();
  for (const id of enabled) {
    for (const implied of impliedBy(catalogue, id)) {
      if (enabled.includes(implied)) result.set(implied, id);
    }
  }
  return result;
}

/** Pairs of enabled flags that the underlying tool will reject or that contradict each other. */
export function conflictingPairs(catalogue: FlagCatalogue, enabled: readonly string[]): [string, string][] {
  const set = new Set(enabled);
  const pairs: [string, string][] = [];
  for (const id of enabled) {
    const def = catalogue.getFlag(id);
    for (const other of def?.conflictsWith ?? []) {
      if (!set.has(other)) continue;
      const pair: [string, string] = id < other ? [id, other] : [other, id];
      if (!pairs.some(([a, b]) => a === pair[0] && b === pair[1])) pairs.push(pair);
    }
  }
  return pairs;
}

/** Flags that are enabled but whose prerequisites are not. */
export function unmetRequirements(catalogue: FlagCatalogue, enabled: readonly string[]): [string, string][] {
  const set = new Set(enabled);
  const missing: [string, string][] = [];
  for (const id of enabled) {
    for (const need of catalogue.getFlag(id)?.requires ?? []) {
      if (!set.has(need)) missing.push([id, need]);
    }
  }
  return missing;
}

/** Sanity check for a command's catalogue data, exercised by each command package's test suite. */
export function validateCatalogue(flags: readonly FlagDef[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const orders = new Map<number, string>();

  for (const f of flags) {
    if (ids.has(f.id)) problems.push(`duplicate flag id: ${f.id}`);
    ids.add(f.id);

    const clash = orders.get(f.order);
    if (clash) problems.push(`duplicate argv order ${f.order}: ${clash} and ${f.id}`);
    orders.set(f.order, f.id);

    if (f.kind === "enum" && (!f.options || f.options.length === 0)) {
      problems.push(`enum flag ${f.id} has no options`);
    }
    if (f.kind !== "enum" && f.options) {
      problems.push(`non-enum flag ${f.id} declares options`);
    }
    if ((f.kind === "text" || f.kind === "number" || f.kind === "path") && !f.arg) {
      problems.push(`value flag ${f.id} has no arg spec`);
    }
    if (f.preferShort && !f.short) {
      problems.push(`${f.id} prefers the short form but has none`);
    }
  }

  for (const f of flags) {
    for (const ref of [...(f.implies ?? []), ...(f.conflictsWith ?? []), ...(f.requires ?? [])]) {
      if (!ids.has(ref)) problems.push(`${f.id} references unknown flag ${ref}`);
    }
  }

  return problems;
}
