import type { PrintfSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";

export function describeSpec(spec: PrintfSpec): string {
  const options = enabledFlagIds(spec).map((id) =>
    CATALOGUE.requireFlag(id).summary.toLowerCase(),
  );
  const target = spec.args.map((arg) => arg.trim()).filter(Boolean);
  const targetText = target.length ? ` for ${target.join(", ")}` : "";
  const optionText = options.length ? ` with ${options.join(", ")}` : "";
  return "Format and print data" + targetText + optionText + ".";
}
