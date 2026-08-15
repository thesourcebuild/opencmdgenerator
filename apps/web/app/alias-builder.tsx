"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { AliasPlatform, AliasSpec } from "@cmdgen/alias";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/alias";
import { Panel } from "@cmdgen/ui";
import { AliasPreview } from "./alias-preview";
import { AliasTargetSelector } from "./alias-target-selector";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface AliasBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: AliasPlatform;
  onPlatformChange: (next: AliasPlatform) => void;
}

export function AliasBuilder({ platform, onPlatformChange }: AliasBuilderProps) {
  const [draft, setDraft] = useState<AliasSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<AliasSpec> | null>(null);

  const spec: AliasSpec = { ...draft, platform };

  function setSpec(update: AliasSpec | ((prev: AliasSpec) => AliasSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <AliasPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Alias">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Name</label>
                  <input
                    value={spec.aliasName}
                    onChange={(e) => setSpec((s) => ({ ...s, aliasName: e.target.value }))}
                    placeholder="ll"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Command</label>
                  <input
                    value={spec.command}
                    onChange={(e) => setSpec((s) => ({ ...s, command: e.target.value }))}
                    placeholder="ls -la"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Leave blank on POSIX to just show what an existing alias expands to.</p>
                </div>
              </div>
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
                <AliasTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Presets">
                  <PresetsDropdown<AliasSpec>
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
