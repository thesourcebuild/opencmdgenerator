"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ShutdownSpec } from "@cmdgen/shutdown";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/shutdown";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { ShutdownPreview } from "./shutdown-preview";

const ACTIONS = ["schedule", "cancel"] as const;

export function ShutdownBuilder() {
  const [spec, setSpec] = useState<ShutdownSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<ShutdownSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <ShutdownPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as ShutdownSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ACTIONS.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>

                {spec.action === "schedule" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium">Time</label>
                    <input
                      value={spec.time}
                      onChange={(e) => setSpec((s) => ({ ...s, time: e.target.value }))}
                      placeholder="now, +5, or 15:30"
                      className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium">Wall message (optional)</label>
                  <input
                    value={spec.message}
                    onChange={(e) => setSpec((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Maintenance starting soon"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            {spec.action === "schedule" && (
              <Panel title="Flags">
                <FlagsForm
                  catalogue={CATALOGUE}
                  groups={FLAG_GROUP_META}
                  flags={spec.flags}
                  onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
                />
              </Panel>
            )}
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "shutdown", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<ShutdownSpec>
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
