import type { MountSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: MountSpec): string {
  const device = spec.device.trim();
  const mountPoint = spec.mountPoint.trim();

  const parts: string[] = [];

  if (device === "" && mountPoint === "") {
    parts.push("List every currently mounted filesystem");
  } else {
    const deviceLabel = device !== "" ? device : "(unspecified)";
    const mountPointLabel = mountPoint !== "" ? mountPoint : "(unspecified)";
    parts.push(`Mount ${deviceLabel} at ${mountPointLabel}`);
  }

  const type = flagString(spec, "type");
  if (type) parts.push(`using filesystem type ${type}`);

  const options = flagString(spec, "options");
  if (options) parts.push(`with options ${options}`);

  if (flagBool(spec, "readOnly")) parts.push("read-only");
  if (flagBool(spec, "bind")) parts.push("as a bind mount");
  if (flagBool(spec, "verbose")) parts.push("describing each step as it goes");

  return `${parts.join(", ")}.`;
}
