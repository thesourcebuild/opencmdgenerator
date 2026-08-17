"use client";

import type { LsofSpec } from "@cmdgen/lsof";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/lsof";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LsofPreviewProps {
  spec: LsofSpec;
}

export function LsofPreview({ spec }: LsofPreviewProps) {
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
