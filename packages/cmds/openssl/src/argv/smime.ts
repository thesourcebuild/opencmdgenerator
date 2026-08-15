import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type {
  OpensslConfigutlSpec,
  OpensslSkeyutlSpec,
  OpensslSmimeSpec,
  OpensslSpkacSpec,
  OpensslSrpSpec,
  OpensslStoreutlSpec,
} from "../spec";
import {
  CONFIGUTL_CATALOGUE,
  SKEYUTL_CATALOGUE,
  SMIME_CATALOGUE,
  SPKAC_CATALOGUE,
  SRP_CATALOGUE,
  STOREUTL_CATALOGUE,
} from "../catalogue/smime";

/** Real `smime` renders one driving action flag first (-encrypt/-decrypt/-sign/-verify), same pattern as `cms`. */
export function buildSmimeArgv(spec: OpensslSmimeSpec): Arg[] {
  const args: Arg[] = [];
  switch (spec.action) {
    case "encrypt":
      args.push({ text: "-encrypt", role: "flag" });
      break;
    case "decrypt":
      args.push({ text: "-decrypt", role: "flag" });
      break;
    case "sign":
      args.push({ text: "-sign", role: "flag" });
      break;
    case "verify":
      args.push({ text: "-verify", role: "flag" });
      break;
  }
  args.push(...buildFlagArgs(spec.flags, SMIME_CATALOGUE));
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

/** Real argv: `spkac -key file -challenge value [flags]`. */
export function buildSpkacArgv(spec: OpensslSpkacSpec): Arg[] {
  const args: Arg[] = [];
  const keyFile = spec.keyFile.trim();
  if (keyFile !== "") args.push({ text: "-key", role: "flag" }, { text: keyFile, role: "path" });
  const challenge = spec.challenge.trim();
  if (challenge !== "") args.push({ text: "-challenge", role: "flag" }, { text: challenge, role: "value" });
  args.push(...buildFlagArgs(spec.flags, SPKAC_CATALOGUE));
  return args;
}

/** Real srp is a database-management tool; username is a trailing positional after the flags. */
export function buildSrpArgv(spec: OpensslSrpSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, SRP_CATALOGUE)];
  const username = spec.username.trim();
  if (username !== "") args.push({ text: username, role: "value" });
  return args;
}

/** Real argv: `storeutl uri [flags]` — but flags read more naturally before the uri, and real storeutl accepts either order. */
export function buildStoreutlArgv(spec: OpensslStoreutlSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, STOREUTL_CATALOGUE)];
  const uri = spec.uri.trim();
  if (uri !== "") args.push({ text: uri, role: "value" });
  return args;
}

/** Real argv: `skeyutl [flags] -out file`. */
export function buildSkeyutlArgv(spec: OpensslSkeyutlSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, SKEYUTL_CATALOGUE)];
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

/** Real argv: `configutl -in file [flags]`. */
export function buildConfigutlArgv(spec: OpensslConfigutlSpec): Arg[] {
  const args: Arg[] = [];
  const configFile = spec.configFile.trim();
  if (configFile !== "") args.push({ text: "-in", role: "flag" }, { text: configFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, CONFIGUTL_CATALOGUE));
  return args;
}
