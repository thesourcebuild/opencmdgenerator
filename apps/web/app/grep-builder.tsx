"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { GrepPlatform, GrepSpec } from "@cmdgen/grep";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/grep";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { GrepPreview } from "./grep-preview";
import { GrepTargetSelector } from "./grep-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export interface GrepBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: GrepPlatform;
  onPlatformChange: (next: GrepPlatform) => void;
}

export function GrepBuilder({ platform, onPlatformChange }: GrepBuilderProps) {
  const [draft, setDraft] = useState<GrepSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<GrepSpec> | null>(null);

  const spec: GrepSpec = { ...draft, platform };

  function setSpec(update: GrepSpec | ((prev: GrepSpec) => GrepSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <GrepPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Pattern">
              <input
                value={spec.pattern}
                onChange={(e) => setSpec((s) => ({ ...s, pattern: e.target.value }))}
                placeholder="TODO"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            <Panel title="Files" description="Leave empty to search standard input.">
              <StringListEditor
                items={spec.files}
                onChange={(files) => setSpec((s) => ({ ...s, files }))}
                placeholder="notes.txt"
                addLabel="Add file"
                emptyHint="No files added yet."
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
                <GrepTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Presets">
                  <PresetsDropdown<GrepSpec>
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
