"use client";

import type { ChshSpec } from "@cmdgen/chsh";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/chsh";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChshPreviewProps {
  spec: ChshSpec;
}

export function ChshPreview({ spec }: ChshPreviewProps) {
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
