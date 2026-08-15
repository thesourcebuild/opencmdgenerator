import type { WgetSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: WgetSpec): string {
  const url = spec.url.trim();
  const target = url !== "" ? url : "SOME_URL";

  const parts: string[] = [`Download ${target}`];

  if (flagBool(spec, "continueDownload")) parts.push("resuming a partially-downloaded file instead of starting over");
  if (flagBool(spec, "quiet")) parts.push("without printing progress output");

  if (flagBool(spec, "recursive")) {
    if (flagBool(spec, "noParent")) {
      parts.push("recursively, without ever ascending to the parent directory");
    } else {
      parts.push("recursively");
    }
  }

  const directoryPrefix = flagString(spec, "directoryPrefix");
  if (directoryPrefix) parts.push(`saving files under ${directoryPrefix}`);

  const outputDocument = flagString(spec, "outputDocument");
  if (outputDocument) parts.push(`saving it as ${outputDocument}`);

  const userAgent = flagString(spec, "userAgent");
  if (userAgent) parts.push(`sending a custom User-Agent of ${userAgent}`);

  return `${parts.join(", ")}.`;
}
