"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { AptSpec } from "@cmdgen/apt";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/apt";
import { Panel } from "@cmdgen/ui";
import { AptPreview } from "./apt-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export function AptBuilder() {
  const [spec, setSpec] = useState<AptSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<AptSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <AptPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action">
              <div>
                <label className="mb-1 block text-xs font-medium">Action</label>
                <select
                  value={spec.action}
                  onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as AptSpec["action"] }))}
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="install">install</option>
                  <option value="remove">remove</option>
                  <option value="update">update</option>
                  <option value="upgrade">upgrade</option>
                  <option value="search">search</option>
                  <option value="list">list</option>
                </select>
              </div>
            </Panel>

            <Panel title="Packages">
              <StringListEditor
                items={spec.packages}
                onChange={(packages) => setSpec((s) => ({ ...s, packages }))}
                placeholder="nginx"
                addLabel="Add package"
                emptyHint="No packages added — install, remove, and search need at least one package name (update, upgrade, and list do not)."
              />
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
                <Panel title="Examples">
                  <PresetsDropdown<AptSpec>
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
