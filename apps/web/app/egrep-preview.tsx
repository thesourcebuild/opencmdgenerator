"use client";

import type { EgrepSpec } from "@cmdgen/egrep";
import { buildArgv, lint, renderTokens } from "@cmdgen/egrep";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface EgrepPreviewProps {
  spec: EgrepSpec;
}

export function EgrepPreview({ spec }: EgrepPreviewProps) {
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
