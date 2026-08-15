"use client";

import type { OpensslSpec } from "@cmdgen/openssl";
import { FLAG_GROUP_META, KDF_CATALOGUE, PASSWD_CATALOGUE, PKCS12_CATALOGUE, PKCS7_CATALOGUE, PKCS8_CATALOGUE, setFlag } from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface OpensslPkcsFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/** Fields for pkcs12/pkcs7/pkcs8/passwd/kdf — the "PKCS Containers" and "Password & KDF" categories. */
export function OpensslPkcsFields({ spec, onChange }: OpensslPkcsFieldsProps) {
  if (spec.subcommand === "pkcs12") {
    const exporting = spec.flags.export === true;
    return (
      <>
        <Panel title="Flags" description="-export switches between bundling a .p12 (export) and pulling one apart (extract).">
          <FlagsForm
            catalogue={PKCS12_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
        {exporting ? (
          <>
            <Panel title="Key file" description="Rendered as -inkey — the private key to bundle in.">
              <input
                value={spec.keyFile}
                onChange={(e) => onChange({ ...spec, keyFile: e.target.value })}
                placeholder="key.pem"
                className={textInputClass}
              />
            </Panel>
            <Panel title="Certificate file" description="Rendered as -in — the certificate to bundle in.">
              <input
                value={spec.certFile}
                onChange={(e) => onChange({ ...spec, certFile: e.target.value })}
                placeholder="cert.pem"
                className={textInputClass}
              />
            </Panel>
          </>
        ) : (
          <Panel title="Input .p12/.pfx file" description="Rendered as -in — the bundle being extracted from.">
            <input
              value={spec.inFile}
              onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
              placeholder="bundle.p12"
              className={textInputClass}
            />
          </Panel>
        )}
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder={exporting ? "bundle.p12" : "key.pem"}
            className={textInputClass}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "pkcs7") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="bundle.p7b"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="out.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={PKCS7_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "pkcs8") {
    return (
      <>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="key.pem"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="key.p8"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags" description="-topk8 converts TO PKCS#8; without it, pkcs8 converts a PKCS#8 key back to traditional format.">
          <FlagsForm
            catalogue={PKCS8_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "passwd") {
    return (
      <>
        <Panel title="Passwords" description="Bare trailing positionals, rendered one after another in order.">
          <StringListEditor
            items={spec.passwords}
            onChange={(passwords) => onChange({ ...spec, passwords })}
            placeholder="hunter2"
            addLabel="Add password"
            emptyHint="No passwords — real passwd would prompt interactively."
          />
        </Panel>
        <Panel title="Flags" description="-6/-5/-1/-apr1 select the hash algorithm and are mutually exclusive.">
          <FlagsForm
            catalogue={PASSWD_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "kdf") {
    return (
      <>
        <Panel title="KDF name" description="Rendered as a bare trailing positional, e.g. PBKDF2.">
          <input
            value={spec.kdfName}
            onChange={(e) => onChange({ ...spec, kdfName: e.target.value })}
            placeholder="PBKDF2"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Key length" description="Rendered as -keylen.">
          <input
            type="number"
            value={spec.keyLength}
            onChange={(e) => onChange({ ...spec, keyLength: Number(e.target.value) })}
            placeholder="32"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={KDF_CATALOGUE}
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
  // subcommand's category is "pkcs" or "passwd", so this is unreachable in practice.
  return null;
}
