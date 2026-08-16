"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { JournalctlSpec } from "@cmdgen/journalctl";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/journalctl";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { JournalctlPreview } from "./journalctl-preview";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export function JournalctlBuilder() {
  const [spec, setSpec] = useState<JournalctlSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<JournalctlSpec> | null>(null);
  const matches = spec.matches ?? [];
  const extraOptions = spec.extraOptions ?? [];

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <JournalctlPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Unit" description="Leave blank to read the whole system journal.">
              <div>
                <label className="mb-1 block text-xs font-medium">Unit</label>
                <input
                  value={spec.unit}
                  onChange={(e) => setSpec((s) => ({ ...s, unit: e.target.value }))}
                  placeholder="nginx"
                  className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </Panel>

            <Panel title="Matches and paths" description="Additional FIELD=VALUE matches, + disjunction separators, or absolute paths/executables/devices.">
              <StringListEditor
                items={matches}
                onChange={(next) => setSpec((s) => ({ ...s, matches: next }))}
                placeholder="_PID=1234"
                addLabel="Add match"
                emptyHint="Leave blank unless you need structured journal matches beyond unit/time/priority filters."
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

            <Panel title="Advanced passthrough options" description="Raw journalctl options inserted before matches for very new or uncommon switches.">
              <StringListEditor
                items={extraOptions}
                onChange={(next) => setSpec((s) => ({ ...s, extraOptions: next }))}
                placeholder="--option or --option=value"
                addLabel="Add option"
                emptyHint="Most supported options are available above; use this only for newer journalctl flags."
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "journalctl", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<JournalctlSpec>
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
