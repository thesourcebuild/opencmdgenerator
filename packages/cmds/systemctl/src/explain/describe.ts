import type { SystemctlSpec } from "../spec";

export function describeSpec(spec: SystemctlSpec): string {
  if (spec.action === "daemon-reload") {
    return "Reload systemd's unit configuration from disk, without starting, stopping, or restarting any unit.";
  }

  const unit = spec.unit.trim() || "SOME_UNIT";

  switch (spec.action) {
    case "start":
      return `Start the ${unit} unit.`;
    case "stop":
      return `Stop the ${unit} unit.`;
    case "restart":
      return `Restart the ${unit} unit.`;
    case "reload":
      return `Reload the ${unit} unit's configuration without a full restart.`;
    case "enable":
      return `Enable the ${unit} unit to start automatically at boot.`;
    case "disable":
      return `Disable the ${unit} unit from starting automatically at boot.`;
    case "status":
      return `Show the ${unit} unit's current status.`;
    case "is-active":
      return `Check whether the ${unit} unit is currently active.`;
  }
}
