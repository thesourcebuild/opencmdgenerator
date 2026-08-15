"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { MvPlatform, MvSpec } from "@cmdgen/mv";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/mv";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { MvPreview } from "./mv-preview";
import { MvTargetSelector } from "./mv-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export interface MvBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: MvPlatform;
  onPlatformChange: (next: MvPlatform) => void;
}

export function MvBuilder({ platform, onPlatformChange }: MvBuilderProps) {
  const [draft, setDraft] = useState<MvSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<MvSpec> | null>(null);

  const spec: MvSpec = { ...draft, platform };

  function setSpec(update: MvSpec | ((prev: MvSpec) => MvSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <MvPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Sources">
              <StringListEditor
                items={spec.sources}
                onChange={(sources) => setSpec((s) => ({ ...s, sources }))}
                placeholder="a.txt"
                addLabel="Add source"
                emptyHint="No sources added yet."
              />
            </Panel>

            <Panel title="Destination" description="A directory when moving multiple sources, or a new name/location for one.">
              <input
                value={spec.destination}
                onChange={(e) => setSpec((s) => ({ ...s, destination: e.target.value }))}
                placeholder="dest/"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
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
                <MvTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<MvSpec>
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
