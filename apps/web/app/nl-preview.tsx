"use client";

import type { NlSpec } from "@cmdgen/nl";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/nl";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NlPreviewProps {
  spec: NlSpec;
}

export function NlPreview({ spec }: NlPreviewProps) {
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
