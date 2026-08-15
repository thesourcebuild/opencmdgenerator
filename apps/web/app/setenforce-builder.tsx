"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SetenforceSpec } from "@cmdgen/setenforce";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/setenforce";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { SetenforcePreview } from "./setenforce-preview";

// No Flags panel at all — setenforce has zero catalogue flags (see
// @cmdgen/setenforce/catalogue/flags.ts). Its one real field, `mode`, is a
// spec-level enum rendered directly, same restraint as @cmdgen/iptables's
// builder omitting a Flags panel.
export function SetenforceBuilder() {
  const [spec, setSpec] = useState<SetenforceSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SetenforceSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SetenforcePreview spec={spec} />
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
                  onChange={(e) => setSpec((s) => ({ ...s, mode: e.target.value as SetenforceSpec["mode"] }))}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="Enforcing">Enforcing</option>
                  <option value="Permissive">Permissive</option>
                </select>
              </div>
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "setenforce", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<SetenforceSpec>
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
