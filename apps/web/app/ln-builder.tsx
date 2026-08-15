"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { LnPlatform, LnSpec, LnWinKind } from "@cmdgen/ln";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/ln";
import { Panel, cn } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { LnPreview } from "./ln-preview";
import { LnTargetSelector } from "./ln-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

const WIN_KIND_LABEL: Record<LnWinKind, string> = {
  "file-symlink": "File symlink",
  "dir-symlink": "Directory symlink",
  "hard-link": "Hard link",
  junction: "Junction",
};

/**
 * Narrower than `ln-target-selector`'s `isWindows` on purpose: this gates the
 * UI for `mklink`/`New-Item`'s reversed target/link-name order and their
 * `winKind` axis, neither of which applies to `windows-cygwin`/
 * `windows-msys`/`windows-wsl` — those run the exact same real `ln` as
 * `linux`/`mac`, POSIX order, `winKind` ignored. `isWindows` (Linux/Mac/
 * Windows button state) stays wide; this stays narrow.
 */
const usesWinNativeLinkSyntax = (p: LnPlatform) => p === "windows-cmd" || p === "windows-powershell";

export interface LnBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: LnPlatform;
  onPlatformChange: (next: LnPlatform) => void;
}

export function LnBuilder({ platform, onPlatformChange }: LnBuilderProps) {
  const [draft, setDraft] = useState<LnSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<LnSpec> | null>(null);

  const spec: LnSpec = { ...draft, platform };

  function setSpec(update: LnSpec | ((prev: LnSpec) => LnSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <LnPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Link">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Target (existing file/directory)</label>
                  <input
                    value={spec.target}
                    onChange={(e) => setSpec((s) => ({ ...s, target: e.target.value }))}
                    placeholder="target.txt"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Link name (new)</label>
                  <input
                    value={spec.linkName}
                    onChange={(e) => setSpec((s) => ({ ...s, linkName: e.target.value }))}
                    placeholder="link.txt"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                  {usesWinNativeLinkSyntax(spec.platform) && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      mklink and New-Item take the link name first, the target second — the opposite order from POSIX ln. This app renders whichever order each platform actually expects.
                    </p>
                  )}
                </div>
              </div>
            </Panel>

            {usesWinNativeLinkSyntax(spec.platform) && (
              <Panel title="Link kind" description="mklink's /D, /H, /J — or New-Item's -ItemType.">
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(WIN_KIND_LABEL) as LnWinKind[])
                    .filter((kind) => spec.platform === "windows-cmd" || kind !== "dir-symlink")
                    .map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        onClick={() => setSpec((s) => ({ ...s, winKind: kind }))}
                        className={cn(
                          "rounded px-2 py-1 text-xs transition-colors",
                          spec.winKind === kind
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                        )}
                      >
                        {WIN_KIND_LABEL[kind]}
                      </button>
                    ))}
                </div>
              </Panel>
            )}

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
                <LnTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Presets">
                  <PresetsDropdown<LnSpec>
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
