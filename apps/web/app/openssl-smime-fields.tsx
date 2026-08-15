"use client";

import type { OpensslSmimeAction, OpensslSpec } from "@cmdgen/openssl";
import {
  CONFIGUTL_CATALOGUE,
  FLAG_GROUP_META,
  SKEYUTL_CATALOGUE,
  SMIME_CATALOGUE,
  SPKAC_CATALOGUE,
  SRP_CATALOGUE,
  STOREUTL_CATALOGUE,
  setFlag,
} from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";

export interface OpensslSmimeFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

const SMIME_ACTION_LABEL: Record<OpensslSmimeAction, string> = {
  sign: "sign — attach a signature (default)",
  encrypt: "encrypt — encrypt to a recipient's certificate",
  decrypt: "decrypt — decrypt with a private key",
  verify: "verify — check a signature",
};

/** Fields for smime/spkac/srp/storeutl/skeyutl/configutl — the "Secure Messaging & Legacy" and "Store & Key Utilities" categories. */
export function OpensslSmimeFields({ spec, onChange }: OpensslSmimeFieldsProps) {
  if (spec.subcommand === "smime") {
    return (
      <>
        <Panel title="Action">
          <select
            value={spec.action}
            onChange={(e) => onChange({ ...spec, action: e.target.value as OpensslSmimeAction })}
            className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(SMIME_ACTION_LABEL) as OpensslSmimeAction[]).map((action) => (
              <option key={action} value={action}>
                {SMIME_ACTION_LABEL[action]}
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
            catalogue={SMIME_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "spkac") {
    return (
      <>
        <Panel title="Key file">
          <input
            value={spec.keyFile}
            onChange={(e) => onChange({ ...spec, keyFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Challenge">
          <input
            value={spec.challenge}
            onChange={(e) => onChange({ ...spec, challenge: e.target.value })}
            placeholder="hunter2"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={SPKAC_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "srp") {
    return (
      <>
        <Panel title="Username">
          <input
            value={spec.username}
            onChange={(e) => onChange({ ...spec, username: e.target.value })}
            placeholder="alice"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={SRP_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "storeutl") {
    return (
      <>
        <Panel title="Store URI">
          <input
            value={spec.uri}
            onChange={(e) => onChange({ ...spec, uri: e.target.value })}
            placeholder="store.p12"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={STOREUTL_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "skeyutl") {
    return (
      <>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="key.bin"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={SKEYUTL_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "configutl") {
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
        <Panel title="Flags">
          <FlagsForm
            catalogue={CONFIGUTL_CATALOGUE}
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
  // subcommand's category is "smime" or "store", so this is unreachable in practice.
  return null;
}
