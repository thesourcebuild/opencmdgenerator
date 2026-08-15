import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslKdfSpec, OpensslPasswdSpec, OpensslPkcs12Spec, OpensslPkcs7Spec, OpensslPkcs8Spec } from "../spec";
import { flagBool } from "../pure";
import { KDF_CATALOGUE, PASSWD_CATALOGUE, PKCS12_CATALOGUE, PKCS7_CATALOGUE, PKCS8_CATALOGUE } from "../catalogue/pkcs";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * Real `pkcs12` has two distinct modes selected by -export: bundling a key +
 * cert INTO a .p12 (-inkey/-in/-out), or extracting a key/certs OUT of one
 * (-in/-out only, where -in is the .p12 itself). `inFile` is reused across
 * both directions, rendered differently depending on -export.
 */
export function buildPkcs12Argv(spec: OpensslPkcs12Spec): Arg[] {
  const args: Arg[] = [];
  args.push(...buildFlagArgs(spec.flags, PKCS12_CATALOGUE));

  if (flagBool(spec, "export")) {
    const keyFile = spec.keyFile.trim();
    if (keyFile !== "") args.push({ text: "-inkey", role: "flag" }, { text: keyFile, role: "path" });
    const certFile = spec.certFile.trim();
    if (certFile !== "") args.push({ text: "-in", role: "flag" }, { text: certFile, role: "path" });
  } else {
    const inFile = spec.inFile.trim();
    if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  }

  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

export function buildPkcs7Argv(spec: OpensslPkcs7Spec): Arg[] {
  const args: Arg[] = [];
  args.push(...buildFlagArgs(spec.flags, PKCS7_CATALOGUE));
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

export function buildPkcs8Argv(spec: OpensslPkcs8Spec): Arg[] {
  const args: Arg[] = [];
  args.push(...buildFlagArgs(spec.flags, PKCS8_CATALOGUE));
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

/** Real `passwd` takes its passwords as bare trailing positionals, one after another, not a flag. */
export function buildPasswdArgv(spec: OpensslPasswdSpec): Arg[] {
  const args: Arg[] = [];
  args.push(...buildFlagArgs(spec.flags, PASSWD_CATALOGUE));
  for (const password of nonEmpty(spec.passwords)) args.push({ text: password, role: "value" });
  return args;
}

/** Real `kdf` renders -keylen from its own field, then the KDF name as a bare trailing positional. */
export function buildKdfArgv(spec: OpensslKdfSpec): Arg[] {
  const args: Arg[] = [];
  args.push(...buildFlagArgs(spec.flags, KDF_CATALOGUE));
  args.push({ text: "-keylen", role: "flag" }, { text: String(spec.keyLength), role: "value" });
  const kdfName = spec.kdfName.trim();
  if (kdfName !== "") args.push({ text: kdfName, role: "value" });
  return args;
}
