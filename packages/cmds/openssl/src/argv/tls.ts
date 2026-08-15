import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslPrimeSpec, OpensslRandSpec, OpensslSClientSpec, OpensslSServerSpec, OpensslSTimeSpec, OpensslSessIdSpec } from "../spec";
import { PRIME_CATALOGUE, RAND_CATALOGUE, SESS_ID_CATALOGUE, S_CLIENT_CATALOGUE, S_SERVER_CATALOGUE, S_TIME_CATALOGUE } from "../catalogue/tls";

/** Real order: `[-out file] [flags] numbytes` — numBytes is a bare trailing positional, rendered LAST. */
export function buildRandArgv(spec: OpensslRandSpec): Arg[] {
  const args: Arg[] = [];
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, RAND_CATALOGUE));
  args.push({ text: String(spec.numBytes), role: "value" });
  return args;
}

/** Real order: `[flags] number` — number is a bare trailing positional, only rendered when non-empty (real `-generate` takes no positional at all). */
export function buildPrimeArgv(spec: OpensslPrimeSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, PRIME_CATALOGUE)];
  const number = spec.number.trim();
  if (number !== "") args.push({ text: number, role: "value" });
  return args;
}

/** Real order: `-connect host:port [flags]`. */
export function buildSClientArgv(spec: OpensslSClientSpec): Arg[] {
  const args: Arg[] = [];
  const target = spec.connectTarget.trim();
  if (target !== "") args.push({ text: "-connect", role: "flag" }, { text: target, role: "value" });
  args.push(...buildFlagArgs(spec.flags, S_CLIENT_CATALOGUE));
  return args;
}

/** Real order: `-accept port [flags]`. */
export function buildSServerArgv(spec: OpensslSServerSpec): Arg[] {
  const args: Arg[] = [];
  const port = spec.acceptPort.trim();
  if (port !== "") args.push({ text: "-accept", role: "flag" }, { text: port, role: "value" });
  args.push(...buildFlagArgs(spec.flags, S_SERVER_CATALOGUE));
  return args;
}

/** Real order: `-connect host:port [flags]`. */
export function buildSTimeArgv(spec: OpensslSTimeSpec): Arg[] {
  const args: Arg[] = [];
  const target = spec.connectTarget.trim();
  if (target !== "") args.push({ text: "-connect", role: "flag" }, { text: target, role: "value" });
  args.push(...buildFlagArgs(spec.flags, S_TIME_CATALOGUE));
  return args;
}

/** Real order: `[-in file] [-out file] [flags]`. */
export function buildSessIdArgv(spec: OpensslSessIdSpec): Arg[] {
  const args: Arg[] = [];
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, SESS_ID_CATALOGUE));
  return args;
}
