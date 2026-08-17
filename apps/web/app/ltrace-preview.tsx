"use client";

import type { LtraceSpec } from "@cmdgen/ltrace";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/ltrace";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LtracePreviewProps {
  spec: LtraceSpec;
}

export function LtracePreview({ spec }: LtracePreviewProps) {
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
