"use client";

import type { PartedSpec } from "@cmdgen/parted";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/parted";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PartedPreviewProps {
  spec: PartedSpec;
}

export function PartedPreview({ spec }: PartedPreviewProps) {
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
