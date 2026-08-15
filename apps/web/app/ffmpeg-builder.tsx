"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { FfmpegSpec, ShellDialect } from "@cmdgen/ffmpeg";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/ffmpeg";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FfmpegPreview } from "./ffmpeg-preview";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { ShellDialectTargetSelector } from "./shell-dialect-selector";
import { StringListEditor } from "./string-list-editor";

export interface FfmpegBuilderProps {
  initialShell: ShellDialect;
}

export function FfmpegBuilder({ initialShell }: FfmpegBuilderProps) {
  const [spec, setSpec] = useState<FfmpegSpec>(() => createSpec({ id: "draft", shell: initialShell }));
  const [activePreset, setActivePreset] = useState<Preset<FfmpegSpec> | null>(null);
  const onShellChange = (shell: FfmpegSpec["shell"]) => setSpec((s) => ({ ...s, shell }));

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <FfmpegPreview spec={spec} onShellChange={onShellChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Input file(s) (-i)" description="Each becomes its own repeated -i, in this order — order is meaningful to ffmpeg.">
              <StringListEditor
                items={spec.inputFiles}
                onChange={(inputFiles) => setSpec((s) => ({ ...s, inputFiles }))}
                placeholder="input.mp4"
                addLabel="Add input"
                emptyHint="No inputs yet — ffmpeg would have nothing to read."
              />
            </Panel>

            <Panel title="Output file" description="Always the last argument — where ffmpeg writes the result.">
              <input
                value={spec.outputFile}
                onChange={(e) => setSpec((s) => ({ ...s, outputFile: e.target.value }))}
                placeholder="output.mp4"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            <Panel title="Flags" description="A practical, common subset of ffmpeg's huge option surface — not exhaustive.">
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
                <ShellDialectTargetSelector value={spec.shell} onChange={onShellChange} />

                <Panel title="Presets">
                  <PresetsDropdown<FfmpegSpec>
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
