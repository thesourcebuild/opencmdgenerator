"use client";

import type { OpensslSpec } from "@cmdgen/openssl";
import { FLAG_GROUP_META, VERIFY_CATALOGUE, setFlag } from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface OpensslVerifyFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

/** Fields for verify — the "Verification" category. */
export function OpensslVerifyFields({ spec, onChange }: OpensslVerifyFieldsProps) {
  if (spec.subcommand !== "verify") {
    // openssl-builder.tsx only ever mounts this component when the current
    // subcommand's category is "verify", so this is unreachable in practice.
    return null;
  }

  return (
    <>
      <Panel title="Certificate(s)" description="Optional — reads from stdin if left empty.">
        <StringListEditor
          items={spec.certFiles}
          onChange={(certFiles) => onChange({ ...spec, certFiles })}
          placeholder="cert.pem"
          addLabel="Add certificate"
          emptyHint="No certificates — reads from stdin."
        />
      </Panel>
      <Panel title="CA file" description="A file of trusted CA certificates to verify against.">
        <input
          value={spec.caFile}
          onChange={(e) => onChange({ ...spec, caFile: e.target.value })}
          placeholder="ca.pem"
          className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </Panel>
      <Panel title="Flags">
        <FlagsForm
          catalogue={VERIFY_CATALOGUE}
          groups={FLAG_GROUP_META}
          flags={spec.flags}
          onChange={(id, value) => onChange(setFlag(spec, id, value))}
        />
      </Panel>
    </>
  );
}
