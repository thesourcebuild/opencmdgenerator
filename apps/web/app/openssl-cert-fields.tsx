"use client";

import type { OpensslSpec } from "@cmdgen/openssl";
import { CA_CATALOGUE, CRL2PKCS7_CATALOGUE, CRL_CATALOGUE, FLAG_GROUP_META, REQ_CATALOGUE, X509_CATALOGUE, setFlag } from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface OpensslCertFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/** Fields for req/ca/x509/crl/crl2pkcs7 — the "Certificate Requests & CA" and "Certificate & CRL Management" categories. */
export function OpensslCertFields({ spec, onChange }: OpensslCertFieldsProps) {
  if (spec.subcommand === "req") {
    return (
      <>
        <Panel title="Key file" description="An existing private key — only used when no new-key spec is given below.">
          <input
            value={spec.keyFile}
            onChange={(e) => onChange({ ...spec, keyFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="New key spec" description="-newkey — generates a fresh key alongside the request, e.g. rsa:2048.">
          <input
            value={spec.newKeySpec}
            onChange={(e) => onChange({ ...spec, newKeySpec: e.target.value })}
            placeholder="rsa:2048"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="csr.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Subject" description="-subj, e.g. /CN=example.com.">
          <input
            value={spec.subject}
            onChange={(e) => onChange({ ...spec, subject: e.target.value })}
            placeholder="/CN=example.com"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={REQ_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "ca") {
    return (
      <>
        <Panel title="Config file">
          <input
            value={spec.configFile}
            onChange={(e) => onChange({ ...spec, configFile: e.target.value })}
            placeholder="openssl.cnf"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Input file" description="The certificate signing request being signed.">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="csr.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="cert.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CA_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "x509") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="csr.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="cert.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Sign key file" description="-signkey — self-signs the input (typically a CSR) with this private key.">
          <input
            value={spec.signKeyFile}
            onChange={(e) => onChange({ ...spec, signKeyFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Days" description="Only rendered together with a sign key file.">
          <input
            type="number"
            value={spec.days}
            onChange={(e) => onChange({ ...spec, days: Number(e.target.value) })}
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={X509_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "crl") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="crl.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="crl.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CRL_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "crl2pkcs7") {
    return (
      <>
        <Panel title="CRL file">
          <input
            value={spec.crlFile}
            onChange={(e) => onChange({ ...spec, crlFile: e.target.value })}
            placeholder="crl.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Certificate files" description="Real crl2pkcs7 repeats -certfile once per file.">
          <StringListEditor
            items={spec.certFiles}
            onChange={(certFiles) => onChange({ ...spec, certFiles })}
            placeholder="cert.pem"
            addLabel="Add certificate"
            emptyHint="No certificate files added yet."
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="bundle.p7b"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CRL2PKCS7_CATALOGUE}
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
  // subcommand's category is "csr" or "cert".
  return null;
}
