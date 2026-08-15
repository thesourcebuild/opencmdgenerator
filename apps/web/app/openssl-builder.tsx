"use client";

import { useState, type ReactElement } from "react";
import type { Preset } from "@cmdgen/engine";
import type { OpensslCategoryId, OpensslSpec, OpensslSubcommand, ShellDialect } from "@cmdgen/openssl";
import { OPENSSL_CATEGORIES, OPENSSL_SUBCOMMAND_META, PRESETS, createSpec, describeSpec, lint, subcommandsInCategory } from "@cmdgen/openssl";
import { Panel } from "@cmdgen/ui";
import { CategorizedPresetsDropdown } from "./categorized-presets-dropdown";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { OpensslCertFields } from "./openssl-cert-fields";
import { OpensslDiagFields } from "./openssl-diag-fields";
import { OpensslDigestFields } from "./openssl-digest-fields";
import { OpensslEncFields } from "./openssl-enc-fields";
import { OpensslKeygenFields } from "./openssl-keygen-fields";
import { OpensslPkcsFields } from "./openssl-pkcs-fields";
import { OpensslPkiFields } from "./openssl-pki-fields";
import { OpensslPreview } from "./openssl-preview";
import { OpensslSmimeFields } from "./openssl-smime-fields";
import { OpensslTlsFields } from "./openssl-tls-fields";
import { OpensslVerifyFields } from "./openssl-verify-fields";
import { PresetInfo } from "./preset-example";
import { RightSidebar } from "./right-sidebar";
import { ShellDialectTargetSelector } from "./shell-dialect-selector";

const CATEGORY_FIELDS: Record<OpensslCategoryId, (props: { spec: OpensslSpec; onChange: (next: OpensslSpec) => void }) => ReactElement | null> = {
  keygen: OpensslKeygenFields,
  csr: OpensslCertFields,
  cert: OpensslCertFields,
  verify: OpensslVerifyFields,
  enc: OpensslEncFields,
  digest: OpensslDigestFields,
  pkcs: OpensslPkcsFields,
  passwd: OpensslPkcsFields,
  rand: OpensslTlsFields,
  tls: OpensslTlsFields,
  pki: OpensslPkiFields,
  smime: OpensslSmimeFields,
  store: OpensslSmimeFields,
  diag: OpensslDiagFields,
  advanced: OpensslPkiFields,
};

export interface OpensslBuilderProps {
  initialShell: ShellDialect;
}

export function OpensslBuilder({ initialShell }: OpensslBuilderProps) {
  const [spec, setSpec] = useState<OpensslSpec>(() => createSpec({ id: "draft", shell: initialShell }));
  const [activePreset, setActivePreset] = useState<Preset<OpensslSpec> | null>(null);

  const category = OPENSSL_SUBCOMMAND_META[spec.subcommand].category;
  const CategoryFields = CATEGORY_FIELDS[category];

  const changeSubcommand = (next: OpensslSubcommand) => setSpec(createSpec({ id: spec.id, subcommand: next, shell: spec.shell }));

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <OpensslPreview spec={spec} onShellChange={(shell) => setSpec({ ...spec, shell })} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Subcommand">
              <select
                value={spec.subcommand}
                onChange={(e) => changeSubcommand(e.target.value as OpensslSubcommand)}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              >
                {OPENSSL_CATEGORIES.map((c) => (
                  <optgroup key={c.id} label={c.label}>
                    {subcommandsInCategory(c.id).map((sub) => (
                      <option key={sub} value={sub}>
                        {OPENSSL_SUBCOMMAND_META[sub].label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Panel>

            <CategoryFields spec={spec} onChange={setSpec} />
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
                <ShellDialectTargetSelector value={spec.shell} onChange={(shell) => setSpec({ ...spec, shell })} />

                <Panel title="Examples">
                  <CategorizedPresetsDropdown<OpensslSpec>
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
