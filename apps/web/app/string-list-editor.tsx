"use client";

import { useState } from "react";
import { Button } from "@cmdgen/ui";

export interface StringListEditorProps {
  items: readonly string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  emptyHint?: string;
}

/**
 * A plain, ordered list of text values with add/remove — shared by every
 * command that takes multiple bare targets instead of one path (ls's and
 * rm's paths, kill's PIDs). Not the same shape as rsync's filter rules
 * (which also carry a kind and an enabled toggle) — this is deliberately the
 * simpler, more common case.
 */
export function StringListEditor({ items, onChange, placeholder, addLabel = "Add", emptyHint }: StringListEditorProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (value === "") return;
    onChange([...items, value]);
    setDraft("");
  };

  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));
  const updateAt = (index: number, value: string) => onChange(items.map((it, i) => (i === index ? value : it)));

  return (
    <div className="space-y-2">
      {items.length === 0 && emptyHint && <p className="text-[11px] text-slate-400">{emptyHint}</p>}

      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder={placeholder}
            className="h-8 flex-1 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          <Button size="sm" variant="ghost" onClick={() => removeAt(i)} aria-label="Remove">
            ✕
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="h-8 flex-1 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
        <Button size="sm" onClick={add}>
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
