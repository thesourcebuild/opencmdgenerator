import type { SystemctlSpec } from "../spec";
import { positionalArgs } from "../argv";

const ACTION_PHRASE: Partial<Record<SystemctlSpec["action"], string>> = {
  "list-units": "List units currently known to systemd",
  "list-automounts": "List automount units",
  "list-paths": "List path units",
  "list-sockets": "List socket units",
  "list-timers": "List timer units",
  "list-unit-files": "List installed unit files",
  "list-jobs": "List queued systemd jobs",
  show: "Show machine-readable systemd properties",
  cat: "Show unit files and drop-ins",
  help: "Open help for units or processes",
  "list-dependencies": "Show unit dependencies",
  "is-failed": "Check whether units have failed",
  "is-enabled": "Check whether unit files are enabled",
  "reset-failed": "Reset failed state",
  whoami: "Show which units own the selected processes",
  reenable: "Disable and enable unit files again",
  preset: "Apply preset policy to unit files",
  "preset-all": "Apply preset policy to all unit files",
  mask: "Mask unit files so they cannot be started",
  unmask: "Unmask unit files",
  link: "Link unit files into the unit search path",
  revert: "Revert unit files to vendor state",
  "add-wants": "Add Wants= dependencies",
  "add-requires": "Add Requires= dependencies",
  edit: "Edit unit files or drop-ins",
  "get-default": "Show the default target",
  "set-default": "Set the default target",
  kill: "Send a signal to unit processes",
  clean: "Remove selected runtime/state/cache/log data for units",
  freeze: "Freeze unit processes with the cgroup freezer",
  thaw: "Thaw frozen unit processes",
  "set-property": "Set runtime unit properties",
  bind: "Bind-mount a path into a unit namespace",
  "mount-image": "Mount an image into a unit namespace",
  "service-log-level": "Get or set a service's log level",
  "service-log-target": "Get or set a service's log target",
  "is-system-running": "Check the overall system manager state",
  default: "Start the default target",
  rescue: "Enter rescue mode",
  emergency: "Enter emergency mode",
  halt: "Halt the system",
  poweroff: "Power off the system",
  reboot: "Reboot the system",
  kexec: "Reboot through kexec",
  suspend: "Suspend the system",
  hibernate: "Hibernate the system",
  "hybrid-sleep": "Hybrid-sleep the system",
  "suspend-then-hibernate": "Suspend and then hibernate the system",
  exit: "Ask the user manager to exit",
  "switch-root": "Switch to a new root filesystem",
  "daemon-reload": "Reload systemd's unit configuration from disk",
  "daemon-reexec": "Re-execute the systemd manager",
  "log-level": "Get or set systemd's log level",
  "log-target": "Get or set systemd's log target",
  "service-watchdogs": "Get or set service watchdog handling",
  "show-environment": "Show manager environment variables",
  "set-environment": "Set manager environment variables",
  "unset-environment": "Unset manager environment variables",
  "import-environment": "Import variables into the manager environment",
  "help-command": "Show systemctl command help",
  version: "Print systemctl version information",
};

export function describeSpec(spec: SystemctlSpec): string {
  if (spec.action === "daemon-reload") {
    return "Reload systemd's unit configuration from disk, without starting, stopping, or restarting any unit.";
  }

  const args = positionalArgs(spec);
  const target = args.length > 0 ? args.join(", ") : "SOME_UNIT";

  switch (spec.action) {
    case "start":
      return `Start the ${target} unit.`;
    case "stop":
      return `Stop the ${target} unit.`;
    case "restart":
      return `Restart the ${target} unit.`;
    case "reload":
      return `Reload the ${target} unit's configuration without a full restart.`;
    case "enable":
      return `Enable the ${target} unit to start automatically at boot.`;
    case "disable":
      return `Disable the ${target} unit from starting automatically at boot.`;
    case "status":
      return `Show the ${target} unit's current status.`;
    case "is-active":
      return `Check whether the ${target} unit is currently active.`;
    default: {
      const phrase = ACTION_PHRASE[spec.action] ?? `Run systemctl ${spec.action}`;
      return args.length > 0 ? `${phrase} for ${args.join(", ")}.` : `${phrase}.`;
    }
  }
}
