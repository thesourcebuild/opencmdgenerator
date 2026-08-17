"use client";

import type { SyncSpec } from "@cmdgen/sync";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/sync";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SyncPreviewProps {
  spec: SyncSpec;
}

export function SyncPreview({ spec }: SyncPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
