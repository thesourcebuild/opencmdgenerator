import { z } from "zod";
import { PathFlavor, ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { PathFlavor, ShellDialect, SPEC_VERSION };

/**
 * scp's own endpoint model — deliberately simpler than rsync's `Endpoint`.
 * scp has no daemon mode, and connection options (identity file, port, ssh
 * options, cipher, jump host, ...) are scp's own top-level flags/fields, not
 * per-endpoint data, since a real invocation only ever has one remote side's
 * worth of connection settings to give (scp's -3 copies between two remote
 * hosts, but still only accepts one set of ssh options for the whole command).
 */
export const LocalEndpoint = z.object({
  kind: z.literal("local"),
  path: z.string().default(""),
});
export type LocalEndpoint = z.infer<typeof LocalEndpoint>;

export const RemoteEndpoint = z.object({
  kind: z.literal("remote"),
  host: z.string().default(""),
  user: z.string().default(""),
  path: z.string().default(""),
});
export type RemoteEndpoint = z.infer<typeof RemoteEndpoint>;

export const Endpoint = z.discriminatedUnion("kind", [LocalEndpoint, RemoteEndpoint]);
export type Endpoint = z.infer<typeof Endpoint>;
export type EndpointKind = Endpoint["kind"];

export const ScpSpec = z.object({
  /** Bumped when the spec shape changes, so share links and profiles can be migrated. */
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** scp's real `source ... target` — one or more sources copied into one destination. */
  sources: z.array(Endpoint).min(1).default([{ kind: "local", path: "" }]),
  destination: Endpoint.default({ kind: "local", path: "" }),

  /** Spec fields, not catalogue flags — same reasoning as ssh's host/user/port/identityFile. */
  identityFile: z.string().default(""),
  /** Empty means "let scp/config decide". scp's port flag is -P (capital), distinct from ssh's -p. */
  port: z.string().default(""),
  /** -o ssh_option, repeatable. */
  sshOptions: z.array(z.string()).default([]),
  /** -X sftp_option, repeatable. */
  sftpOptions: z.array(z.string()).default([]),

  /** Rendering context. */
  scpBinary: z.string().default("scp"),
  shell: ShellDialect.default("posix"),
  pathFlavor: PathFlavor.default("unix"),

  flags: FlagValues.default({}),
});
export type ScpSpec = z.infer<typeof ScpSpec>;

// The flag accessors, setFlag/setFlags, and endpoint factories live in ./pure
// so the UI can import them without dragging zod schema construction into the
// browser bundle.
