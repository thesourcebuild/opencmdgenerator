"use client";

import type { BasenameSpec } from "@cmdgen/basename";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/basename";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface BasenamePreviewProps {
  spec: BasenameSpec;
}

export function BasenamePreview({ spec }: BasenamePreviewProps) {
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
