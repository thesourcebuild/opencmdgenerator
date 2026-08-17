"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ExportPlatform, ExportSpec } from "@cmdgen/export";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/export";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { ExportPreview } from "./export-preview";
import { ExportTargetSelector } from "./export-target-selector";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface ExportBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: ExportPlatform;
  onPlatformChange: (next: ExportPlatform) => void;
}

export function ExportBuilder({ platform, onPlatformChange }: ExportBuilderProps) {
  const [draft, setDraft] = useState<ExportSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<ExportSpec> | null>(null);

  const spec: ExportSpec = { ...draft, platform };

  function setSpec(update: ExportSpec | ((prev: ExportSpec) => ExportSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <ExportPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Variable">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Name</label>
                  <input
                    value={spec.varName}
                    onChange={(e) => setSpec((s) => ({ ...s, varName: e.target.value }))}
                    placeholder="API_URL"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Value</label>
                  <input
                    value={spec.value}
                    onChange={(e) => setSpec((s) => ({ ...s, value: e.target.value }))}
                    placeholder="https://api.example.com"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Leave blank on POSIX to just mark an already-set variable for export.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Flags" description="Available options depend on the target platform.">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                tag={spec.platform}
                onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "export", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <ExportTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<ExportSpec>
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
