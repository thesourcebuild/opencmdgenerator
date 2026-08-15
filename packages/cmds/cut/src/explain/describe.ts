import type { CutSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: CutSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const where = files.length > 0 ? files.join(", ") : "standard input";

  const complement = flagBool(spec, "complement");
  const verb = complement ? "Exclude" : "Extract";

  const fields = flagString(spec, "fields");
  const characters = flagString(spec, "characters");
  const bytes = flagString(spec, "bytes");

  let selection = "SELECTION";
  if (fields) selection = `field(s) ${fields}`;
  else if (characters) selection = `character(s) ${characters}`;
  else if (bytes) selection = `byte(s) ${bytes}`;

  const parts: string[] = [`${verb} ${selection} from each line of ${where}`];

  const delimiter = flagString(spec, "delimiter");
  if (delimiter && fields) parts.push(`splitting fields on "${delimiter}"`);

  return `${parts.join(", ")}.`;
}
