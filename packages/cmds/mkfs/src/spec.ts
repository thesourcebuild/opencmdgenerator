import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const MkfsSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The device to format, e.g. "/dev/sdb1". Required for a meaningful command — see lint/rules.ts. */
  device: z.string().default(""),
  /** `-t`, e.g. "ext4", "xfs", "btrfs", "vfat". Empty lets mkfs pick its own default (usually ext2). */
  filesystemType: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — mkfs is a Linux tool with no macOS or Windows
   * equivalent by this name. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type MkfsSpec = z.infer<typeof MkfsSpec>;
