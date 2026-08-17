"use client";

import type { VisudoSpec } from "@cmdgen/visudo";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/visudo";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface VisudoPreviewProps {
  spec: VisudoSpec;
}

export function VisudoPreview({ spec }: VisudoPreviewProps) {
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
