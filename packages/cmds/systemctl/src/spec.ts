import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which `systemctl COMMAND [UNIT]` subcommand this spec builds — modeled as
 * one internal enum, the same "bare mode axis" pattern `@cmdgen/apt`'s
 * `AptAction` and `@cmdgen/service`'s `ServiceAction` already use, rather
 * than a discriminated union. `daemon-reload` is the one action that takes
 * no unit at all — see `argv/index.ts`.
 */
export const SystemctlAction = z.enum([
  "list-units",
  "list-automounts",
  "list-paths",
  "list-sockets",
  "list-timers",
  "start",
  "stop",
  "restart",
  "reload",
  "try-restart",
  "reload-or-restart",
  "try-reload-or-restart",
  "enqueue-marked",
  "isolate",
  "kill",
  "clean",
  "freeze",
  "thaw",
  "set-property",
  "bind",
  "mount-image",
  "service-log-level",
  "service-log-target",
  "list-unit-files",
  "enable",
  "disable",
  "reenable",
  "preset",
  "preset-all",
  "is-enabled",
  "mask",
  "unmask",
  "link",
  "revert",
  "add-wants",
  "add-requires",
  "edit",
  "get-default",
  "set-default",
  "status",
  "is-active",
  "is-failed",
  "show",
  "cat",
  "help",
  "list-dependencies",
  "reset-failed",
  "whoami",
  "list-jobs",
  "cancel",
  "is-system-running",
  "default",
  "rescue",
  "emergency",
  "halt",
  "poweroff",
  "reboot",
  "kexec",
  "suspend",
  "hibernate",
  "hybrid-sleep",
  "suspend-then-hibernate",
  "exit",
  "switch-root",
  "daemon-reload",
  "daemon-reexec",
  "log-level",
  "log-target",
  "service-watchdogs",
  "show-environment",
  "set-environment",
  "unset-environment",
  "import-environment",
  "help-command",
  "version",
]);
export type SystemctlAction = z.infer<typeof SystemctlAction>;

export const SystemctlSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The unit to act on, e.g. "nginx.service" or "nginx" — ignored entirely by daemon-reload. */
  unit: z.string().default(""),
  /** Positional arguments after the subcommand. Replaces `unit` when non-empty; `unit` remains for old saved profiles. */
  targets: z.array(z.string()).default([]),
  /** Raw, user-supplied options before COMMAND for uncommon/new systemctl switches not modeled in the catalogue yet. */
  extraOptions: z.array(z.string()).default([]),
  /** Which of the nine real systemctl subcommands to run. */
  action: SystemctlAction.default("status"),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/service`'s `shell`
   * field. systemctl is Linux-only (the systemd init system it manages has
   * no macOS or Windows equivalent); only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SystemctlSpec = z.infer<typeof SystemctlSpec>;
