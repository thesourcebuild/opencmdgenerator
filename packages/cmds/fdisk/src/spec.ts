import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Deliberately narrow: real fdisk's interactive partition-editing mode
 * cannot be represented as a single generated command line, and
 * partition-table edits are irreversibly destructive. Only the safe, real,
 * non-interactive read-only form is modeled here — `-l` (list partition
 * tables), optionally scoped to one `device`. No interactive edit
 * sub-flags are modeled, on purpose.
 */
export const FdiskSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** A single device to list, e.g. "/dev/sda". Empty lists every device fdisk can find. */
  device: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — fdisk is a Linux (util-linux) tool with no macOS or
   * Windows equivalent by this name. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type FdiskSpec = z.infer<typeof FdiskSpec>;
