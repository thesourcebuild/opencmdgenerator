"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { MkdirPlatform, MkdirSpec } from "@cmdgen/mkdir";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/mkdir";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { MkdirPreview } from "./mkdir-preview";
import { MkdirTargetSelector } from "./mkdir-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export interface MkdirBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: MkdirPlatform;
  onPlatformChange: (next: MkdirPlatform) => void;
}

export function MkdirBuilder({ platform, onPlatformChange }: MkdirBuilderProps) {
  const [draft, setDraft] = useState<MkdirSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<MkdirSpec> | null>(null);

  const spec: MkdirSpec = { ...draft, platform };

  function setSpec(update: MkdirSpec | ((prev: MkdirSpec) => MkdirSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <MkdirPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Directories">
              <StringListEditor
                items={spec.directories}
                onChange={(directories) => setSpec((s) => ({ ...s, directories }))}
                placeholder="mydir/subdir"
                addLabel="Add directory"
                emptyHint="No directories added yet."
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
                <MkdirTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Presets">
                  <PresetsDropdown<MkdirSpec>
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
