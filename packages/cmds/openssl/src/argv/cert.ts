import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslCaSpec, OpensslCrl2pkcs7Spec, OpensslCrlSpec, OpensslReqSpec, OpensslX509Spec } from "../spec";
import { CA_CATALOGUE, CRL2PKCS7_CATALOGUE, CRL_CATALOGUE, REQ_CATALOGUE, X509_CATALOGUE } from "../catalogue/cert";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * Real order: flags first, then `-key`/`-newkey`, then `-out`, then `-subj`.
 * Real req uses EITHER an existing key (`-key`) OR generates a fresh one
 * (`-newkey`), never both, so `keyFile` only renders when `newKeySpec` is empty.
 */
export function buildReqArgv(spec: OpensslReqSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, REQ_CATALOGUE)];
  const newKeySpec = spec.newKeySpec.trim();
  const keyFile = spec.keyFile.trim();
  if (newKeySpec !== "") {
    args.push({ text: "-newkey", role: "flag" }, { text: newKeySpec, role: "value" });
  } else if (keyFile !== "") {
    args.push({ text: "-key", role: "flag" }, { text: keyFile, role: "path" });
  }
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  const subject = spec.subject.trim();
  if (subject !== "") args.push({ text: "-subj", role: "flag" }, { text: subject, role: "value" });
  return args;
}

/** Real order: `-config`/`-in`/`-out` (structurally central spec fields) then flags. */
export function buildCaArgv(spec: OpensslCaSpec): Arg[] {
  const args: Arg[] = [];
  const configFile = spec.configFile.trim();
  if (configFile !== "") args.push({ text: "-config", role: "flag" }, { text: configFile, role: "path" });
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, CA_CATALOGUE));
  return args;
}

/**
 * Real order: `-in`/`-out`, then `-signkey`/`-days` (only meaningful together —
 * real x509 ignores `-days` unless it's actually (re-)signing something, so it
 * is only rendered when a signing key is given), then flags.
 */
export function buildX509Argv(spec: OpensslX509Spec): Arg[] {
  const args: Arg[] = [];
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  const signKeyFile = spec.signKeyFile.trim();
  if (signKeyFile !== "") {
    args.push({ text: "-signkey", role: "flag" }, { text: signKeyFile, role: "path" });
    args.push({ text: "-days", role: "flag" }, { text: String(spec.days), role: "value" });
  }
  args.push(...buildFlagArgs(spec.flags, X509_CATALOGUE));
  return args;
}

/** Real order: `-in`/`-out` then flags. */
export function buildCrlArgv(spec: OpensslCrlSpec): Arg[] {
  const args: Arg[] = [];
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, CRL_CATALOGUE));
  return args;
}

/**
 * Real `crl2pkcs7` repeats `-certfile` once PER certificate file — NOT a
 * single flag with a comma-list. Real order: `-in`, then each `-certfile`,
 * then `-out`, then flags.
 */
export function buildCrl2pkcs7Argv(spec: OpensslCrl2pkcs7Spec): Arg[] {
  const args: Arg[] = [];
  const crlFile = spec.crlFile.trim();
  if (crlFile !== "") args.push({ text: "-in", role: "flag" }, { text: crlFile, role: "path" });
  for (const cert of nonEmpty(spec.certFiles)) {
    args.push({ text: "-certfile", role: "flag" }, { text: cert, role: "path" });
  }
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, CRL2PKCS7_CATALOGUE));
  return args;
}
