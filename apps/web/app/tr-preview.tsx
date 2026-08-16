"use client";

import type { TrSpec } from "@cmdgen/tr";
import { buildArgv, lint, renderTokens } from "@cmdgen/tr";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TrPreviewProps {
  spec: TrSpec;
}

export function TrPreview({ spec }: TrPreviewProps) {
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
