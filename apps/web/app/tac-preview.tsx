"use client";

import type { TacSpec } from "@cmdgen/tac";
import { buildArgv, lint, renderTokens } from "@cmdgen/tac";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TacPreviewProps {
  spec: TacSpec;
}

export function TacPreview({ spec }: TacPreviewProps) {
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
