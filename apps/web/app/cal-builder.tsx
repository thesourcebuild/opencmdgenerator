"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { CalPlatform, CalSpec } from "@cmdgen/cal";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/cal";
import { Panel } from "@cmdgen/ui";
import { CalPreview } from "./cal-preview";
import { CalTargetSelector } from "./cal-target-selector";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface CalBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: CalPlatform;
  onPlatformChange: (next: CalPlatform) => void;
}

export function CalBuilder({ platform, onPlatformChange }: CalBuilderProps) {
  const [draft, setDraft] = useState<CalSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<CalSpec> | null>(null);

  const spec: CalSpec = { ...draft, platform };

  function setSpec(update: CalSpec | ((prev: CalSpec) => CalSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <CalPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Month and year">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Month</label>
                  <input
                    value={spec.month}
                    onChange={(e) => setSpec((s) => ({ ...s, month: e.target.value }))}
                    placeholder="3"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Year</label>
                  <input
                    value={spec.year}
                    onChange={(e) => setSpec((s) => ({ ...s, year: e.target.value }))}
                    placeholder="2026"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Leave both blank to show the current month.</p>
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
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <CalTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Presets">
                  <PresetsDropdown<CalSpec>
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
