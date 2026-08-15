import type { ZodType } from "zod";
import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FlagCatalogue } from "./catalogue/flags";
import type { FlagGroupMeta } from "./catalogue/groups";
import type { Argv } from "./argv";

export interface Preset<TSpec> {
  id: string;
  label: string;
  summary: string;
  /**
   * Groups this preset under an `<optgroup>` in the Presets dropdown. Presets
   * with no `category` render as a flat list at the top, unchanged from
   * before this field existed — every command's existing presets keep
   * working with no changes needed. Only worth setting once a command's
   * preset count grows large enough that a flat list stops being scannable
   * (e.g. curl's httpbingo.org endpoint presets).
   */
  category?: string;
  /** Applied on top of the current spec, so values the user already entered survive. */
  apply: (spec: TSpec) => TSpec;
  /**
   * Omit when the preset makes sense for every spec. Define it when the preset
   * has no correct effect for some specs (e.g. cd's "previous directory" has
   * no equivalent outside a POSIX shell) — the UI disables it rather than
   * letting a click silently do nothing.
   */
  isApplicable?: (spec: TSpec) => boolean;
  /**
   * Optional deeper reference content for the Example section — a
   * self-contained teaching illustration, independent of whatever the user
   * has actually typed. All are optional and shown together only when
   * present; most presets need nothing beyond `summary`.
   */
  /** The flag's own short syntax pattern, e.g. "-L local_port:remote_host:remote_port" — shown on its own line, not folded into `summary`'s prose. */
  mnemonic?: string;
  /** A canonical, complete command illustrating the preset — not derived from the live spec. */
  commandExample?: string;
  /** One paragraph: what actually happens on the wire once this is applied. */
  howItWorks?: string;
  /** One paragraph: the scenario this preset is really for. */
  useCase?: string;
}

/** Real operating systems the generated command can actually target. Excludes the browser/Electron host itself — that's a runtime, not a target platform. */
export type SupportedPlatform = "darwin" | "win32" | "linux";

/**
 * Shells this command's generated output can actually be run from — not
 * necessarily shells its own spec renders *different syntax* for. ssh/scp/tar
 * are plain argv-based .exe files (Win32-OpenSSH, bsdtar), so they run
 * identically whether cmd.exe, PowerShell, or a POSIX shell invoked them —
 * that's still real cmd support, even though this app only ever renders their
 * quoting as posix/powershell. cd is the one command with genuinely different
 * *syntax* per shell (its own `CdPlatform`, not this type).
 */
export type SupportedShell = "posix" | "cmd" | "powershell";

/**
 * Cheap metadata for a command, safe to bundle eagerly for every installed
 * command so a picker/sidebar can list them all without loading any command's
 * full behavior.
 */
export interface CommandManifest {
  id: string;
  label: string;
  category: string;
  tags: string[];
  summary: string;
  /** Which real OSes this command's generated output can target. */
  platforms: readonly SupportedPlatform[];
  /**
   * Per-platform caveat shown as the badge's tooltip — for a platform that
   * isn't a native install (e.g. rsync's win32 support is cwRsync/MSYS2/WSL,
   * not bundled with Windows). Omit for platforms with nothing to clarify.
   */
  platformNotes?: Partial<Record<SupportedPlatform, string>>;
  /** Which shells the generated command can actually be run from — see `SupportedShell`. */
  shells: readonly SupportedShell[];
}

/**
 * The full contract a `packages/cmds/<name>` package implements. Loaded on
 * demand (typically behind a dynamic `import()` keyed by `id`) once a command
 * is actually selected.
 */
export interface CommandDefinition<TSpec> extends CommandManifest {
  binaryDefault: string;
  groups: Record<string, FlagGroupMeta>;
  catalogue: FlagCatalogue;
  lintRules: readonly LintRule<TSpec>[];
  presets: readonly Preset<TSpec>[];
  createSpec(options?: unknown): TSpec;
  buildArgv(spec: TSpec): Argv;
  describe(spec: TSpec): string;
  specSchema: ZodType<TSpec>;
}
