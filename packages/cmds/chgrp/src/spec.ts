import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * chgrp's group-only sibling of `@cmdgen/chown` — same shape, minus the
 * user-ownership half. `owner` becomes `group`; there is no OWNER:GROUP
 * combined expression here, just a bare group name.
 */
export const ChgrpSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  paths: z.array(z.string()).default([]),

  /** The group name, e.g. "staff". Empty means "no group given" (only --reference may supply one instead). */
  group: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — same shape as `@cmdgen/chown`'s `shell`. chgrp has no
   * Windows-native or PowerShell form at all: Windows has no group-ownership
   * model to change in the first place.
   */
  shell: ShellDialect.default("posix"),
});
export type ChgrpSpec = z.infer<typeof ChgrpSpec>;
