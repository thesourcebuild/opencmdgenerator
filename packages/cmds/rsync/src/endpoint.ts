import { z } from "zod";

/**
 * Endpoint paths are stored WITHOUT a trailing slash. The trailing-slash
 * semantics of rsync are modelled explicitly by `RsyncSpec.contentsOnly`
 * so the meaning is visible in the UI and checkable by lint rules,
 * rather than hiding in whitespace at the end of a string.
 */

export const StrictHostKeyChecking = z.enum(["accept-new", "yes", "no"]);
export type StrictHostKeyChecking = z.infer<typeof StrictHostKeyChecking>;

export const LocalEndpoint = z.object({
  kind: z.literal("local"),
  path: z.string(),
});
export type LocalEndpoint = z.infer<typeof LocalEndpoint>;

export const SshEndpoint = z.object({
  kind: z.literal("ssh"),
  host: z.string(),
  user: z.string().optional(),
  port: z.number().int().min(1).max(65535).optional(),
  path: z.string(),
  /** Passed through to `-e ssh -i <file>`. */
  identityFile: z.string().optional(),
  /**
   * Left unset by default so ssh's own configuration decides. Emitting
   * `accept-new` unasked would silently auto-trust unknown host keys.
   */
  strictHostKeyChecking: StrictHostKeyChecking.optional(),
  /**
   * `-o BatchMode=yes`. Off by default: it is correct for a scheduled job but
   * it also disables the interactive password prompt, which breaks a manual run
   * that relies on one.
   */
  batchMode: z.boolean().default(false),
  /** Extra `ssh` options, rendered as `-o key=value`. */
  sshOptions: z.array(z.string()).default([]),
});
export type SshEndpoint = z.infer<typeof SshEndpoint>;

/** rsync daemon: rsync://[user@]host[:port]/module[/path] */
export const DaemonEndpoint = z.object({
  kind: z.literal("daemon"),
  host: z.string(),
  port: z.number().int().min(1).max(65535).optional(),
  module: z.string(),
  path: z.string().default(""),
  user: z.string().optional(),
});
export type DaemonEndpoint = z.infer<typeof DaemonEndpoint>;

export const Endpoint = z.discriminatedUnion("kind", [
  LocalEndpoint,
  SshEndpoint,
  DaemonEndpoint,
]);
export type Endpoint = z.infer<typeof Endpoint>;

export type EndpointKind = Endpoint["kind"];

// isRemote and the empty* factories live in ./pure, for the same reason the flag
// accessors do: callers that only need a plain object should not pull zod in.
