import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const BlkidSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** A single device to report on, e.g. "/dev/sda1". Empty scans every block device. */
  device: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — blkid is a Linux (util-linux) tool with no macOS or
   * Windows equivalent by this name. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type BlkidSpec = z.infer<typeof BlkidSpec>;
