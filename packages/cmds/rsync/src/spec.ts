import { z } from "zod";
import { PathFlavor, ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { Endpoint } from "./endpoint";
import { SPEC_VERSION } from "./pure";

export { PathFlavor, ShellDialect, SPEC_VERSION };

/**
 * Filter rules are an ORDERED list, not a set. rsync applies the first matching
 * rule and stops, so `--include` before `--exclude` means something different
 * than the reverse. Never normalise or sort this array.
 */
export const FilterKind = z.enum(["include", "exclude", "filter"]);
export type FilterKind = z.infer<typeof FilterKind>;

export const FilterRule = z.object({
  id: z.string(),
  kind: FilterKind,
  pattern: z.string(),
  enabled: z.boolean().default(true),
  comment: z.string().default(""),
});
export type FilterRule = z.infer<typeof FilterRule>;

export const RsyncSpec = z.object({
  /** Bumped when the shape changes, so share links and profiles can be migrated. */
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  source: Endpoint,
  destination: Endpoint,

  /**
   * true  -> `rsync src/ dest`  copies the CONTENTS of src into dest
   * false -> `rsync src  dest`  nests src itself under dest
   * This is the single most misunderstood part of rsync, so it is an explicit
   * boolean rather than a trailing slash the user has to notice.
   */
  contentsOnly: z.boolean().default(true),

  flags: FlagValues.default({}),
  filters: z.array(FilterRule).default([]),

  /** Validated against an allowlist before rendering. Never free-form passthrough. */
  extraArgs: z.array(z.string()).default([]),

  /** Rendering context. */
  rsyncBinary: z.string().default("rsync"),
  shell: ShellDialect.default("posix"),
  pathFlavor: PathFlavor.default("unix"),
  /**
   * rsync protocol version of the target build, used to hide or warn about
   * flags that do not exist there. 31 == rsync 3.x.
   */
  targetProtocol: z.number().int().min(26).max(32).default(31),
});
export type RsyncSpec = z.infer<typeof RsyncSpec>;

// The flag accessors and setFlag/setFlags live in ./pure so the UI can import them
// without dragging zod schema construction into the browser bundle.
