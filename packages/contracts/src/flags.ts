import { z } from "zod";

/**
 * Flag values are stored in an open record keyed by a command's own flag id
 * rather than as named schema fields. This is deliberate: each command's flag
 * catalogue (in its `packages/cmds/<name>` package) is the single source of
 * truth for the UI, the reference docs, and the lint rules, so adding support
 * for a new flag is a one-line data change with no schema migration.
 */
export const FlagValue = z.union([z.boolean(), z.string(), z.number(), z.array(z.string())]);
export type FlagValue = z.infer<typeof FlagValue>;

export const FlagValues = z.record(z.string(), FlagValue);
export type FlagValues = z.infer<typeof FlagValues>;
