"use client";

import type { FgrepSpec } from "@cmdgen/fgrep";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/fgrep";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FgrepPreviewProps {
  spec: FgrepSpec;
}

export function FgrepPreview({ spec }: FgrepPreviewProps) {
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
