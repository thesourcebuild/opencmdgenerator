"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { PacmanOperation, PacmanSpec } from "@cmdgen/pacman";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/pacman";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PacmanPreview } from "./pacman-preview";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

const OPERATION_LABEL: Record<PacmanOperation, string> = {
  sync: "Install (sync)",
  remove: "Remove",
  searchSync: "Search (sync search)",
  refreshUpgrade: "Refresh and upgrade everything",
};

const OPERATIONS: readonly PacmanOperation[] = ["sync", "remove", "searchSync", "refreshUpgrade"];

export function PacmanBuilder() {
  const [spec, setSpec] = useState<PacmanSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<PacmanSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <PacmanPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Operation">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Operation</label>
                  <select
                    value={spec.operation}
                    onChange={(e) => setSpec((s) => ({ ...s, operation: e.target.value as PacmanOperation }))}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {OPERATIONS.map((op) => (
                      <option key={op} value={op}>
                        {OPERATION_LABEL[op]}
                      </option>
                    ))}
                  </select>
                </div>

                <StringListEditor
                  items={spec.packages}
                  onChange={(packages) => setSpec((s) => ({ ...s, packages }))}
                  placeholder="nginx"
                  addLabel="Add package"
                  emptyHint={
                    spec.operation === "refreshUpgrade"
                      ? "refreshUpgrade (-Syu) takes no package names — any entries here are ignored."
                      : "No packages added — pacman needs at least one package name for this operation."
                  }
                />
              </div>
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
                <Panel title="Examples">
                  <PresetsDropdown<PacmanSpec>
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
