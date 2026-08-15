"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SshKeygenSpec } from "@cmdgen/ssh-keygen";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/ssh-keygen";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { SshKeygenPreview } from "./ssh-keygen-preview";

export function SshKeygenBuilder() {
  const [spec, setSpec] = useState<SshKeygenSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SshKeygenSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SshKeygenPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Key">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Key type</label>
                  <select
                    value={spec.keyType}
                    onChange={(e) => setSpec((s) => ({ ...s, keyType: e.target.value as SshKeygenSpec["keyType"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="ed25519">ed25519 (recommended)</option>
                    <option value="rsa">rsa</option>
                    <option value="ecdsa">ecdsa</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Bits (rsa/ecdsa only)</label>
                  <input
                    value={spec.bits}
                    onChange={(e) => setSpec((s) => ({ ...s, bits: e.target.value }))}
                    placeholder="4096"
                    disabled={spec.keyType === "ed25519"}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium">Output file</label>
                  <input
                    value={spec.outputFile}
                    onChange={(e) => setSpec((s) => ({ ...s, outputFile: e.target.value }))}
                    placeholder="~/.ssh/id_ed25519"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium">Comment</label>
                  <input
                    value={spec.comment}
                    onChange={(e) => setSpec((s) => ({ ...s, comment: e.target.value }))}
                    placeholder="user@host"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={spec.setPassphrase}
                      onChange={(e) => setSpec((s) => ({ ...s, setPassphrase: e.target.checked }))}
                    />
                    Set a passphrase explicitly (-N)
                  </label>
                  <input
                    value={spec.passphrase}
                    onChange={(e) => setSpec((s) => ({ ...s, passphrase: e.target.value }))}
                    placeholder="Leave blank for no passphrase — a real footgun for a personal key"
                    disabled={!spec.setPassphrase}
                    className="mt-1 h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Flags">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Presets">
                  <PresetsDropdown<SshKeygenSpec>
                    presets={PRESETS}
                    spec={spec}
                    onApply={setSpec}
                    onSelectPreset={setActivePreset}
                  />
                </Panel>

                <DiagnosticsPanel spec={spec} result={lint(spec)} onApplyFix={setSpec} />
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
