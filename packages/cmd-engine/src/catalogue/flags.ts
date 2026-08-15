export type FlagKind = "boolean" | "text" | "number" | "path" | "enum";

/** "none" = harmless. "caution" = can overwrite. "destructive" = can delete. */
export type DangerLevel = "none" | "caution" | "destructive";

export interface FlagEnumOption {
  value: string;
  label: string;
  /** Exact token this option renders to. Empty string renders nothing. */
  renders: string;
  summary?: string;
}

export interface FlagArgSpec {
  placeholder: string;
  /** Shown after the input, e.g. "KB/s". */
  unit?: string;
  min?: number;
  max?: number;
  /** Rendered as `--flag=value` (default) or `--flag value`. */
  separator?: "=" | " ";
}

/**
 * One entry in a command's flag catalogue. Generic over the group id type so
 * each `packages/cmds/<name>` package can declare its own group taxonomy
 * (rsync's is "core" | "attributes" | "deletion" | ...; another command's
 * will look nothing like that) while still using this same shape.
 */
export interface FlagDef<TGroup extends string = string> {
  /** Key in the command's flag-values record. Stable forever — renaming breaks saved profiles. */
  id: string;
  short?: string;
  long: string;
  group: TGroup;
  kind: FlagKind;
  /** Prefer the short form in generated output when both exist. */
  preferShort?: boolean;
  arg?: FlagArgSpec;
  options?: FlagEnumOption[];
  /** One line, shown next to the control. */
  summary: string;
  /** Paragraph, shown in the reference page and the tooltip. */
  detail: string;
  /** Flag ids this one already covers, so the form can grey them out. */
  implies?: string[];
  conflictsWith?: string[];
  requires?: string[];
  danger?: DangerLevel;
  /**
   * Minimum version of the target tool this flag exists in, as an opaque
   * ordinal — each command defines what the number means (rsync uses its
   * wire protocol version; another command might use a semver-ish integer).
   */
  sinceProtocol?: number;
  /**
   * Restricts a flag to one of several *variants* of the target, when a
   * version ordinal can't express the difference — e.g. cd's flags differ by
   * target platform (POSIX vs cmd.exe vs PowerShell), not by version. Opaque
   * tags a command defines the meaning of. Absent = available everywhere.
   */
  availableOn?: readonly string[];
  /** Stable position in the generated argv. Gaps left for future insertions. */
  order: number;
}

export interface FlagCatalogue<TGroup extends string = string> {
  readonly flags: readonly FlagDef<TGroup>[];
  getFlag(id: string): FlagDef<TGroup> | undefined;
  requireFlag(id: string): FlagDef<TGroup>;
  flagsInGroup(group: TGroup): FlagDef<TGroup>[];
  /** Flags in stable argv order. */
  flagsInArgvOrder(): FlagDef<TGroup>[];
}

/**
 * Build a catalogue instance bound to one command's flag list. A module-level
 * singleton (as a single-command package would use) does not work once many
 * command packages share this engine, so each one calls this factory with its
 * own `FLAGS` array instead.
 */
export function createFlagCatalogue<TGroup extends string = string>(
  flags: readonly FlagDef<TGroup>[],
): FlagCatalogue<TGroup> {
  const byId = new Map<string, FlagDef<TGroup>>(flags.map((f) => [f.id, f]));
  const sorted = [...flags].sort((a, b) => a.order - b.order);

  return {
    flags,
    getFlag: (id) => byId.get(id),
    requireFlag(id) {
      const f = byId.get(id);
      if (!f) throw new Error(`Unknown flag id: ${id}`);
      return f;
    },
    flagsInGroup: (group) => flags.filter((f) => f.group === group).sort((a, b) => a.order - b.order),
    flagsInArgvOrder: () => sorted,
  };
}

/** True when the flag does not exist in the version of the tool being targeted. */
export function isUnavailable(flag: FlagDef, targetVersion: number): boolean {
  return flag.sinceProtocol !== undefined && targetVersion < flag.sinceProtocol;
}

/** True when a flag restricted to specific variants (see `availableOn`) permits this one. */
export function isAvailableOn(flag: FlagDef, tag: string | undefined): boolean {
  return flag.availableOn === undefined || (tag !== undefined && flag.availableOn.includes(tag));
}

/** Human-facing label, preferring the short form when the flag has one. */
export function flagLabel(flag: FlagDef): string {
  return flag.preferShort && flag.short ? flag.short : flag.long;
}
