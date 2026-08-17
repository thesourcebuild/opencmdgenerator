"use client";

import type { AptCacheSpec } from "@cmdgen/apt-cache";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/apt-cache";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface AptCachePreviewProps {
  spec: AptCacheSpec;
}

export function AptCachePreview({ spec }: AptCachePreviewProps) {
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
