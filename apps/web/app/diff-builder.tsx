"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { DiffPlatform, DiffSpec } from "@cmdgen/diff";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, flagTag, lint, setFlag } from "@cmdgen/diff";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { DiffPreview } from "./diff-preview";
import { DiffTargetSelector } from "./diff-target-selector";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface DiffBuilderProps {
  initialPlatform: DiffPlatform;
}

export function DiffBuilder({ initialPlatform }: DiffBuilderProps) {
  const [spec, setSpec] = useState<DiffSpec>(() => createSpec({ id: "draft", platform: initialPlatform }));
  const [activePreset, setActivePreset] = useState<Preset<DiffSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <DiffPreview spec={spec} onPlatformChange={(platform) => setSpec((s) => ({ ...s, platform }))} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Files">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">First file</label>
                  <input
                    value={spec.file1}
                    onChange={(e) => setSpec((s) => ({ ...s, file1: e.target.value }))}
                    placeholder="old.txt"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Second file</label>
                  <input
                    value={spec.file2}
                    onChange={(e) => setSpec((s) => ({ ...s, file2: e.target.value }))}
                    placeholder="new.txt"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Flags">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                tag={flagTag(spec.platform)}
                onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "diff", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <DiffTargetSelector value={spec.platform} onChange={(platform) => setSpec((s) => ({ ...s, platform }))} />

                <Panel title="Examples">
                  <PresetsDropdown<DiffSpec>
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
