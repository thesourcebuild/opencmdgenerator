import type { InfoSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: InfoSpec): string {
  const topic = spec.topic.trim();
  const where = flagBool(spec, "where");

  if (topic === "") {
    return where
      ? "Print the file location of the top-level Info directory node instead of displaying it."
      : "Open the top-level Info directory to browse.";
  }

  return where
    ? `Print the file location of the Info node for ${topic} instead of displaying it.`
    : `Display the Info node for ${topic}.`;
}
