"use client";

import type { TimeoutSpec } from "@cmdgen/timeout";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/timeout";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TimeoutPreviewProps {
  spec: TimeoutSpec;
}

export function TimeoutPreview({ spec }: TimeoutPreviewProps) {
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
