import type { FlagValue, FlagValues } from "@cmdgen/contracts/flags";
import { isAvailableOn, isUnavailable, type FlagCatalogue, type FlagDef } from "../catalogue/flags";

export type ArgRole = "flag" | "value" | "path" | "pattern" | "rsh" | "host";

export interface Arg {
  text: string;
  role: ArgRole;
  /** Which catalogue entry produced this token, for highlighting and tooltips. */
  flagId?: string;
  /** True when the token must never be shell-quoted away from its flag. */
  attached?: boolean;
}

export interface Argv {
  binary: string;
  args: Arg[];
}

const EXTRA_ARG_SHAPE = /^--?[A-Za-z0-9][A-Za-z0-9-]*(=.*)?$/;

/** True when a passthrough argument is a well-formed `-x` / `--long` / `--long=value` token. */
export function isWellFormedFlagShape(raw: string): boolean {
  const arg = raw.trim();
  return arg !== "" && EXTRA_ARG_SHAPE.test(arg);
}

/**
 * Build the extra-args validator for one command. `extraArgs` is user-typed
 * passthrough, so it is validated rather than trusted; `denylist` is that
 * command's own security policy (e.g. rsync blocks `-e`/`--rsync-path`
 * because they would let a generated command execute an arbitrary program).
 */
export function makeExtraArgValidator(denylist: ReadonlySet<string>): (raw: string) => boolean {
  return function isAllowedExtraArg(raw: string): boolean {
    const arg = raw.trim();
    if (!isWellFormedFlagShape(arg)) return false;
    const name = arg.split("=", 1)[0] ?? arg;
    return !denylist.has(name);
  };
}

export function rejectedExtraArgs(
  extraArgs: readonly string[],
  isAllowed: (raw: string) => boolean,
): string[] {
  return extraArgs.filter((a) => a.trim() !== "" && !isAllowed(a));
}

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(flags: FlagValues, catalogue: FlagCatalogue): string[] {
  return catalogue.flagsInArgvOrder()
    .filter((def) => isFlagActive(flags, def))
    .map((def) => def.id);
}

/**
 * Flag ids that are switched on but do NOT exist in the variant being targeted
 * (see `FlagDef.availableOn`), so `buildFlagArgs` silently omits them.
 *
 * Silent omission is the right rendering behavior — a generated command must
 * never contain a flag the target tool would reject — but it is the wrong
 * *reporting* behavior: the user set something and the command does not
 * reflect it. Commands whose variants differ meaningfully (tar's GNU vs bsd
 * flag sets, ls's ls vs Get-ChildItem) surface this as a diagnostic instead of
 * letting the setting quietly evaporate.
 */
export function unavailableOnTagFlagIds(
  flags: FlagValues,
  catalogue: FlagCatalogue,
  tag: string | undefined,
): string[] {
  return catalogue.flagsInArgvOrder()
    .filter((def) => isFlagActive(flags, def) && !isAvailableOn(def, tag))
    .map((def) => def.id);
}

export function isFlagActive(flags: FlagValues, def: FlagDef): boolean {
  const value = flags[def.id];
  if (value === undefined) return false;
  switch (def.kind) {
    case "boolean":
      return value === true;
    case "enum":
      return typeof value === "string" && value !== "" && value !== "none";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "text":
    case "path":
      return typeof value === "string" && value.trim() !== "";
  }
}

function renderFlag(
  def: FlagDef,
  value: FlagValue,
  transformValue: ((def: FlagDef, raw: string) => string) | undefined,
): Arg[] {
  switch (def.kind) {
    case "boolean": {
      const token = def.preferShort && def.short ? def.short : def.long;
      // A few long forms expand to more than one option, e.g. -D.
      return token
        .split(/\s+/)
        .filter(Boolean)
        .map((text) => ({ text, role: "flag" as const, flagId: def.id }));
    }
    case "enum": {
      const option = def.options?.find((o) => o.value === value);
      if (!option || option.renders === "") return [];
      // Same reasoning as the boolean case above: an option can render more
      // than one token (e.g. ssh's `-o StrictHostKeyChecking=accept-new`).
      return option.renders
        .split(/\s+/)
        .filter(Boolean)
        .map((text) => ({ text, role: "flag" as const, flagId: def.id }));
    }
    case "number":
    case "text":
    case "path": {
      const raw = def.kind === "number" ? String(value) : String(value).trim();
      const text = transformValue ? transformValue(def, raw) : raw;
      const separator = def.arg?.separator ?? "=";
      if (separator === "=") {
        return [
          {
            text: `${def.long}=${text}`,
            role: "flag",
            flagId: def.id,
            attached: true,
          },
        ];
      }
      return [
        { text: def.long, role: "flag", flagId: def.id },
        { text, role: def.kind === "path" ? "path" : "value", flagId: def.id },
      ];
    }
  }
}

export interface BuildFlagArgsOptions {
  /** Omit flags unavailable at this version of the target tool. */
  targetVersion?: number;
  /** Omit flags restricted to a different variant of the target (see `FlagDef.availableOn`). */
  tag?: string;
  /**
   * Post-process a flag's raw value before rendering — e.g. rsync translates
   * a "path" kind flag's value through its Windows drive-letter rules here.
   * Generic flags (booleans, plain text/number) never need this.
   */
  transformValue?: (def: FlagDef, raw: string) => string;
}

/**
 * Turn a flag-values record into ordered, role-tagged tokens. This is the
 * shared core of every command's `buildArgv` — each command package wraps it
 * with its own additional steps (remote-shell composition, filter rules,
 * passthrough args, source/destination paths, ...).
 */
export function buildFlagArgs(
  flags: FlagValues,
  catalogue: FlagCatalogue,
  options: BuildFlagArgsOptions = {},
): Arg[] {
  const args: Arg[] = [];

  for (const def of catalogue.flagsInArgvOrder()) {
    if (!isFlagActive(flags, def)) continue;
    if (options.targetVersion !== undefined && isUnavailable(def, options.targetVersion)) continue;
    if (!isAvailableOn(def, options.tag)) continue;
    const value = flags[def.id];
    if (value === undefined) continue;
    args.push(...renderFlag(def, value, options.transformValue));
  }

  return args;
}
