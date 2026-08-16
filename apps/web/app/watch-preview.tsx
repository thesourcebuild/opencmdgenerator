"use client";

import type { WatchSpec } from "@cmdgen/watch";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/watch";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WatchPreviewProps {
  spec: WatchSpec;
}

export function WatchPreview({ spec }: WatchPreviewProps) {
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
