"use client";

import type { OpensslInputMode, OpensslMacType, OpensslSpec } from "@cmdgen/openssl";
import { DGST_CATALOGUE, FLAG_GROUP_META, MAC_CATALOGUE, setFlag } from "@cmdgen/openssl";
import { Panel, cn } from "@cmdgen/ui";
import { AlgorithmFamilySelect } from "./algorithm-family-select";
import { FlagsForm } from "./flags-form";
import { DIGEST_FAMILIES } from "./openssl-algorithm-families";
import { StringListEditor } from "./string-list-editor";

export interface OpensslDigestFieldsProps {
  spec: OpensslSpec;
  onChange: (next: OpensslSpec) => void;
}

const textInputClass =
  "h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

const tabButtonClass = (active: boolean) =>
  cn(
    "rounded px-2 py-1 text-xs transition-colors",
    active
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
  );

/** Fields for dgst/mac — the "Digests & MAC" category. */
export function OpensslDigestFields({ spec, onChange }: OpensslDigestFieldsProps) {
  if (spec.subcommand === "dgst") {
    return (
      <>
        <Panel title="Algorithm" description="Real dgst renders this as its own bare flag, e.g. -sha256.">
          <AlgorithmFamilySelect
            families={DIGEST_FAMILIES}
            value={spec.algorithm}
            onChange={(algorithm) => onChange({ ...spec, algorithm })}
          />
        </Panel>
        <Panel title="Input">
          <div className="space-y-2">
            <div className="flex gap-1">
              {(
                [
                  ["text", "Text"],
                  ["files", "Files"],
                ] as [OpensslInputMode, string][]
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange({ ...spec, inputMode: mode })}
                  className={tabButtonClass(spec.inputMode === mode)}
                >
                  {label}
                </button>
              ))}
            </div>

            {spec.inputMode === "text" ? (
              <div>
                <textarea
                  value={spec.text}
                  onChange={(e) => onChange({ ...spec, text: e.target.value })}
                  placeholder="Text to hash"
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {spec.shell === "powershell"
                    ? "Piped in byte-exact — delegates through a nested cmd.exe internally, since PowerShell itself has no way to pipe a string into stdin without appending a trailing CRLF."
                    : "Piped in byte-exact — no newline or other character is added, so this matches hashing this text alone."}
                </p>
              </div>
            ) : (
              <StringListEditor
                items={spec.files}
                onChange={(files) => onChange({ ...spec, files })}
                placeholder="file.txt"
                addLabel="Add file"
                emptyHint="No files — reads from stdin."
              />
            )}
          </div>
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={DGST_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "mac") {
    return (
      <>
        <Panel title="MAC type">
          <select
            value={spec.macType}
            onChange={(e) => onChange({ ...spec, macType: e.target.value as OpensslMacType })}
            className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="HMAC">HMAC</option>
            <option value="CMAC">CMAC</option>
          </select>
        </Panel>
        <Panel title="Key" description="Rendered as -macopt key:<value>.">
          <input
            value={spec.keyFile}
            onChange={(e) => onChange({ ...spec, keyFile: e.target.value })}
            placeholder="mysecretkey"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="file.txt"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={MAC_CATALOGUE}
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
  // subcommand's category is "digest", so this is unreachable in practice.
  return null;
}
