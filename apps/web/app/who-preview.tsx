"use client";

import type { WhoSpec } from "@cmdgen/who";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/who";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WhoPreviewProps {
  spec: WhoSpec;
}

export function WhoPreview({ spec }: WhoPreviewProps) {
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
