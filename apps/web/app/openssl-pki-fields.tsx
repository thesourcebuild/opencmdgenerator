"use client";

import type { OpensslCmsAction, OpensslSpec, OpensslTsAction } from "@cmdgen/openssl";
import {
  CMP_CATALOGUE,
  CMS_CATALOGUE,
  ECH_CATALOGUE,
  FIPSINSTALL_CATALOGUE,
  FLAG_GROUP_META,
  OCSP_CATALOGUE,
  TS_CATALOGUE,
  setFlag,
} from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";

export interface OpensslPkiFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";
const selectClass =
  "h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

const TS_ACTION_LABEL: Record<OpensslTsAction, string> = {
  query: "query — create a timestamp request",
  reply: "reply — create a timestamp reply for a request (TSA-side)",
  verify: "verify — check a timestamp on a response",
};

const CMS_ACTION_LABEL: Record<OpensslCmsAction, string> = {
  encrypt: "encrypt — encrypt content to a recipient",
  decrypt: "decrypt — decrypt content addressed to you",
  sign: "sign — produce a CMS signature",
  verify: "verify — check a CMS signature",
};

/** Fields for ocsp/ts/cmp/cms/fipsinstall/ech — the "PKI Protocols" and "Advanced/Misc" categories. */
export function OpensslPkiFields({ spec, onChange }: OpensslPkiFieldsProps) {
  if (spec.subcommand === "ocsp") {
    return (
      <>
        <Panel title="Issuer certificate" description="The certificate of the CA that issued the certificate being checked.">
          <input
            value={spec.issuerFile}
            onChange={(e) => onChange({ ...spec, issuerFile: e.target.value })}
            placeholder="issuer.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Certificate" description="The certificate whose revocation status is being checked.">
          <input
            value={spec.certFile}
            onChange={(e) => onChange({ ...spec, certFile: e.target.value })}
            placeholder="cert.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Responder URL">
          <input
            value={spec.url}
            onChange={(e) => onChange({ ...spec, url: e.target.value })}
            placeholder="http://ocsp.example.com"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={OCSP_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "ts") {
    return (
      <>
        <Panel title="Action">
          <select
            value={spec.action}
            onChange={(e) => onChange({ ...spec, action: e.target.value as OpensslTsAction })}
            className={selectClass}
          >
            {(Object.keys(TS_ACTION_LABEL) as OpensslTsAction[]).map((action) => (
              <option key={action} value={action}>
                {TS_ACTION_LABEL[action]}
              </option>
            ))}
          </select>
        </Panel>
        <Panel
          title="Input file"
          description={
            spec.action === "verify"
              ? "The timestamp response to verify."
              : spec.action === "reply"
                ? "The timestamp request to reply to."
                : "The existing request to use, or leave blank and set -data below."
          }
        >
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder={spec.action === "verify" ? "response.tsr" : spec.action === "reply" ? "request.tsq" : "request.tsq"}
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder={spec.action === "query" ? "request.tsq" : spec.action === "reply" ? "response.tsr" : "out.txt"}
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={TS_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            tag={spec.action}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "cmp") {
    return (
      <>
        <Panel title="Server" description="The CMP server to contact, as host:port.">
          <input
            value={spec.server}
            onChange={(e) => onChange({ ...spec, server: e.target.value })}
            placeholder="cmp.example.com:80"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CMP_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "cms") {
    return (
      <>
        <Panel title="Action">
          <select
            value={spec.action}
            onChange={(e) => onChange({ ...spec, action: e.target.value as OpensslCmsAction })}
            className={selectClass}
          >
            {(Object.keys(CMS_ACTION_LABEL) as OpensslCmsAction[]).map((action) => (
              <option key={action} value={action}>
                {CMS_ACTION_LABEL[action]}
              </option>
            ))}
          </select>
        </Panel>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="message.txt"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="message.p7s"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CMS_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            tag={spec.action}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "fipsinstall") {
    return (
      <>
        <Panel title="Output file" description="Where to write the generated FIPS config section.">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="fipsmodule.cnf"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Module file" description="The FIPS provider module (.so/.dll) being installed.">
          <input
            value={spec.moduleFile}
            onChange={(e) => onChange({ ...spec, moduleFile: e.target.value })}
            placeholder="fips.so"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={FIPSINSTALL_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "ech") {
    return (
      <>
        <Panel title="Public name" description="The public_name value embedded in the ECH config.">
          <input
            value={spec.publicName}
            onChange={(e) => onChange({ ...spec, publicName: e.target.value })}
            placeholder="example.com"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="ech.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={ECH_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  // Every other subcommand belongs to a different category's fields panel —
  // openssl-builder.tsx only ever mounts this component when the current
  // subcommand's category is "pki" or "advanced", so this is unreachable in practice.
  return null;
}
