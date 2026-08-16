"use client";

import type { PrintfSpec } from "@cmdgen/printf";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/printf";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PrintfPreviewProps {
  spec: PrintfSpec;
}

export function PrintfPreview({ spec }: PrintfPreviewProps) {
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
