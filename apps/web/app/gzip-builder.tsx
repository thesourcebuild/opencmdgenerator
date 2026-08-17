"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { GzipSpec } from "@cmdgen/gzip";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/gzip";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { GzipPreview } from "./gzip-preview";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

const COMPRESSION_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function GzipBuilder() {
  const [spec, setSpec] = useState<GzipSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<GzipSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <GzipPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Files">
              <StringListEditor
                items={spec.files}
                onChange={(files) => setSpec((s) => ({ ...s, files }))}
                placeholder="notes.txt"
                addLabel="Add file or directory"
                emptyHint="No files added — gzip will read from stdin and write to stdout."
              />
            </Panel>

            <Panel title="Compression level">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Compression level (-1 fastest … -9 best)
                </label>
                <select
                  value={spec.compressionLevel ?? ""}
                  onChange={(e) =>
                    setSpec((s) => ({
                      ...s,
                      compressionLevel:
                        e.target.value === "" ? undefined : Number(e.target.value),
                    }))
                  }
                  className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="">Default</option>
                  {COMPRESSION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      -{level}
                    </option>
                  ))}
                </select>
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
        bookmark={{ commandId: "gzip", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<GzipSpec>
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
