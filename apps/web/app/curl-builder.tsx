"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { CurlDataMode, CurlFormMode, CurlSpec, ShellDialect } from "@cmdgen/curl";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/curl";
import { Button, Panel } from "@cmdgen/ui";
import { CategorizedPresetsDropdown } from "./categorized-presets-dropdown";
import { CurlPreview } from "./curl-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { RightSidebar } from "./right-sidebar";
import { ShellDialectTargetSelector } from "./shell-dialect-selector";
import { StringListEditor } from "./string-list-editor";

const DATA_MODE_LABEL: Record<CurlDataMode, string> = {
  data: "-d (data)",
  "data-raw": "--data-raw",
  "data-binary": "--data-binary",
  "data-ascii": "--data-ascii",
  "data-urlencode": "--data-urlencode",
  json: "--json",
};

const FORM_MODE_LABEL: Record<CurlFormMode, string> = {
  form: "-F (form)",
  "form-string": "--form-string",
};

export interface CurlBuilderProps {
  initialShell: ShellDialect;
}

export function CurlBuilder({ initialShell }: CurlBuilderProps) {
  const [spec, setSpec] = useState<CurlSpec>(() => createSpec({ id: "draft", shell: initialShell }));
  const [activePreset, setActivePreset] = useState<Preset<CurlSpec> | null>(null);
  const onShellChange = (shell: CurlSpec["shell"]) => setSpec((s) => ({ ...s, shell }));

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <CurlPreview spec={spec} onShellChange={onShellChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="URL(s)" description="One or more targets — each is fetched in turn.">
              <StringListEditor
                items={spec.urls}
                onChange={(urls) => setSpec((s) => ({ ...s, urls }))}
                placeholder="https://example.com/api"
                addLabel="Add URL"
                emptyHint="No URL yet."
              />
            </Panel>

            <Panel title="Headers (-H)" description="Raw 'Name: value' strings, sent in this order.">
              <StringListEditor
                items={spec.headers}
                onChange={(headers) => setSpec((s) => ({ ...s, headers }))}
                placeholder="Accept: application/json"
                addLabel="Add header"
                emptyHint="No extra headers."
              />
            </Panel>

            <Panel title="Body (-d / --data-* / --json)" description="Each entry is its own repeated flag — real curl concatenates multiple -d chunks with &.">
              <EntryListEditor
                entries={spec.dataEntries}
                onChange={(dataEntries) => setSpec((s) => ({ ...s, dataEntries }))}
                modeLabel={DATA_MODE_LABEL}
                defaultMode="data"
                valuePlaceholder='key=value or {"key":"value"}'
                addLabel="Add body entry"
                emptyHint="No request body."
              />
            </Panel>

            <Panel title="Multipart form (-F / --form-string)" description="Each entry is its own repeated flag.">
              <EntryListEditor
                entries={spec.formEntries}
                onChange={(formEntries) => setSpec((s) => ({ ...s, formEntries }))}
                modeLabel={FORM_MODE_LABEL}
                defaultMode="form"
                valuePlaceholder="file=@/path/to/file"
                addLabel="Add form field"
                emptyHint="No form fields."
              />
            </Panel>

            <Panel title="Flags" description="Driven entirely by the catalogue in @cmdgen/curl.">
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
                  <CategorizedPresetsDropdown<CurlSpec>
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

interface EntryListEditorProps<TMode extends string> {
  entries: readonly { mode: TMode; value: string }[];
  onChange: (next: { mode: TMode; value: string }[]) => void;
  modeLabel: Record<TMode, string>;
  defaultMode: TMode;
  valuePlaceholder: string;
  addLabel: string;
  emptyHint: string;
}

/** A repeated (mode, value) row list — the shape `spec.dataEntries`/`spec.formEntries` need, which the plainer `StringListEditor` (one string per row) cannot express. */
function EntryListEditor<TMode extends string>({
  entries,
  onChange,
  modeLabel,
  defaultMode,
  valuePlaceholder,
  addLabel,
  emptyHint,
}: EntryListEditorProps<TMode>) {
  const modes = Object.keys(modeLabel) as TMode[];

  const updateAt = (index: number, patch: Partial<{ mode: TMode; value: string }>) =>
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeAt = (index: number) => onChange(entries.filter((_, i) => i !== index));
  const add = () => onChange([...entries, { mode: defaultMode, value: "" }]);

  return (
    <div className="space-y-2">
      {entries.length === 0 && <p className="text-[11px] text-slate-400">{emptyHint}</p>}

      {entries.map((entry, i) => (
        <div key={i} className="flex gap-2">
          <select
            value={entry.mode}
            onChange={(e) => updateAt(i, { mode: e.target.value as TMode })}
            className="h-8 shrink-0 rounded-md border border-slate-300 bg-white px-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {modeLabel[mode]}
              </option>
            ))}
          </select>
          <input
            value={entry.value}
            onChange={(e) => updateAt(i, { value: e.target.value })}
            placeholder={valuePlaceholder}
            className="h-8 flex-1 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          <Button size="sm" variant="ghost" onClick={() => removeAt(i)} aria-label="Remove">
            ✕
          </Button>
        </div>
      ))}

      <Button size="sm" onClick={add}>
        {addLabel}
      </Button>
    </div>
  );
}
