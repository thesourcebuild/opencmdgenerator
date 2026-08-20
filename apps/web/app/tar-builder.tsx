"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TarMode, TarSpec, TarVariant } from "@cmdgen/tar";
import {
  BSD_UNSUPPORTED_MODES,
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/tar";
import { Panel, cn } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { ShellDialectTargetSelector } from "./shell-dialect-selector";
import { StringListEditor } from "./string-list-editor";
import { TarPreview } from "./tar-preview";
import { TarTargetSelector } from "./tar-target-selector";

const MODES: [TarMode, string, string][] = [
  ["create", "Create", "-c"],
  ["extract", "Extract", "-x"],
  ["list", "List", "-t"],
  ["append", "Append", "-r"],
  ["update", "Update", "-u"],
  ["diff", "Compare", "-d"],
  ["delete", "Delete", "--delete"],
  ["concatenate", "Concatenate", "-A"],
  ["testLabel", "Test label", "--test-label"],
];

const READ_MODES: TarMode[] = ["extract", "list", "diff", "testLabel"];

export interface TarBuilderProps {
  variant: TarVariant;
  onVariantChange: (next: TarVariant) => void;
  initialShell: ShellDialect;
}

export function TarBuilder({ variant, onVariantChange, initialShell }: TarBuilderProps) {
  const [spec, setSpec] = useState<TarSpec>(() =>
    createSpec({ id: "draft", variant, shell: initialShell }),
  );
  const [activePreset, setActivePreset] = useState<Preset<TarSpec> | null>(null);

  // The variant lives in this builder's own right sidebar (it gates which
  // flags exist), so it arrives as a prop and is mirrored into the spec
  // rather than duplicated as a second control here.
  const current: TarSpec = spec.variant === variant ? spec : { ...spec, variant };
  const archiveHint = current.archive.trim()
    ? current.archive.trim() === "-"
      ? "Renders as -f - (pipe/redirection only)."
      : `Renders as -f ${current.archive.trim()}.`
    : "";

  const isReading = READ_MODES.includes(current.mode);
  const onShellChange = (shell: TarSpec["shell"]) => setSpec({ ...current, shell });

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <TarPreview
            spec={current}
            onShellChange={onShellChange}
            commandExample={activePreset?.commandExample}
          />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(current)}</p>
            </Panel>

            <Panel
              title="Operation"
              description="tar does exactly one of these per invocation."
            >
              <div className="flex flex-wrap gap-1">
                {MODES.map(([mode, label, token]) => {
                  const unsupported =
                    current.variant === "bsd" && BSD_UNSUPPORTED_MODES.includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSpec({ ...current, mode })}
                      title={unsupported ? `bsdtar has no ${token}` : token}
                      className={cn(
                        "rounded px-2 py-1 text-xs transition-colors",
                        current.mode === mode
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : unsupported
                            ? "text-slate-300 line-through dark:text-slate-600"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                      )}
                    >
                      {label} <span className="font-mono opacity-60">{token}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel
              title="Archive"
              description={
                isReading
                  ? "The .tar file itself (-f). Leave empty to read from standard input."
                  : "The .tar file itself (-f). Leave empty only when you intentionally stream archive data to a pipe or redirect it."
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Archive file</label>
                  <input
                    value={current.archive}
                    onChange={(e) => setSpec({ ...current, archive: e.target.value })}
                    placeholder="backup.tar.gz"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                  {archiveHint ? (
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {archiveHint}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Change to directory (-C)
                  </label>
                  <input
                    value={current.changeDir}
                    onChange={(e) => setSpec({ ...current, changeDir: e.target.value })}
                    placeholder={isReading ? "where to extract" : "directory to archive from"}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel
              title={isReading ? "Members" : "Files to archive"}
              description={
                isReading
                  ? "Which members to act on. Leave empty for the whole archive."
                  : current.variant === "bsd"
                    ? "Files and directories to put into the archive. An entry written @other.tar copies every entry out of that archive instead — bsdtar's stand-in for GNU's -A."
                    : "Files and directories to put into the archive."
              }
            >
              <StringListEditor
                items={current.files}
                onChange={(files) => setSpec({ ...current, files })}
                placeholder={isReading ? "docs/README.md" : "src"}
                addLabel="Add path"
                emptyHint={
                  isReading
                    ? "No members listed — the whole archive is used."
                    : "No inputs yet — the archive would be empty."
                }
              />
            </Panel>

            <Panel title="Exclude patterns" description="Each becomes one --exclude=PATTERN.">
              <StringListEditor
                items={current.excludes}
                onChange={(excludes) => setSpec({ ...current, excludes })}
                placeholder="*.log"
                addLabel="Add pattern"
                emptyHint="Nothing excluded."
              />
            </Panel>

            <Panel title="Flags">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={current.flags}
                tag={current.variant}
                onChange={(id, value) => setSpec(setFlag(current, id, value))}
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "tar", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <TarTargetSelector value={variant} onChange={onVariantChange} />
                <ShellDialectTargetSelector value={current.shell} onChange={onShellChange} />

                <Panel title="Examples">
                  <PresetsDropdown<TarSpec>
                    presets={PRESETS}
                    spec={current}
                    onApply={setSpec}
                    onSelectPreset={setActivePreset}
                  />
                </Panel>

                <DiagnosticsPanel spec={current} result={lint(current)} onApplyFix={setSpec} />
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
