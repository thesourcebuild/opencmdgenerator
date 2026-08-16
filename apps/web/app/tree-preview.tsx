"use client";

import type { TreeSpec } from "@cmdgen/tree";
import { buildArgv, lint, renderTokens } from "@cmdgen/tree";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TreePreviewProps {
  spec: TreeSpec;
}

export function TreePreview({ spec }: TreePreviewProps) {
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
