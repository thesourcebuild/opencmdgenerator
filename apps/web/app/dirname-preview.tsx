"use client";

import type { DirnameSpec } from "@cmdgen/dirname";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/dirname";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DirnamePreviewProps {
  spec: DirnameSpec;
}

export function DirnamePreview({ spec }: DirnamePreviewProps) {
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
