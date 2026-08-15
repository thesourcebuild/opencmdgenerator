import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const YumAction = z.enum(["install", "remove", "update", "search"]);
export type YumAction = z.infer<typeof YumAction>;

export const YumSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Pushed as a single bare leading token, e.g. `yum install ...` — same shape as `@cmdgen/cal`'s bare month/year tokens. */
  action: YumAction.default("install"),

  /**
   * Package names to install/remove/search for. Also used by `update` when
   * updating specific packages (real yum's `update` accepts package names
   * too) — unlike apt's `update`, which never takes packages, an empty list
   * here is only an error for install/remove/search, never for update.
   */
  packages: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/zip`'s/`@cmdgen/df`'s
   * `shell` field. yum is a RHEL/CentOS/Fedora-family tool with no
   * macOS-native or Windows-native form by the same name; only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type YumSpec = z.infer<typeof YumSpec>;
