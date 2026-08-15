import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Pushed as a single bare leading token (e.g. `apt-get install`, `apt-get
 * update`) — never a `-flag` — same shape as `@cmdgen/apt`'s `AptAction`.
 * apt-get's own real subcommand set, script-oriented and older than apt's:
 * no `search` or `list` (those came from apt/apt-cache/dpkg, not apt-get
 * itself), but `purge` IS a first-class apt-get action in its own right
 * (distinct from `remove --purge`, though both exist and do the same thing).
 */
export const AptGetAction = z.enum(["install", "remove", "purge", "update", "upgrade", "autoremove"]);
export type AptGetAction = z.infer<typeof AptGetAction>;

export const AptGetSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  action: AptGetAction.default("install"),

  /**
   * Package names, used by install/remove/purge. update/upgrade/autoremove
   * ignore this field entirely: real apt-get update/upgrade take no package
   * names at all, and autoremove needs none either (it acts on whatever is
   * already unneeded) — so nothing from here is ever pushed for those three
   * actions, even if the field has entries.
   */
  packages: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — apt-get is a Debian/Ubuntu-family package manager with
   * no macOS or Windows equivalent by this name, the same single-platform
   * shape as `@cmdgen/apt`. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type AptGetSpec = z.infer<typeof AptGetSpec>;
