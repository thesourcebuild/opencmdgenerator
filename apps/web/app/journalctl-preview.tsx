"use client";

import type { JournalctlSpec } from "@cmdgen/journalctl";
import { buildArgv, lint, renderTokens } from "@cmdgen/journalctl";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface JournalctlPreviewProps {
  spec: JournalctlSpec;
}

/** journalctl's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/systemctl`'s preview. */
export function JournalctlPreview({ spec }: JournalctlPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description="Read-only — journalctl never modifies the journal."
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
