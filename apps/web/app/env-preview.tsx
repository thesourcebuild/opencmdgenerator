"use client";

import type { EnvSpec } from "@cmdgen/env";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/env";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface EnvPreviewProps {
  spec: EnvSpec;
}

export function EnvPreview({ spec }: EnvPreviewProps) {
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
