"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { RpmSpec } from "@cmdgen/rpm";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/rpm";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { RpmPreview } from "./rpm-preview";

export function RpmBuilder() {
  const [spec, setSpec] = useState<RpmSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<RpmSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <RpmPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Operation">
              <div>
                <label className="mb-1 block text-xs font-medium">Operation</label>
                <select
                  value={spec.operation}
                  onChange={(e) => setSpec((s) => ({ ...s, operation: e.target.value as RpmSpec["operation"] }))}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="install">Install (-i)</option>
                  <option value="erase">Erase (-e)</option>
                  <option value="query">Query (-q)</option>
                  <option value="queryAll">Query all (-qa)</option>
                </select>
              </div>
            </Panel>

            <Panel title="Target">
              <div>
                <label className="mb-1 block text-xs font-medium">Target</label>
                <input
                  value={spec.target}
                  onChange={(e) => setSpec((s) => ({ ...s, target: e.target.value }))}
                  disabled={spec.operation === "queryAll"}
                  placeholder="package.rpm or package-name"
                  className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950"
                />
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
                  <PresetsDropdown<RpmSpec>
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
