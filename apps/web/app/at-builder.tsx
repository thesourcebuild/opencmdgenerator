"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { AtSpec } from "@cmdgen/at";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/at";
import { Panel } from "@cmdgen/ui";
import { AtPreview } from "./at-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

const ACTIONS = ["schedule", "list", "remove"] as const;

// No Flags panel at all — at has zero catalogue flags (see
// @cmdgen/at/catalogue/flags.ts), same restraint as crontab's builder. Time,
// job body, action, and job id are all plain spec-level fields instead.
export function AtBuilder() {
  const [spec, setSpec] = useState<AtSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<AtSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <AtPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action">
              <select
                value={spec.action}
                onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as AtSpec["action"] }))}
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              >
                {ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </Panel>

            {spec.action === "schedule" && (
              <Panel title="Time and job" description='Real at time spec, e.g. "now + 1 hour", "10:00", "teatime".'>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium">Time</label>
                    <input
                      value={spec.time}
                      onChange={(e) => setSpec((s) => ({ ...s, time: e.target.value }))}
                      placeholder="now + 1 hour"
                      className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">Command</label>
                    <input
                      value={spec.command}
                      onChange={(e) => setSpec((s) => ({ ...s, command: e.target.value }))}
                      placeholder="run the backup script"
                      className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                </div>
              </Panel>
            )}

            {spec.action === "remove" && (
              <Panel title="Job to cancel" description="The job number shown by atq.">
                <input
                  value={spec.jobId}
                  onChange={(e) => setSpec((s) => ({ ...s, jobId: e.target.value }))}
                  placeholder="3"
                  className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
              </Panel>
            )}
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "at", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<AtSpec>
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
