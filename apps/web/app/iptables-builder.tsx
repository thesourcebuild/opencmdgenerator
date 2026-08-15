"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { IptablesSpec } from "@cmdgen/iptables";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/iptables";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { IptablesPreview } from "./iptables-preview";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

// No Flags panel at all — iptables has zero catalogue flags (see
// @cmdgen/iptables/catalogue/flags.ts), same restraint as dd/ps/top omitting
// a Files/Flags panel. Every field below is a spec-level field instead,
// built manually in build/argv.ts rather than through the catalogue.
export function IptablesBuilder() {
  const [spec, setSpec] = useState<IptablesSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<IptablesSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <IptablesPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Chain and action">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Chain</label>
                  <select
                    value={spec.chain}
                    onChange={(e) => setSpec((s) => ({ ...s, chain: e.target.value as IptablesSpec["chain"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="INPUT">INPUT</option>
                    <option value="OUTPUT">OUTPUT</option>
                    <option value="FORWARD">FORWARD</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as IptablesSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="append">append (-A)</option>
                    <option value="insert">insert (-I)</option>
                    <option value="delete">delete (-D)</option>
                  </select>
                </div>
              </div>
            </Panel>

            <Panel
              title="Match criteria"
              description="A destination port needs an explicit protocol (tcp or udp) to have any effect."
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Protocol</label>
                  <select
                    value={spec.protocol}
                    onChange={(e) =>
                      setSpec((s) => ({ ...s, protocol: e.target.value as IptablesSpec["protocol"] }))
                    }
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="any">any</option>
                    <option value="tcp">tcp</option>
                    <option value="udp">udp</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Destination port (--dport)</label>
                  <input
                    value={spec.port}
                    onChange={(e) => setSpec((s) => ({ ...s, port: e.target.value }))}
                    placeholder="22"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Source (-s)</label>
                  <input
                    value={spec.source}
                    onChange={(e) => setSpec((s) => ({ ...s, source: e.target.value }))}
                    placeholder="1.2.3.4"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Target">
              <div>
                <label className="mb-1 block text-xs font-medium">Jump (-j)</label>
                <select
                  value={spec.jumpTarget}
                  onChange={(e) =>
                    setSpec((s) => ({ ...s, jumpTarget: e.target.value as IptablesSpec["jumpTarget"] }))
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="ACCEPT">ACCEPT</option>
                  <option value="DROP">DROP</option>
                  <option value="REJECT">REJECT</option>
                </select>
              </div>
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
                  <PresetsDropdown<IptablesSpec>
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
