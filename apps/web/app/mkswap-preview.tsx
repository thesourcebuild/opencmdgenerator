"use client";

import type { MkswapSpec } from "@cmdgen/mkswap";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/mkswap";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface MkswapPreviewProps {
  spec: MkswapSpec;
}

export function MkswapPreview({ spec }: MkswapPreviewProps) {
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
