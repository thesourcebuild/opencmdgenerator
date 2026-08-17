"use client";

import type { ArchSpec } from "@cmdgen/arch";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/arch";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ArchPreviewProps {
  spec: ArchSpec;
}

export function ArchPreview({ spec }: ArchPreviewProps) {
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
