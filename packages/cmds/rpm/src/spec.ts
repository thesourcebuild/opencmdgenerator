import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** Which single-letter operation mode rpm runs in — see `argv/index.ts`'s `OPERATION_FLAG` lookup. */
export const RpmOperation = z.enum(["install", "erase", "query", "queryAll"]);
export type RpmOperation = z.infer<typeof RpmOperation>;

export const RpmSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Which of -i/-e/-q/-qa this invocation runs. */
  operation: RpmOperation.default("install"),

  /**
   * For `install` this is a `.rpm` FILE PATH; for `erase`/`query` this is an
   * installed PACKAGE NAME; for `queryAll` this field is ignored entirely —
   * real `rpm -qa` takes no argument at all, it lists every installed
   * package.
   */
  target: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/killall`'s/
   * `@cmdgen/touch`'s `shell` field. rpm is Linux-only, only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type RpmSpec = z.infer<typeof RpmSpec>;
