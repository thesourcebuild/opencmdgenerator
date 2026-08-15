"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SystemctlSpec } from "@cmdgen/systemctl";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/systemctl";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { SystemctlPreview } from "./systemctl-preview";

const ACTIONS = ["start", "stop", "restart", "reload", "enable", "disable", "status", "is-active", "daemon-reload"] as const;

// No Flags panel at all — systemctl has zero catalogue flags (see
// @cmdgen/systemctl/catalogue/flags.ts), same restraint as service's builder.
// The unit to act on and the action to take are both plain spec-level fields
// instead.
export function SystemctlBuilder() {
  const [spec, setSpec] = useState<SystemctlSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SystemctlSpec> | null>(null);
  const needsUnit = spec.action !== "daemon-reload";

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SystemctlPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action and unit">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as SystemctlSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ACTIONS.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
                {needsUnit && (
                  <div>
                    <label className="mb-1 block text-xs font-medium">Unit</label>
                    <input
                      value={spec.unit}
                      onChange={(e) => setSpec((s) => ({ ...s, unit: e.target.value }))}
                      placeholder="nginx"
                      className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                )}
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
                <Panel title="Examples">
                  <PresetsDropdown<SystemctlSpec>
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
