"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { CrontabSpec } from "@cmdgen/crontab";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/crontab";
import { Panel } from "@cmdgen/ui";
import { CrontabPreview } from "./crontab-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

const ACTIONS = ["list", "edit", "remove"] as const;

// No Flags panel at all — crontab has zero catalogue flags (see
// @cmdgen/crontab/catalogue/flags.ts), same restraint as service's builder.
// The action and the optional -u user are both plain spec-level fields
// instead.
export function CrontabBuilder() {
  const [spec, setSpec] = useState<CrontabSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<CrontabSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <CrontabPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action and user">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as CrontabSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ACTIONS.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">User (-u, root-only)</label>
                  <input
                    value={spec.user}
                    onChange={(e) => setSpec((s) => ({ ...s, user: e.target.value }))}
                    placeholder="Leave blank for the current user"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
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
                  <PresetsDropdown<CrontabSpec>
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
