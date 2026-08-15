import type { RsyncSpec } from "@cmdgen/rsync";
import { createSpec } from "@cmdgen/rsync";

/**
 * Shared spec builders. Ids are fixed strings so failures read the same way on
 * every run — nothing here may depend on time or randomness.
 */
export function spec(partial: Partial<RsyncSpec> = {}): RsyncSpec {
  return { ...createSpec({ id: "test-spec" }), ...partial };
}

export const localToLocal = (partial: Partial<RsyncSpec> = {}): RsyncSpec =>
  spec({
    source: { kind: "local", path: "/home/me/photos" },
    destination: { kind: "local", path: "/backup/photos" },
    ...partial,
  });

export const localToSsh = (partial: Partial<RsyncSpec> = {}): RsyncSpec =>
  spec({
    source: { kind: "local", path: "/srv/build" },
    destination: {
      kind: "ssh",
      host: "deploy.example.com",
      user: "deploy",
      path: "/var/www/app",
      batchMode: false,
      sshOptions: [],
    },
    ...partial,
  });

export const localToDaemon = (partial: Partial<RsyncSpec> = {}): RsyncSpec =>
  spec({
    source: { kind: "local", path: "/data" },
    destination: { kind: "daemon", host: "mirror.example.org", module: "archive", path: "incoming" },
    ...partial,
  });
