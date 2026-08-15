import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type {
  OpensslDhparamSpec,
  OpensslDsaSpec,
  OpensslDsaparamSpec,
  OpensslEcSpec,
  OpensslEcparamSpec,
  OpensslGendsaSpec,
  OpensslGenpkeySpec,
  OpensslGenrsaSpec,
  OpensslPkeySpec,
  OpensslPkeyparamSpec,
  OpensslRsaSpec,
} from "../spec";
import {
  DHPARAM_CATALOGUE,
  DSAPARAM_CATALOGUE,
  DSA_CATALOGUE,
  ECPARAM_CATALOGUE,
  EC_CATALOGUE,
  GENDSA_CATALOGUE,
  GENPKEY_CATALOGUE,
  GENRSA_CATALOGUE,
  PKEYPARAM_CATALOGUE,
  PKEY_CATALOGUE,
  RSA_CATALOGUE,
} from "../catalogue/keygen";

/** Real genrsa renders flags first, then -out, then the bit size as a bare trailing positional (e.g. `openssl genrsa -aes256 -out key.pem 4096`). */
export function buildGenrsaArgv(spec: OpensslGenrsaSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, GENRSA_CATALOGUE)];
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push({ text: String(spec.bits), role: "value" });
  return args;
}

/**
 * `algorithm`/`outputFile`/`bits`/`curveName` are spec fields (not catalogue
 * flags) since they're structurally central to genpkey's meaning — bits only
 * renders (as `-pkeyopt rsa_keygen_bits:<n>`) for RSA/DSA, curveName only
 * renders (as `-pkeyopt ec_paramgen_curve:<name>`) for EC.
 */
export function buildGenpkeyArgv(spec: OpensslGenpkeySpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, GENPKEY_CATALOGUE)];
  args.push({ text: "-algorithm", role: "flag" }, { text: spec.algorithm, role: "value" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  if (spec.algorithm === "RSA" || spec.algorithm === "DSA") {
    args.push({ text: "-pkeyopt", role: "flag" }, { text: `rsa_keygen_bits:${spec.bits}`, role: "value" });
  }
  if (spec.algorithm === "EC") {
    const curveName = spec.curveName.trim();
    if (curveName !== "") args.push({ text: "-pkeyopt", role: "flag" }, { text: `ec_paramgen_curve:${curveName}`, role: "value" });
  }
  return args;
}

/** Real gendsa: `gendsa [-out file] paramfile` — paramFile is a trailing positional, not a flag. */
export function buildGendsaArgv(spec: OpensslGendsaSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, GENDSA_CATALOGUE)];
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  const paramFile = spec.paramFile.trim();
  if (paramFile !== "") args.push({ text: paramFile, role: "path" });
  return args;
}

/** Shared shape for rsa/dsa/ec/pkey/pkeyparam: `<subcommand> [-in file] [-out file] [flags]`. */
function buildInOutArgv(inFile: string, outputFile: string, catalogueArgs: Arg[]): Arg[] {
  const args: Arg[] = [];
  const input = inFile.trim();
  if (input !== "") args.push({ text: "-in", role: "flag" }, { text: input, role: "path" });
  const output = outputFile.trim();
  if (output !== "") args.push({ text: "-out", role: "flag" }, { text: output, role: "path" });
  args.push(...catalogueArgs);
  return args;
}

export function buildRsaArgv(spec: OpensslRsaSpec): Arg[] {
  return buildInOutArgv(spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, RSA_CATALOGUE));
}

export function buildDsaArgv(spec: OpensslDsaSpec): Arg[] {
  return buildInOutArgv(spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, DSA_CATALOGUE));
}

export function buildEcArgv(spec: OpensslEcSpec): Arg[] {
  return buildInOutArgv(spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, EC_CATALOGUE));
}

export function buildPkeyArgv(spec: OpensslPkeySpec): Arg[] {
  return buildInOutArgv(spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, PKEY_CATALOGUE));
}

export function buildPkeyparamArgv(spec: OpensslPkeyparamSpec): Arg[] {
  return buildInOutArgv(spec.inFile, spec.outputFile, buildFlagArgs(spec.flags, PKEYPARAM_CATALOGUE));
}

/** Shared shape for dhparam/dsaparam: `<subcommand> [-out file] [bits]`, bits a bare trailing positional. */
function buildOutBitsArgv(outputFile: string, bits: number, catalogueArgs: Arg[]): Arg[] {
  const args: Arg[] = [...catalogueArgs];
  const output = outputFile.trim();
  if (output !== "") args.push({ text: "-out", role: "flag" }, { text: output, role: "path" });
  args.push({ text: String(bits), role: "value" });
  return args;
}

export function buildDhparamArgv(spec: OpensslDhparamSpec): Arg[] {
  return buildOutBitsArgv(spec.outputFile, spec.bits, buildFlagArgs(spec.flags, DHPARAM_CATALOGUE));
}

export function buildDsaparamArgv(spec: OpensslDsaparamSpec): Arg[] {
  return buildOutBitsArgv(spec.outputFile, spec.bits, buildFlagArgs(spec.flags, DSAPARAM_CATALOGUE));
}

/** Real ecparam: `ecparam -name <curve> [-out file] [flags]`. */
export function buildEcparamArgv(spec: OpensslEcparamSpec): Arg[] {
  const args: Arg[] = [];
  const curveName = spec.curveName.trim();
  if (curveName !== "") args.push({ text: "-name", role: "flag" }, { text: curveName, role: "value" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, ECPARAM_CATALOGUE));
  return args;
}
