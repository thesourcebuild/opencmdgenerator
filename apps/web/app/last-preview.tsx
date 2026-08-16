"use client";

import type { LastSpec } from "@cmdgen/last";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/last";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LastPreviewProps {
  spec: LastSpec;
}

export function LastPreview({ spec }: LastPreviewProps) {
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
