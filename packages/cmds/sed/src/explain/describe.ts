import type { SedSpec } from "../spec";
import { expressions, flagBool } from "../pure";

export function describeSpec(spec: SedSpec): string {
  const exprs = expressions(spec);
  const exprText = exprs.length > 0 ? exprs.join("; ") : "SCRIPT";
  const files = spec.files.filter((f) => f.trim() !== "");
  const where = files.length > 0 ? files.join(", ") : "standard input";

  const parts: string[] = [`Run the sed script "${exprText}" over ${where}`];

  if (flagBool(spec, "quiet")) parts.push("suppressing automatic printing of each line (-n)");
  if (flagBool(spec, "extendedRegexp")) parts.push("using extended regular expressions (-r)");

  if (spec.inPlace) {
    const suffix = spec.backupSuffix.trim();
    parts.push(
      suffix === ""
        ? "editing each file in place with NO backup copy"
        : `editing each file in place, backing up the original with a "${suffix}" suffix`,
    );
  }

  return `${parts.join(", ")}.`;
}
