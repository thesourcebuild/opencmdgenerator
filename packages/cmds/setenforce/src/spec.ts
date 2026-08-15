import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Real setenforce accepts either 1/0 or the words "Enforcing"/"Permissive"
 * on its command line. This app always renders the word form — clearer to
 * read in a generated command than a bare digit — same reasoning as
 * `@cmdgen/iptables`'s `IptablesAction` enum modeling the semantic choice
 * rather than the raw flag token.
 */
export const SetenforceMode = z.enum(["Enforcing", "Permissive"]);
export type SetenforceMode = z.infer<typeof SetenforceMode>;

export const SetenforceSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * setenforce takes exactly one positional — the desired mode — never an
   * arbitrary list, same shape as `@cmdgen/killall`'s `processName`. See
   * `lint/rules.ts`'s `SEF001` for the caution attached to "Permissive".
   */
  mode: SetenforceMode.default("Enforcing"),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — setenforce is a Linux-only SELinux utility with no
   * macOS or Windows equivalent by this name at all, same reasoning as
   * `@cmdgen/iptables`'s `shell` field. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SetenforceSpec = z.infer<typeof SetenforceSpec>;
