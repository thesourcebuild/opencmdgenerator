"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { GetenforceSpec } from "@cmdgen/getenforce";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/getenforce";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { GetenforcePreview } from "./getenforce-preview";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

// No Flags panel and no field inputs at all — getenforce takes no
// arguments and has zero catalogue flags (see
// @cmdgen/getenforce/catalogue/flags.ts), same restraint as
// @cmdgen/iptables omitting panels it has nothing to show.
export function GetenforceBuilder() {
  const [spec, setSpec] = useState<GetenforceSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<GetenforceSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <GetenforcePreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
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
                  <PresetsDropdown<GetenforceSpec>
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
