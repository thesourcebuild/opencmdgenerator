"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { CdPlatform, CdSpec } from "@cmdgen/cd";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/cd";
import { Button, Panel } from "@cmdgen/ui";
import { CdPreview } from "./cd-preview";
import { CdTargetSelector } from "./cd-target-selector";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface CdBuilderProps {
  canPick: boolean;
  onPickDirectory: (title: string) => Promise<string | undefined>;
  /**
   * Owned by AppShell — the left sidebar's OS picker and the Generated
   * Command panel's Windows shell picker both read and write this same
   * value, each controlling a different part of it.
   */
  platform: CdPlatform;
  onPlatformChange: (next: CdPlatform) => void;
}

export function CdBuilder({ canPick, onPickDirectory, platform, onPlatformChange }: CdBuilderProps) {
  const [draft, setDraft] = useState<CdSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<CdSpec> | null>(null);

  // `platform` is a controlled prop (the left sidebar owns it), everything
  // else is this component's own state.
  const spec: CdSpec = { ...draft, platform };

  function setSpec(update: CdSpec | ((prev: CdSpec) => CdSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  const pick = async () => {
    const chosen = await onPickDirectory("Choose directory");
    if (chosen) setSpec((s) => ({ ...s, path: chosen }));
  };

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <CdPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Directory">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Path</label>
                  <div className="flex gap-2">
                    <input
                      value={spec.path}
                      onChange={(e) => setSpec((s) => ({ ...s, path: e.target.value }))}
                      placeholder={spec.platform === "linux" || spec.platform === "mac" ? "~/projects" : "C:\\Projects"}
                      className="h-9 flex-1 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                    {canPick && (
                      <Button size="sm" onClick={() => void pick()}>
                        Browse
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Leave blank for the home directory (POSIX shells).</p>
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
                <CdTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<CdSpec>
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
