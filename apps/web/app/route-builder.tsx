"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { RouteSpec } from "@cmdgen/route";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/route";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { RoutePreview } from "./route-preview";

const ACTIONS = ["show", "add", "delete"] as const;

// No Flags panel at all — route has zero catalogue flags (see
// @cmdgen/route/catalogue/flags.ts), same restraint as service's builder.
// The action to take and the destination/gateway to act on are all plain
// spec-level fields instead.
export function RouteBuilder() {
  const [spec, setSpec] = useState<RouteSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<RouteSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <RoutePreview spec={spec} />
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
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as RouteSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ACTIONS.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
                {spec.action !== "show" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium">Destination</label>
                      <input
                        value={spec.destination}
                        onChange={(e) => setSpec((s) => ({ ...s, destination: e.target.value }))}
                        placeholder="192.168.1.0/24"
                        className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">Gateway (optional)</label>
                      <input
                        value={spec.gateway}
                        onChange={(e) => setSpec((s) => ({ ...s, gateway: e.target.value }))}
                        placeholder="192.168.1.1"
                        className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>
                  </>
                )}
              </div>
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "route", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<RouteSpec>
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
