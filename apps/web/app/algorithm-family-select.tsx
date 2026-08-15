"use client";

import type { AlgorithmFamily } from "./openssl-algorithm-families";

export interface AlgorithmFamilySelectProps {
  families: readonly AlgorithmFamily[];
  value: string;
  onChange: (value: string) => void;
}

function familyFor(families: readonly AlgorithmFamily[], value: string): AlgorithmFamily {
  return families.find((f) => f.variants.some((v) => v.value === value)) ?? families[0]!;
}

const selectClassName =
  "h-9 w-full rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/**
 * Two cascading dropdowns — Family (e.g. SHA-2, AES) then Variant (e.g.
 * SHA-256, AES-256-CBC) — over a single free-text spec field (dgst's
 * `algorithm`, enc's `cipher`). The family is never stored: it's derived by
 * reverse-lookup from the current value, so a preset or hand-typed value
 * that already picks a real variant just shows its family pre-selected,
 * with nothing that can drift out of sync.
 */
export function AlgorithmFamilySelect({ families, value, onChange }: AlgorithmFamilySelectProps) {
  const family = familyFor(families, value);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Family</label>
        <select
          value={family.id}
          onChange={(e) => {
            const next = families.find((f) => f.id === e.target.value);
            if (next) onChange(next.variants[0]!.value);
          }}
          className={selectClassName}
        >
          {families.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Variant</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClassName}>
          {family.variants.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
