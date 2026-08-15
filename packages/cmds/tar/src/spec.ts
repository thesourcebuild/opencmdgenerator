import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which `tar` implementation will run the command — and this is deliberately
 * NOT an operating system, because the two do not line up:
 *
 *   Linux                        -> GNU tar
 *   macOS                        -> bsdtar (libarchive)   <- not GNU!
 *   Windows 10+ cmd/PowerShell   -> bsdtar (in System32)
 *   Windows Git Bash/MSYS2/WSL   -> GNU tar
 *
 * So modeling this axis as `posix | powershell` (the way ls/rm/kill do, where
 * the split really is "different program per shell") would hand macOS users
 * GNU-only flags that do not exist on their machine. The flag sets diverge
 * enormously — GNU has ~150 options, bsdtar far fewer — and they even collide:
 * `-n` is `--seek` in GNU tar but `--norecurse` in bsdtar, and `-s` is
 * `--same-order` in GNU tar but a substitution expression in bsdtar. Those are
 * modeled as separate catalogue entries gated on this tag, so a spec can never
 * carry one variant's meaning into the other.
 */
export const TarVariant = z.enum(["gnu", "bsd"]);
export type TarVariant = z.infer<typeof TarVariant>;

/**
 * tar requires exactly one operation mode, so this is a spec field rather than
 * a flag — a catalogue of mutually-exclusive booleans would let the UI express
 * "create and extract at once", which is not a thing.
 */
export const TarMode = z.enum([
  "create",
  "extract",
  "list",
  "append",
  "update",
  "diff",
  "delete",
  "concatenate",
  "testLabel",
]);
export type TarMode = z.infer<typeof TarMode>;

export const TarSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  mode: TarMode.default("create"),

  /** The archive itself (`-f`). Empty means stdin/stdout, which is valid but worth a diagnostic. */
  archive: z.string().default(""),

  /**
   * Positional operands. On create/append/update these are the inputs to
   * archive; on extract/list they narrow which members to act on (empty = all).
   */
  files: z.array(z.string()).default([]),

  /**
   * `--exclude=PATTERN`, repeated. A list rather than a catalogue flag for the
   * same reason rsync's filters are: one entry renders one token, and the
   * engine's flag renderer has no repeated-flag concept.
   */
  excludes: z.array(z.string()).default([]),

  /**
   * `-C DIR`. A spec field because its *position* is load-bearing — it must
   * precede the files it applies to — which a catalogue flag's `order` alone
   * would not make obvious.
   */
  changeDir: z.string().default(""),

  variant: TarVariant.default("gnu"),
  /** Quoting only. `tar` is a real executable invoked identically from bash, cmd and PowerShell. */
  shell: ShellDialect.default("posix"),

  flags: FlagValues.default({}),
});
export type TarSpec = z.infer<typeof TarSpec>;
