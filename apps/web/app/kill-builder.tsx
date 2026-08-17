"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import {
  CATALOGUE,
  COMMON_SIGNALS,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
  type KillPlatform,
  type KillSpec,
} from "@cmdgen/kill";
import { Panel, cn } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { KillPreview } from "./kill-preview";
import { KillTargetSelector } from "./kill-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export interface KillBuilderProps {
  initialPlatform: KillPlatform;
}

export function KillBuilder({ initialPlatform }: KillBuilderProps) {
  const [spec, setSpec] = useState<KillSpec>(() =>
    createSpec({ id: "draft", platform: initialPlatform }),
  );
  const [activePreset, setActivePreset] = useState<Preset<KillSpec> | null>(null);
  const isPowerShell = spec.platform === "windows-powershell";

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <KillPreview
            spec={spec}
            onPlatformChange={(platform) => setSpec((s) => ({ ...s, platform }))}
          />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            {isPowerShell ? (
              <Panel
                title="Options"
                description="Stop-Process has no signal concept — this is its entire flag surface."
              >
                <FlagsForm
                  catalogue={CATALOGUE}
                  groups={FLAG_GROUP_META}
                  flags={spec.flags}
                  tag="powershell"
                  onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
                />
              </Panel>
            ) : (
              <>
                <Panel
                  title="Mode"
                  description="kill's real second synopsis — list or convert signal names/numbers instead of sending one."
                >
                  <div className="flex gap-1">
                    {(["signal", "list", "table"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSpec((s) => ({ ...s, mode: m }))}
                        className={cn(
                          "rounded px-2 py-1 text-xs capitalize transition-colors",
                          spec.mode === m
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </Panel>

                {spec.mode === "signal" ? (
                  <>
                    <Panel title="Signal">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {COMMON_SIGNALS.map((sig) => (
                            <button
                              key={sig}
                              type="button"
                              onClick={() => setSpec((s) => ({ ...s, signal: sig }))}
                              className={cn(
                                "rounded px-2 py-1 font-mono text-xs transition-colors",
                                spec.signal.toUpperCase() === sig
                                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                              )}
                            >
                              {sig}
                            </button>
                          ))}
                        </div>
                        <input
                          value={spec.signal}
                          onChange={(e) => setSpec((s) => ({ ...s, signal: e.target.value }))}
                          placeholder="TERM, 9, HUP, ..."
                          className="h-9 w-40 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                        />

                        <div>
                          <p className="mb-1 text-[11px] font-medium text-slate-500">
                            How to spell it — all three are equivalent.
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(
                              [
                                ["bare", "-SIGNAL"],
                                ["short", "-s SIGNAL"],
                                ["long", "--signal SIGNAL"],
                              ] as const
                            ).map(([style, label]) => (
                              <button
                                key={style}
                                type="button"
                                onClick={() => setSpec((s) => ({ ...s, signalStyle: style }))}
                                className={cn(
                                  "rounded px-2 py-1 font-mono text-[11px] transition-colors",
                                  spec.signalStyle === style
                                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Panel>

                    <Panel title="Targets" description="Process IDs (or %job specs) to signal.">
                      <StringListEditor
                        items={spec.targets}
                        onChange={(targets) => setSpec((s) => ({ ...s, targets }))}
                        placeholder="1234"
                        addLabel="Add target"
                        emptyHint="No targets added yet."
                      />
                    </Panel>
                  </>
                ) : (
                  <Panel
                    title="Signals"
                    description="Leave empty to list every supported signal name."
                  >
                    <StringListEditor
                      items={spec.listSignals}
                      onChange={(listSignals) => setSpec((s) => ({ ...s, listSignals }))}
                      placeholder="TERM, 9, ..."
                      addLabel="Add signal"
                      emptyHint="No signals added — lists every supported name."
                    />
                  </Panel>
                )}
              </>
            )}

            {isPowerShell && (
              <Panel title="Targets" description="Process IDs to stop.">
                <StringListEditor
                  items={spec.targets}
                  onChange={(targets) => setSpec((s) => ({ ...s, targets }))}
                  placeholder="1234"
                  addLabel="Add target"
                  emptyHint="No targets added yet."
                />
              </Panel>
            )}
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "kill", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <KillTargetSelector
                  value={spec.platform}
                  onChange={(platform) => setSpec((s) => ({ ...s, platform }))}
                />

                <Panel title="Examples">
                  <PresetsDropdown<KillSpec>
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
