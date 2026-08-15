import type { SetenforceSpec } from "../spec";

export function describeSpec(spec: SetenforceSpec): string {
  return spec.mode === "Permissive"
    ? "Set SELinux to Permissive mode — policy violations are logged but nothing is actually blocked."
    : "Set SELinux to Enforcing mode — policy violations are blocked and logged.";
}
