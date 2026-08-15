"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SshSpec } from "@cmdgen/ssh";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/ssh";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { ShellDialectTargetSelector } from "./shell-dialect-selector";
import { SshPreview } from "./ssh-preview";

export interface SshBuilderProps {
  initialShell: ShellDialect;
}

export function SshBuilder({ initialShell }: SshBuilderProps) {
  const [spec, setSpec] = useState<SshSpec>(() => createSpec({ id: "draft", shell: initialShell }));
  const [activePreset, setActivePreset] = useState<Preset<SshSpec> | null>(null);
  const onShellChange = (shell: SshSpec["shell"]) => setSpec((s) => ({ ...s, shell }));

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SshPreview spec={spec} onShellChange={onShellChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Connect to">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Host</label>
                  <input
                    value={spec.host}
                    onChange={(e) => setSpec((s) => ({ ...s, host: e.target.value }))}
                    placeholder="example.com"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">User</label>
                  <input
                    value={spec.user}
                    onChange={(e) => setSpec((s) => ({ ...s, user: e.target.value }))}
                    placeholder="(current user)"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Port</label>
                  <input
                    value={spec.port}
                    onChange={(e) => setSpec((s) => ({ ...s, port: e.target.value }))}
                    placeholder="22"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Identity file</label>
                  <input
                    value={spec.identityFile}
                    onChange={(e) => setSpec((s) => ({ ...s, identityFile: e.target.value }))}
                    placeholder="~/.ssh/id_ed25519"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium">Remote command (optional)</label>
                  <input
                    value={spec.remoteCommand}
                    onChange={(e) => setSpec((s) => ({ ...s, remoteCommand: e.target.value }))}
                    placeholder="Leave blank for an interactive login shell"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
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
        bookmark={{ commandId: "ssh", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <ShellDialectTargetSelector value={spec.shell} onChange={onShellChange} />

                <Panel title="Examples">
                  <PresetsDropdown<SshSpec>
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
