/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/ssh/pure` and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { ChmodSpec } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "chmod" as const;

// ── flag accessors ──────────────────────────────────────────────────────────

export function flagBool(spec: ChmodSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: ChmodSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagEnum<T extends string>(spec: ChmodSpec, id: string, allowed: readonly T[]): T | undefined {
  return generic.flagEnum(spec.flags, id, allowed);
}

export function setFlag(spec: ChmodSpec, id: string, value: FlagValue | undefined): ChmodSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: ChmodSpec, patch: Record<string, FlagValue | undefined>): ChmodSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

// ── octal mode ⇄ string ──────────────────────────────────────────────────────

export interface OctalBits {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface OctalMode {
  owner: OctalBits;
  group: OctalBits;
  other: OctalBits;
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
}

export function emptyOctalMode(): OctalMode {
  return {
    owner: { read: false, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    other: { read: false, write: false, execute: false },
    setuid: false,
    setgid: false,
    sticky: false,
  };
}

function bitsFromDigit(digit: number): OctalBits {
  return { read: (digit & 4) !== 0, write: (digit & 2) !== 0, execute: (digit & 1) !== 0 };
}

function digitFromBits(bits: OctalBits): number {
  return (bits.read ? 4 : 0) | (bits.write ? 2 : 0) | (bits.execute ? 1 : 0);
}

/** Only succeeds when `mode` is exactly 3 or 4 octal digits — a symbolic expression (or anything else) yields `undefined`, not a guess. */
export function parseOctalMode(mode: string): OctalMode | undefined {
  const trimmed = mode.trim();
  if (!/^[0-7]{3,4}$/.test(trimmed)) return undefined;

  const digits = trimmed.split("").map(Number);
  const [special, owner, group, other] = digits.length === 4 ? digits : [0, ...digits];

  return {
    owner: bitsFromDigit(owner!),
    group: bitsFromDigit(group!),
    other: bitsFromDigit(other!),
    setuid: (special! & 4) !== 0,
    setgid: (special! & 2) !== 0,
    sticky: (special! & 1) !== 0,
  };
}

export function formatOctalMode(o: OctalMode): string {
  const special = (o.setuid ? 4 : 0) | (o.setgid ? 2 : 0) | (o.sticky ? 1 : 0);
  const main = `${digitFromBits(o.owner)}${digitFromBits(o.group)}${digitFromBits(o.other)}`;
  return special === 0 ? main : `${special}${main}`;
}
