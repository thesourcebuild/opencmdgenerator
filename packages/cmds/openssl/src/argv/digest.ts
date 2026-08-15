import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslDgstSpec, OpensslMacSpec } from "../spec";
import { DGST_CATALOGUE, MAC_CATALOGUE } from "../catalogue/digest";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * Real `dgst` renders the algorithm as its own bare flag (e.g. `-sha256`),
 * then trailing file(s). In "text" input mode, no file positionals are
 * rendered at all — `render.ts` pipes `spec.text` in as stdin instead (real
 * dgst reads stdin whenever no file argument is given).
 */
export function buildDgstArgv(spec: OpensslDgstSpec): Arg[] {
  const args: Arg[] = [];
  const algorithm = spec.algorithm.trim();
  if (algorithm !== "") args.push({ text: `-${algorithm}`, role: "flag" });
  args.push(...buildFlagArgs(spec.flags, DGST_CATALOGUE));
  if (spec.inputMode === "files") {
    for (const file of nonEmpty(spec.files)) args.push({ text: file, role: "path" });
  }
  return args;
}

/** Real `mac` takes the MAC algorithm name (HMAC/CMAC) as a bare positional right after the subcommand, then flags. */
export function buildMacArgv(spec: OpensslMacSpec): Arg[] {
  const args: Arg[] = [{ text: spec.macType, role: "value" }];
  args.push(...buildFlagArgs(spec.flags, MAC_CATALOGUE));
  const keyFile = spec.keyFile.trim();
  // Real `-macopt key:<value>` accepts an alphanumeric key value directly — this field doubles as that value.
  if (keyFile !== "") args.push({ text: "-macopt", role: "flag" }, { text: `key:${keyFile}`, role: "value", attached: false });
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  return args;
}
