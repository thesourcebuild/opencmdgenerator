"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { DigSpec } from "@cmdgen/dig";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/dig";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { DigPreview } from "./dig-preview";

const RECORD_TYPES = ["", "A", "AAAA", "MX", "TXT", "NS", "CNAME", "ANY"] as const;

export function DigBuilder() {
  const [spec, setSpec] = useState<DigSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<DigSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <DigPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Query">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Name (or address, with -x)
                  </label>
                  <input
                    value={spec.lookupName}
                    onChange={(e) => setSpec((s) => ({ ...s, lookupName: e.target.value }))}
                    placeholder="example.com"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Record type</label>
                  <select
                    value={spec.type}
                    onChange={(e) =>
                      setSpec((s) => ({ ...s, type: e.target.value as DigSpec["type"] }))
                    }
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {RECORD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type === "" ? "(default — A)" : type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Server (optional)</label>
                  <input
                    value={spec.server}
                    onChange={(e) => setSpec((s) => ({ ...s, server: e.target.value }))}
                    placeholder="8.8.8.8"
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
                onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "dig", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<DigSpec>
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
