"use client";

import type { TarVariant } from "@cmdgen/tar";
import { Panel } from "@cmdgen/ui";

const VARIANT_LABEL: Record<TarVariant, string> = {
  gnu: "GNU tar",
  bsd: "bsdtar (libarchive)",
};

const VARIANT_WHERE: Record<TarVariant, string> = {
  gnu: "Linux, Git Bash, MSYS2, WSL",
  bsd: "macOS, Windows 10+ built-in",
};

/**
 * tar's implementation picker. Deliberately NOT an OS picker: macOS ships
 * bsdtar while Linux ships GNU tar, and on Windows it depends entirely on
 * which shell you are in — cmd/PowerShell get the bundled bsdtar, Git Bash and
 * WSL get GNU tar. Labelling this "Mac / Windows / Linux" would therefore hand
 * macOS users GNU-only flags that do not exist on their machine.
 *
 * Which *shell* quotes the command is a separate, orthogonal choice and lives
 * in the Generated Command panel, the same place rsync's and ssh's does.
 */
export function TarTargetSelector({
  value,
  onChange,
}: {
  value: TarVariant;
  onChange: (next: TarVariant) => void;
}) {
  return (
    <Panel title="tar implementation">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TarVariant)}
        title="Determines which options exist. These two implementations differ by more than spelling."
        className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
      >
        {(Object.keys(VARIANT_LABEL) as TarVariant[]).map((variant) => (
          <option key={variant} value={variant}>
            {VARIANT_LABEL[variant]}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-[11px] text-slate-400">{VARIANT_WHERE[value]}</p>
    </Panel>
  );
}
