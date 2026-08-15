"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { DdSpec } from "@cmdgen/dd";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/dd";
import { Panel } from "@cmdgen/ui";
import { DdPreview } from "./dd-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

// No Flags panel at all — dd has zero catalogue flags (see
// @cmdgen/dd/catalogue/flags.ts), same restraint as ps/top omitting a Files
// panel. Every field below is a spec-level attached operand instead.
export function DdBuilder() {
  const [spec, setSpec] = useState<DdSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<DdSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <DdPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel
              title="Input and output"
              description="dd is famously destructive — double-check these before running the command for real. Swapping if=/of=, or pointing of= at the wrong device, overwrites it irreversibly."
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Input file (if=)</label>
                  <input
                    value={spec.inputFile}
                    onChange={(e) => setSpec((s) => ({ ...s, inputFile: e.target.value }))}
                    placeholder="/dev/sda"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Output file (of=)</label>
                  <input
                    value={spec.outputFile}
                    onChange={(e) => setSpec((s) => ({ ...s, outputFile: e.target.value }))}
                    placeholder="backup.img"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Block size and range">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Block size (bs=)</label>
                  <input
                    value={spec.blockSize}
                    onChange={(e) => setSpec((s) => ({ ...s, blockSize: e.target.value }))}
                    placeholder="4M"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Count (count=)</label>
                  <input
                    value={spec.count}
                    onChange={(e) => setSpec((s) => ({ ...s, count: e.target.value }))}
                    placeholder="100"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Skip (skip=)</label>
                  <input
                    value={spec.skip}
                    onChange={(e) => setSpec((s) => ({ ...s, skip: e.target.value }))}
                    placeholder="10"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Conversion and status">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Conv (conv=)</label>
                  <input
                    value={spec.conv}
                    onChange={(e) => setSpec((s) => ({ ...s, conv: e.target.value }))}
                    placeholder="notrunc,noerror"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Status (status=)</label>
                  <input
                    value={spec.status}
                    onChange={(e) => setSpec((s) => ({ ...s, status: e.target.value }))}
                    placeholder="progress"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    GNU-only: "progress" shows a live meter, "none" silences the final summary.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "dd", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<DdSpec>
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
