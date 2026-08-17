"use client";

import type { SwapoffSpec } from "@cmdgen/swapoff";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/swapoff";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SwapoffPreviewProps {
  spec: SwapoffSpec;
}

export function SwapoffPreview({ spec }: SwapoffPreviewProps) {
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
