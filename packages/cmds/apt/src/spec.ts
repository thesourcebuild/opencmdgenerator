import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** Pushed as a single bare leading token (e.g. `apt install`, `apt update`) — never a `-flag`. Same shape as `@cmdgen/cal`'s/`@cmdgen/ifconfig`'s bare spec-level fields. */
export const AptAction = z.enum(["install", "remove", "update", "upgrade", "search", "list"]);
export type AptAction = z.infer<typeof AptAction>;

export const AptSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  action: AptAction.default("install"),

  /**
   * Package names, used by install/remove/search — for search, only the
   * first non-empty entry is treated as the search term. update/upgrade/list
   * ignore this field entirely: real `apt list` takes no packages either
   * (e.g. `apt list --installed`), so nothing from here is ever pushed for
   * those three actions, even if the field has entries.
   */
  packages: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — apt is a Debian/Ubuntu-family package manager with no
   * macOS or Windows equivalent by this name (unlike every other POSIX-only
   * package so far, which still covered darwin+linux, this is a genuinely
   * single-platform command). Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type AptSpec = z.infer<typeof AptSpec>;
