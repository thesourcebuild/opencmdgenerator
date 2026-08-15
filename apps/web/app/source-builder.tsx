"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SourceSpec } from "@cmdgen/source";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/source";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { SourcePreview } from "./source-preview";
import { StringListEditor } from "./string-list-editor";

export function SourceBuilder() {
  const [spec, setSpec] = useState<SourceSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SourceSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SourcePreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Script">
              <div>
                <label className="mb-1 block text-xs font-medium">File</label>
                <input
                  value={spec.file}
                  onChange={(e) => setSpec((s) => ({ ...s, file: e.target.value }))}
                  placeholder="~/.bashrc"
                  className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </Panel>

            <Panel title="Arguments" description="Passed to the script — exposed inside it as $1, $2, ...">
              <StringListEditor
                items={spec.args}
                onChange={(args) => setSpec((s) => ({ ...s, args }))}
                placeholder="production"
                addLabel="Add argument"
                emptyHint="No arguments added."
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
                  <PresetsDropdown<SourceSpec>
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
