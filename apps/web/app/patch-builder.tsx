"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { PatchSpec } from "@cmdgen/patch";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/patch";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PatchPreview } from "./patch-preview";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export function PatchBuilder() {
  const [spec, setSpec] = useState<PatchSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<PatchSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <PatchPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Target file" description="Leave blank to let patch guess it from the diff headers.">
              <input
                value={spec.targetFile}
                onChange={(e) => setSpec((s) => ({ ...s, targetFile: e.target.value }))}
                placeholder="src/app.c"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            <Panel title="Patch file" description="Leave blank to read from stdin (or use -i in Flags below).">
              <input
                value={spec.patchFile}
                onChange={(e) => setSpec((s) => ({ ...s, patchFile: e.target.value }))}
                placeholder="changes.patch"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
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
                <Panel title="Presets">
                  <PresetsDropdown<PatchSpec>
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
