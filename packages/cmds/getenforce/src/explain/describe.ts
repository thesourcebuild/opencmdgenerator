import type { GetenforceSpec } from "../spec";

export function describeSpec(spec: GetenforceSpec): string {
  void spec;
  return "Print whether SELinux is currently Enforcing, Permissive, or Disabled.";
}
