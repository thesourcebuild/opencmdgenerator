"use client";

import type { PstreeSpec } from "@cmdgen/pstree";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/pstree";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PstreePreviewProps {
  spec: PstreeSpec;
}

export function PstreePreview({ spec }: PstreePreviewProps) {
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
