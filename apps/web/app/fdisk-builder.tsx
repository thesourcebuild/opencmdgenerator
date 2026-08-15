"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { FdiskSpec } from "@cmdgen/fdisk";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/fdisk";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FdiskPreview } from "./fdisk-preview";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export function FdiskBuilder() {
  const [spec, setSpec] = useState<FdiskSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<FdiskSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <FdiskPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Device">
              <div>
                <label className="mb-1 block text-xs font-medium">Device</label>
                <input
                  value={spec.device}
                  onChange={(e) => setSpec((s) => ({ ...s, device: e.target.value }))}
                  placeholder="/dev/sda"
                  className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
                <p className="mt-1 text-[11px] text-slate-400">Leave blank to list every device fdisk can find.</p>
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
        bookmark={{ commandId: "fdisk", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<FdiskSpec>
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
