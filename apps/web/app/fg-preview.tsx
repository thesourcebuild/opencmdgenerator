"use client";

import type { FgSpec } from "@cmdgen/fg";
import { buildArgv, lint, renderTokens } from "@cmdgen/fg";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FgPreviewProps {
  spec: FgSpec;
}

export function FgPreview({ spec }: FgPreviewProps) {
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
