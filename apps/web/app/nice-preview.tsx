"use client";

import type { NiceSpec } from "@cmdgen/nice";
import { buildArgv, lint, renderTokens } from "@cmdgen/nice";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NicePreviewProps {
  spec: NiceSpec;
}

export function NicePreview({ spec }: NicePreviewProps) {
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
