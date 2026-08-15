import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which pacman operation to run. Unusual among this app's enums: the
 * operation IS the leading token's exact flag spelling (-S, -R, -Ss, -Syu),
 * not a separate word placed alongside a flag — see `OPERATION_TOKEN` in
 * `argv/index.ts`.
 */
export const PacmanOperation = z.enum(["sync", "remove", "searchSync", "refreshUpgrade"]);
export type PacmanOperation = z.infer<typeof PacmanOperation>;

export const PacmanSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  operation: PacmanOperation.default("sync"),

  /**
   * Package names — used by sync/remove/searchSync. Ignored entirely for
   * refreshUpgrade: real `pacman -Syu` takes no package names at all, same
   * reasoning as apt's update/upgrade.
   */
  packages: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — pacman is Arch Linux's package manager;
   * there is no macOS or Windows equivalent by this name. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type PacmanSpec = z.infer<typeof PacmanSpec>;
