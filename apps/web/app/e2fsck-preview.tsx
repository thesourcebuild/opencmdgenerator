"use client";

import type { E2fsckSpec } from "@cmdgen/e2fsck";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/e2fsck";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface E2fsckPreviewProps {
  spec: E2fsckSpec;
}

export function E2fsckPreview({ spec }: E2fsckPreviewProps) {
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
