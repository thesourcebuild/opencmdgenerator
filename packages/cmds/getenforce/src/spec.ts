import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * The simplest possible command in this app: `getenforce` takes no
 * arguments and no flags at all — it just prints "Enforcing", "Permissive",
 * or "Disabled" and exits. There is genuinely nothing to model beyond the
 * fields every spec carries — same near-bare shape as `@cmdgen/pwd`'s or
 * `@cmdgen/clear`'s specs, minus even their one optional flag.
 */
export const GetenforceSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — getenforce is a Linux-only SELinux utility with no
   * macOS or Windows equivalent by this name at all (SELinux itself is
   * Linux-specific), same reasoning as `@cmdgen/iptables`'s `shell` field.
   * Kept only so the generic render pipeline has a ShellDialect to quote
   * with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type GetenforceSpec = z.infer<typeof GetenforceSpec>;
