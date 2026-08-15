import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslEncSpec, OpensslPkeyutlSpec, OpensslRsautlSpec } from "../spec";
import { ENC_CATALOGUE, PKEYUTL_CATALOGUE, RSAUTL_CATALOGUE } from "../catalogue/enc";

/** Real `enc` renders the cipher as its own bare flag (e.g. `-aes-256-cbc`), not `-cipher <name>`. */
export function buildEncArgv(spec: OpensslEncSpec): Arg[] {
  const args: Arg[] = [];
  const cipher = spec.cipher.trim();
  if (cipher !== "") args.push({ text: `-${cipher}`, role: "flag" });
  args.push(...buildFlagArgs(spec.flags, ENC_CATALOGUE));
  // In "text" mode no `-in` is rendered — render.ts pipes `spec.text` in as
  // stdin instead (real enc reads stdin whenever no file argument is given).
  if (spec.inputMode !== "text") {
    const inFile = spec.inFile.trim();
    if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  }
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

/** Real flag is `-inkey`, not `-key` — rsautl/pkeyutl share this shape. */
function buildKeyBasedArgv(keyFile: string, inFile: string, outputFile: string, catalogueArgs: Arg[]): Arg[] {
  const args: Arg[] = [...catalogueArgs];
  const key = keyFile.trim();
  if (key !== "") args.push({ text: "-inkey", role: "flag" }, { text: key, role: "path" });
  const input = inFile.trim();
  if (input !== "") args.push({ text: "-in", role: "flag" }, { text: input, role: "path" });
  const output = outputFile.trim();
  if (output !== "") args.push({ text: "-out", role: "flag" }, { text: output, role: "path" });
  return args;
}

export function buildRsautlArgv(spec: OpensslRsautlSpec): Arg[] {
  return buildKeyBasedArgv(spec.keyFile, spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, RSAUTL_CATALOGUE));
}

export function buildPkeyutlArgv(spec: OpensslPkeyutlSpec): Arg[] {
  return buildKeyBasedArgv(spec.keyFile, spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, PKEYUTL_CATALOGUE));
}
