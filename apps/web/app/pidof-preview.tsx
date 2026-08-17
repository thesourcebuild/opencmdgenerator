"use client";

import type { PidofSpec } from "@cmdgen/pidof";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/pidof";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PidofPreviewProps {
  spec: PidofSpec;
}

export function PidofPreview({ spec }: PidofPreviewProps) {
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
