import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const UmountSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * umount's one operand — a device or a mount point, either spelling works.
   * Empty is valid only together with --all (which ignores this field
   * entirely and unmounts everything it can) — same shape as `@cmdgen/mount`'s
   * device/mountPoint pair being both-or-neither, but here it's a single field.
   */
  target: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/mount`'s `shell`.
   * umount has no Windows-native equivalent by the same name at all; only
   * ever reached from within a POSIX-capable shell. Kept only so the generic
   * render pipeline has a ShellDialect to quote with.
   */
  shell: ShellDialect.default("posix"),
});
export type UmountSpec = z.infer<typeof UmountSpec>;
