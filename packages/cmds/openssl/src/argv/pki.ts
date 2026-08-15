import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { OpensslCmpSpec, OpensslCmsSpec, OpensslEchSpec, OpensslFipsinstallSpec, OpensslOcspSpec, OpensslTsSpec } from "../spec";
import { CMP_CATALOGUE, CMS_CATALOGUE, ECH_CATALOGUE, FIPSINSTALL_CATALOGUE, OCSP_CATALOGUE, TS_CATALOGUE } from "../catalogue/pki";

/** Real argv: `ocsp -issuer file -cert file -url url [flags]`. */
export function buildOcspArgv(spec: OpensslOcspSpec): Arg[] {
  const args: Arg[] = [];
  const issuerFile = spec.issuerFile.trim();
  if (issuerFile !== "") args.push({ text: "-issuer", role: "flag" }, { text: issuerFile, role: "path" });
  const certFile = spec.certFile.trim();
  if (certFile !== "") args.push({ text: "-cert", role: "flag" }, { text: certFile, role: "path" });
  const url = spec.url.trim();
  if (url !== "") args.push({ text: "-url", role: "flag" }, { text: url, role: "value" });
  args.push(...buildFlagArgs(spec.flags, OCSP_CATALOGUE));
  return args;
}

const TS_ACTION_TOKEN: Record<OpensslTsSpec["action"], string> = {
  query: "-query",
  reply: "-reply",
  verify: "-verify",
};

/**
 * `action` picks between three structurally distinct real invocations of
 * `ts` sharing one binary name — the driving flag is rendered directly from
 * the spec field (not a catalogue flag), same pattern as `@cmdgen/git`'s
 * `tag`/`stash` action handling (see `argv/tags.ts`). `-CAfile`/`-data` are
 * gated to their real action via `availableOn` (passed here as `tag`).
 */
export function buildTsArgv(spec: OpensslTsSpec): Arg[] {
  const args: Arg[] = [{ text: TS_ACTION_TOKEN[spec.action], role: "flag" }];
  args.push(...buildFlagArgs(spec.flags, TS_CATALOGUE, { tag: spec.action }));
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

/** Real argv: `cmp -server host:port [flags]`. */
export function buildCmpArgv(spec: OpensslCmpSpec): Arg[] {
  const args: Arg[] = [];
  const server = spec.server.trim();
  if (server !== "") args.push({ text: "-server", role: "flag" }, { text: server, role: "value" });
  args.push(...buildFlagArgs(spec.flags, CMP_CATALOGUE));
  return args;
}

const CMS_ACTION_TOKEN: Record<OpensslCmsSpec["action"], string> = {
  encrypt: "-encrypt",
  decrypt: "-decrypt",
  sign: "-sign",
  verify: "-verify",
};

/**
 * `action` picks between four structurally distinct real invocations of
 * `cms`, same shape as `ts` above — one bare driving flag, rendered directly
 * from the spec field. `-recip`/`-signer`/`-inkey` are gated to their real
 * action(s) via `availableOn`.
 */
export function buildCmsArgv(spec: OpensslCmsSpec): Arg[] {
  const args: Arg[] = [{ text: CMS_ACTION_TOKEN[spec.action], role: "flag" }];
  args.push(...buildFlagArgs(spec.flags, CMS_CATALOGUE, { tag: spec.action }));
  const inFile = spec.inFile.trim();
  if (inFile !== "") args.push({ text: "-in", role: "flag" }, { text: inFile, role: "path" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  return args;
}

/** Real argv: `fipsinstall -out file -module file [flags]`. */
export function buildFipsinstallArgv(spec: OpensslFipsinstallSpec): Arg[] {
  const args: Arg[] = [];
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  const moduleFile = spec.moduleFile.trim();
  if (moduleFile !== "") args.push({ text: "-module", role: "flag" }, { text: moduleFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, FIPSINSTALL_CATALOGUE));
  return args;
}

/** Real argv: `ech -public_name name -out file [flags]`. */
export function buildEchArgv(spec: OpensslEchSpec): Arg[] {
  const args: Arg[] = [];
  const publicName = spec.publicName.trim();
  if (publicName !== "") args.push({ text: "-public_name", role: "flag" }, { text: publicName, role: "value" });
  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") args.push({ text: "-out", role: "flag" }, { text: outputFile, role: "path" });
  args.push(...buildFlagArgs(spec.flags, ECH_CATALOGUE));
  return args;
}
