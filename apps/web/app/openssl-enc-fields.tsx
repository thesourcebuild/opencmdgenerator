"use client";

import type { OpensslInputMode, OpensslSpec } from "@cmdgen/openssl";
import { ENC_CATALOGUE, FLAG_GROUP_META, PKEYUTL_CATALOGUE, RSAUTL_CATALOGUE, setFlag } from "@cmdgen/openssl";
import { Panel, cn } from "@cmdgen/ui";
import { AlgorithmFamilySelect } from "./algorithm-family-select";
import { FlagsForm } from "./flags-form";
import { CIPHER_FAMILIES } from "./openssl-algorithm-families";

export interface OpensslEncFieldsProps {
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

/** Fields for enc/rsautl/pkeyutl — the "Encryption & Decryption" category. */
export function OpensslEncFields({ spec, onChange }: OpensslEncFieldsProps) {
  if (spec.subcommand === "enc") {
    return (
      <>
        <Panel title="Cipher" description="Real enc renders this as its own bare flag, e.g. -aes-256-cbc.">
          <AlgorithmFamilySelect
            families={CIPHER_FAMILIES}
            value={spec.cipher}
            onChange={(cipher) => onChange({ ...spec, cipher })}
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
                  placeholder="Text to encrypt"
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {spec.shell === "powershell"
                    ? "Piped in byte-exact — delegates through a nested cmd.exe internally, since PowerShell itself has no way to pipe a string into stdin without appending a trailing CRLF."
                    : "Piped in byte-exact — no newline or other character is added, so this encrypts this text alone."}
                </p>
              </div>
            ) : (
              <div>
                <input
                  value={spec.inFile}
                  onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
                  placeholder="file.txt"
                  className={textInputClass}
                />
                <p className="mt-1 text-[11px] text-slate-400">Leave blank to read from stdin.</p>
              </div>
            )}
          </div>
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="file.txt.enc"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={ENC_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "rsautl" || spec.subcommand === "pkeyutl") {
    const catalogue = spec.subcommand === "rsautl" ? RSAUTL_CATALOGUE : PKEYUTL_CATALOGUE;
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
        <Panel title="Input file">
          <input
            value={spec.inFile}
            onChange={(e) => onChange({ ...spec, inFile: e.target.value })}
            placeholder="file.bin"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Output file">
          <input
            value={spec.outputFile}
            onChange={(e) => onChange({ ...spec, outputFile: e.target.value })}
            placeholder="out.bin"
            className={textInputClass}
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={catalogue}
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
  // subcommand's category is "enc", so this is unreachable in practice.
  return null;
}
