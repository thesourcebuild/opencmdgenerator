"use client";

import type { SnapSpec } from "@cmdgen/snap";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/snap";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SnapPreviewProps {
  spec: SnapSpec;
}

export function SnapPreview({ spec }: SnapPreviewProps) {
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
