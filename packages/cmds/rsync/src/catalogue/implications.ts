import {
  conflictingPairs as conflictingPairsGeneric,
  impliedBy as impliedByGeneric,
  redundantFlagIds as redundantFlagIdsGeneric,
  unmetRequirements as unmetRequirementsGeneric,
  validateCatalogue as validateCatalogueGeneric,
} from "@cmdgen/engine";
import { CATALOGUE, FLAGS } from "./flags";

/** -a expands to -rlptgoD. Kept here so lint rules and the UI agree. */
export const ARCHIVE_EXPANSION = [
  "recursive",
  "links",
  "perms",
  "times",
  "group",
  "owner",
  "devices",
] as const;

/** Transitive closure of `implies` for one flag id. */
export function impliedBy(id: string, seen = new Set<string>()): Set<string> {
  return impliedByGeneric(CATALOGUE, id, seen);
}

/**
 * Every flag id made redundant by the currently enabled flags.
 * The form uses this to grey out controls and explain why.
 */
export function redundantFlagIds(enabled: readonly string[]): Map<string, string> {
  return redundantFlagIdsGeneric(CATALOGUE, enabled);
}

/** Pairs of enabled flags that rsync will reject or that contradict each other. */
export function conflictingPairs(enabled: readonly string[]): [string, string][] {
  return conflictingPairsGeneric(CATALOGUE, enabled);
}

/** Flags that are enabled but whose prerequisites are not. */
export function unmetRequirements(enabled: readonly string[]): [string, string][] {
  return unmetRequirementsGeneric(CATALOGUE, enabled);
}

/** Sanity check for the catalogue itself, exercised by the test suite. */
export function validateCatalogue(): string[] {
  return validateCatalogueGeneric(FLAGS);
}
