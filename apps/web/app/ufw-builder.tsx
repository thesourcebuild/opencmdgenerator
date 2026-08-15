"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { UfwSpec } from "@cmdgen/ufw";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/ufw";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { UfwPreview } from "./ufw-preview";

// No Flags panel at all — ufw has zero catalogue flags (see
// @cmdgen/ufw/catalogue/flags.ts), same restraint as @cmdgen/dd omitting one.
// Every field below (mode, port, protocol) is a spec-level field instead.
export function UfwBuilder() {
  const [spec, setSpec] = useState<UfwSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<UfwSpec> | null>(null);

  const showPort = spec.mode === "allow" || spec.mode === "deny" || spec.mode === "deleteAllow";

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <UfwPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Mode">
              <div>
                <label className="mb-1 block text-xs font-medium">Mode</label>
                <select
                  value={spec.mode}
                  onChange={(e) => setSpec((s) => ({ ...s, mode: e.target.value as UfwSpec["mode"] }))}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="status">status</option>
                  <option value="enable">enable</option>
                  <option value="disable">disable</option>
                  <option value="allow">allow</option>
                  <option value="deny">deny</option>
                  <option value="deleteAllow">delete allow</option>
                </select>
              </div>
            </Panel>

            {showPort && (
              <Panel
                title="Port and protocol"
                description="Used only by allow, deny, and delete allow. 'any' matches both tcp and udp and is rendered as a bare port number."
              >
                <div className="space-y-3">
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
                    <label className="mb-1 block text-xs font-medium">Protocol</label>
                    <select
                      value={spec.protocol}
                      onChange={(e) => setSpec((s) => ({ ...s, protocol: e.target.value as UfwSpec["protocol"] }))}
                      className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="any">any</option>
                      <option value="tcp">tcp</option>
                      <option value="udp">udp</option>
                    </select>
                  </div>
                </div>
              </Panel>
            )}
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "ufw", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<UfwSpec>
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
