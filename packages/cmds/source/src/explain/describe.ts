import type { SourceSpec } from "../spec";

export function describeSpec(spec: SourceSpec): string {
  const file = spec.file.trim() || "SOME_SCRIPT";
  const args = spec.args.filter((a) => a.trim() !== "");

  const parts: string[] = [`Load and run ${file} in the current shell`];
  if (args.length > 0) parts.push(`passing ${args.join(", ")} as arguments`);

  return `${parts.join(", ")}.`;
}
