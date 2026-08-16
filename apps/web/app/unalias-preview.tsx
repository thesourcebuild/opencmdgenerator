"use client";

import type { UnaliasSpec } from "@cmdgen/unalias";
import { buildArgv, lint, renderTokens } from "@cmdgen/unalias";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UnaliasPreviewProps {
  spec: UnaliasSpec;
}

export function UnaliasPreview({ spec }: UnaliasPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \"
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
