import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslVerifySpec } from "../spec";
import { VERIFY_CATALOGUE } from "../catalogue/verify";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** Real order: flags first, then the trailing certificate file(s) — `-CAfile` is a spec field (not a catalogue flag) since it's structurally central. */
export function buildVerifyArgv(spec: OpensslVerifySpec): Arg[] {
  const args: Arg[] = [];
  const caFile = spec.caFile.trim();
  if (caFile !== "") args.push({ text: "-CAfile", role: "flag" }, { text: caFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, VERIFY_CATALOGUE));
  for (const cert of nonEmpty(spec.certFiles)) args.push({ text: cert, role: "path" });
  return args;
}
