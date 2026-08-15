import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type {
  OpensslAsn1parseSpec,
  OpensslCiphersSpec,
  OpensslErrstrSpec,
  OpensslHelpSpec,
  OpensslInfoSpec,
  OpensslListSpec,
  OpensslNseqSpec,
  OpensslRehashSpec,
  OpensslVersionSpec,
} from "../spec";
import {
  ASN1PARSE_CATALOGUE,
  CIPHERS_CATALOGUE,
  ERRSTR_CATALOGUE,
  HELP_CATALOGUE,
  INFO_CATALOGUE,
  LIST_CATALOGUE,
  NSEQ_CATALOGUE,
  REHASH_CATALOGUE,
  VERSION_CATALOGUE,
} from "../catalogue/diag";

export function buildAsn1parseArgv(spec: OpensslAsn1parseSpec): Arg[] {
  const args: Arg[] = [];
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, ASN1PARSE_CATALOGUE));
  return args;
}

/** `filter` is a bare trailing positional and always renders — it has a real default of "DEFAULT". */
export function buildCiphersArgv(spec: OpensslCiphersSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, CIPHERS_CATALOGUE)];
  const filter = spec.filter.trim();
  args.push({ text: filter !== "" ? filter : "DEFAULT", role: "value" });
  return args;
}

/** `errorCode` is a bare trailing positional, only rendered when non-empty. */
export function buildErrstrArgv(spec: OpensslErrstrSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, ERRSTR_CATALOGUE)];
  const errorCode = spec.errorCode.trim();
  if (errorCode !== "") args.push({ text: errorCode, role: "value" });
  return args;
}

/**
 * Real `info` uses one flag per query type (e.g. `-configdir`) rather than a
 * single `-query <name>` flag — `query` is free text so it renders directly
 * as `-${query}`, same technique as `enc`'s `cipher` field in argv/enc.ts.
 */
export function buildInfoArgv(spec: OpensslInfoSpec): Arg[] {
  const args: Arg[] = [];
  const query = spec.query.trim();
  if (query !== "") args.push({ text: `-${query}`, role: "flag" });
  args.push(...buildFlagArgs(spec.flags, INFO_CATALOGUE));
  return args;
}

/** Same field-driven bare-flag technique as `info` above. */
export function buildListArgv(spec: OpensslListSpec): Arg[] {
  const args: Arg[] = [];
  const what = spec.what.trim();
  if (what !== "") args.push({ text: `-${what}`, role: "flag" });
  args.push(...buildFlagArgs(spec.flags, LIST_CATALOGUE));
  return args;
}

export function buildVersionArgv(spec: OpensslVersionSpec): Arg[] {
  return buildFlagArgs(spec.flags, VERSION_CATALOGUE);
}

/** `topic` is a bare trailing positional, only rendered when non-empty. */
export function buildHelpArgv(spec: OpensslHelpSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, HELP_CATALOGUE)];
  const topic = spec.topic.trim();
  if (topic !== "") args.push({ text: topic, role: "value" });
  return args;
}

/** `dir` is a bare trailing positional, only rendered when non-empty (defaults to standard cert directories). */
export function buildRehashArgv(spec: OpensslRehashSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, REHASH_CATALOGUE)];
  const dir = spec.dir.trim();
  if (dir !== "") args.push({ text: dir, role: "path" });
  return args;
}

export function buildNseqArgv(spec: OpensslNseqSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, NSEQ_CATALOGUE)];
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}
