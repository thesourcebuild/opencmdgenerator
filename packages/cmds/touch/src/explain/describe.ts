import type { TouchSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: TouchSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const reference = flagString(spec, "reference");
  const date = flagString(spec, "date");
  const stamp = flagString(spec, "stamp");

  const timeSource = reference
    ? `copying the timestamp from ${reference}`
    : date
      ? `using the time "${date}"`
      : stamp
        ? `using the timestamp ${stamp}`
        : "using the current time";

  const which = flagBool(spec, "accessOnly")
    ? "the access time"
    : flagBool(spec, "modifyOnly")
      ? "the modification time"
      : "both the access and modification time";

  const parts: string[] = [`Update ${which} of ${target}, ${timeSource}`];

  if (flagBool(spec, "noCreate")) parts.push("without creating any file that doesn't already exist");
  if (flagBool(spec, "noDereference")) parts.push("acting on symlinks themselves, not their targets");

  return `${parts.join(", ")}.`;
}
