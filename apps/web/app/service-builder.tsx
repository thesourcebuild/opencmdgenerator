"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ServiceSpec } from "@cmdgen/service";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/service";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { ServicePreview } from "./service-preview";

const ACTIONS = ["start", "stop", "restart", "reload", "status"] as const;

// No Flags panel at all — service has zero catalogue flags (see
// @cmdgen/service/catalogue/flags.ts), same restraint as dd's builder. The
// service to act on and the action to take are both plain spec-level fields
// instead.
export function ServiceBuilder() {
  const [spec, setSpec] = useState<ServiceSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<ServiceSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <ServicePreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Service and action">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Service name</label>
                  <input
                    value={spec.serviceName}
                    onChange={(e) => setSpec((s) => ({ ...s, serviceName: e.target.value }))}
                    placeholder="nginx"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as ServiceSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ACTIONS.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <PresetsDropdown<ServiceSpec>
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
