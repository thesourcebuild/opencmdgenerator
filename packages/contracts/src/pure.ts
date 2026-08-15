/**
 * Runtime helpers with NO zod import.
 *
 * This separation is load-bearing, not cosmetic. The UI needs `setFlag` but
 * never validates anything at runtime — validation happens in the Electron
 * main process and at trust boundaries. When these helpers lived alongside
 * schema definitions, importing `setFlag` pulled the schema module into the
 * module graph, which constructs every zod schema at module evaluation time,
 * which put all of zod in the browser bundle for no benefit.
 *
 * Rule for this file: type-only imports (erased at compile time) are fine;
 * a value import from a schema module is not.
 */
import type { FlagValue, FlagValues } from "./flags";

// ── flag accessors ──────────────────────────────────────────────────────────
// `flags` is an open record keyed by a command's own catalogue id, so all
// reads/writes go through these instead of naming fields directly.

export function flagBool(flags: FlagValues, id: string): boolean {
  return flags[id] === true;
}

export function flagString(flags: FlagValues, id: string): string | undefined {
  const v = flags[id];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function flagNumber(flags: FlagValues, id: string): number | undefined {
  const v = flags[id];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

export function flagList(flags: FlagValues, id: string): string[] {
  const v = flags[id];
  return Array.isArray(v) ? v : [];
}

export function flagEnum<T extends string>(
  flags: FlagValues,
  id: string,
  allowed: readonly T[],
): T | undefined {
  const v = flags[id];
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

export function setFlag(flags: FlagValues, id: string, value: FlagValue | undefined): FlagValues {
  const next = { ...flags };
  if (value === undefined || value === false || value === "") delete next[id];
  else next[id] = value;
  return next;
}

export function setFlags(
  flags: FlagValues,
  patch: Record<string, FlagValue | undefined>,
): FlagValues {
  return Object.entries(patch).reduce((f, [id, v]) => setFlag(f, id, v), flags);
}

/** Builds a fresh `FlagValues` from `patch` alone, discarding whatever flags were already set. */
export function replaceFlags(patch: Record<string, FlagValue | undefined>): FlagValues {
  return setFlags({}, patch);
}
