import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SshSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): SshSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    host: "",
    user: "",
    port: "",
    identityFile: "",
    remoteCommand: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SshSpec>[] = [
  {
    id: "quick-connect",
    label: "Quick connect",
    summary: "A plain interactive login — verbose enough to see what's happening if it fails.",
    apply: (spec) => ({ ...spec, flags: { verbose: "1" } }),
  },
  {
    id: "scripted",
    label: "Scripted / non-interactive",
    summary: "Never prompts, never hangs — the right defaults for a script or cron job.",
    apply: (spec) => ({
      ...spec,
      flags: { batchMode: true, connectTimeout: 10, strictHostKeyChecking: "accept-new" },
    }),
  },
  {
    id: "local-forward",
    label: "Local port forward",
    summary:
      "Local port forwarding makes a remote service available on your local machine. Your local SSH client opens a listening port; any traffic sent to that port is tunneled to the remote SSH server, which forwards it to the final destination.",
    mnemonic: "-L local_port:remote_host:remote_port or -L local_port:destination_host:destination_port",
    commandExample: "ssh -L 8080:localhost:3306 -N user@remote-server",
    howItWorks:
      "Your local machine starts listening on port 8080. Traffic to localhost:8080 goes through the tunnel; the remote server passes it directly to its own port 3306 (e.g. MySQL running alongside sshd on that host).",
    useCase:
      "Local forwarding is useful when you need to access a service on a remote server that is not directly accessible from your local machine. Connecting securely to a production database (like PostgreSQL or MySQL) gated behind a strict remote cloud firewall — the database port is never exposed publicly, only reachable through the SSH tunnel.",
    apply: (spec) => ({ ...spec, flags: { localForward: "8080:localhost:3306", noRemoteCommand: true } }),
  },
  {
    id: "remote-forward",
    label: "Remote port forward",
    summary:
      "Remote port forwarding (a reverse SSH tunnel) makes a local service available on a remote machine. The remote SSH server opens a listening port, and any traffic hitting that port is tunneled back to your local client.",
    mnemonic: "-R remote_port:local_host:local_port or remote_port:destination_host:destination_port ",
    commandExample: "ssh -R 9000:localhost:3000 -N user@remote-gateway",
    howItWorks:
      "The remote server starts listening on port 9000. Anyone accessing port 9000 on that server is routed through the tunnel back to port 3000 on your local development machine.",
    useCase:
      "Remote forwarding is useful when you need to allow access to a service running on your local machine from a remote server. Showing a client a web application running on your local development environment, without altering router NAT rules or deploying to a staging cloud first.",
    apply: (spec) => ({ ...spec, flags: { remoteForward: "9000:localhost:3000", noRemoteCommand: true } }),
  },
  {
    id: "socks-proxy",
    label: "SOCKS proxy",
    summary:
      "Dynamic port forwarding turns your SSH client into a local SOCKS proxy server. Instead of pointing to one specific destination port, it routes traffic to a destination chosen dynamically by whatever application connects through it.",
    mnemonic: "-D local_proxy_port",
    commandExample: "ssh -D 1080 -N user@remote-proxy",
    howItWorks:
      "Your client listens locally on port 1080. Configure a browser (or any SOCKS-aware app) to use localhost:1080 as a SOCKS5 proxy, and all its requests are piped through the secure tunnel and exit from the remote server's network — no per-destination forwarding rule needed.",
    useCase:
      "Dynamic forwarding is useful when you want to use the remote server as a proxy for all network traffic. Safely browsing the internet over unencrypted public Wi-Fi, or securely reaching internal web panels across an entire corporate subnet.",
    apply: (spec) => ({ ...spec, flags: { dynamicForward: "1080", noRemoteCommand: true } }),
  },
  {
    id: "unix-socket-forward",
    label: "Forward a Unix socket (e.g. Docker)",
    summary:
      "-L also accepts a filesystem path instead of host:port on either side, forwarding a Unix domain socket rather than a TCP port. This example exposes the remote host's Docker daemon socket locally, so local Docker tooling (or a Postgres/Redis client expecting a local socket) can talk to it as if it were on this machine.",
    apply: (spec) => ({
      ...spec,
      flags: { localForward: "/tmp/local.sock:/var/run/docker.sock", noRemoteCommand: true },
    }),
  },
  {
    id: "start-connection-sharing",
    label: "Start connection sharing",
    summary: "Opens a background master connection that later ssh/scp/sftp calls to this host can reuse instead of reconnecting.",
    apply: (spec) => ({
      ...spec,
      flags: {
        masterMode: "master",
        controlPath: "~/.ssh/cm-%r@%h:%p",
        background: true,
        noRemoteCommand: true,
      },
    }),
  },
  {
    id: "query-ciphers",
    label: "List supported ciphers",
    summary: "Prints this local ssh build's supported ciphers and exits — nothing is connected to.",
    apply: (spec) => ({ ...spec, flags: { queryOption: "cipher" } }),
  },
];

export function getPreset(id: string): Preset<SshSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
