"use client";

import type { OpensslSpec } from "@cmdgen/openssl";
import { ASN1PARSE_CATALOGUE, CIPHERS_CATALOGUE, FLAG_GROUP_META, NSEQ_CATALOGUE, VERSION_CATALOGUE, setFlag } from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";

export interface OpensslDiagFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/** Fields for asn1parse/ciphers/errstr/info/list/version/help/rehash/nseq — the "Diagnostics & Info" category (all read-only). */
export function OpensslDiagFields({ spec, onChange }: OpensslDiagFieldsProps) {
  if (spec.subcommand === "asn1parse") {
    return (
      <>
        <Panel title="Input file" description="Optional — reads from stdin if left empty.">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="cert.der"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={ASN1PARSE_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "ciphers") {
    return (
      <>
        <Panel title="Filter" description="A cipher-list spec, e.g. DEFAULT or HIGH:!aNULL — rendered as a bare trailing argument.">
          <input
            value={spec.filter}
            onChange={(e) => onChange({ ...spec, filter: e.target.value })}
            placeholder="DEFAULT"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CIPHERS_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "errstr") {
    return (
      <Panel title="Error code" description="A hex error code from a failed openssl call, e.g. 0906D06C.">
        <input
          value={spec.errorCode}
          onChange={(e) => onChange({ ...spec, errorCode: e.target.value })}
          placeholder="0906D06C"
          className={textInputClass}
        />
      </Panel>
    );
  }

  if (spec.subcommand === "info") {
    return (
      <Panel title="Query" description="Renders directly as its own bare flag, e.g. configdir becomes -configdir.">
        <input
          value={spec.query}
          onChange={(e) => onChange({ ...spec, query: e.target.value })}
          placeholder="configdir"
          className={textInputClass}
        />
      </Panel>
    );
  }

  if (spec.subcommand === "list") {
    return (
      <Panel title="What" description="Renders directly as its own bare flag, e.g. standard-commands becomes -standard-commands.">
        <input
          value={spec.what}
          onChange={(e) => onChange({ ...spec, what: e.target.value })}
          placeholder="standard-commands"
          className={textInputClass}
        />
      </Panel>
    );
  }

  if (spec.subcommand === "version") {
    return (
      <Panel title="Flags">
        <FlagsForm
          catalogue={VERSION_CATALOGUE}
          groups={FLAG_GROUP_META}
          flags={spec.flags}
          onChange={(id, value) => onChange(setFlag(spec, id, value))}
        />
      </Panel>
    );
  }

  if (spec.subcommand === "help") {
    return (
      <Panel title="Topic" description="Optional — a bare trailing argument, only rendered when non-empty.">
        <input
          value={spec.topic}
          onChange={(e) => onChange({ ...spec, topic: e.target.value })}
          placeholder="req"
          className={textInputClass}
        />
      </Panel>
    );
  }

  if (spec.subcommand === "rehash") {
    return (
      <Panel title="Directory" description="Optional — defaults to the standard certificate directories when left empty.">
        <input
          value={spec.dir}
          onChange={(e) => onChange({ ...spec, dir: e.target.value })}
          placeholder="/etc/ssl/certs"
          className={textInputClass}
        />
      </Panel>
    );
  }

  if (spec.subcommand === "nseq") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="certs.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="certs.seq"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={NSEQ_CATALOGUE}
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
  // subcommand's category is "diag", so this is unreachable in practice.
  return null;
}
