"use client";

import type { NohupSpec } from "@cmdgen/nohup";
import { buildArgv, lint, renderTokens } from "@cmdgen/nohup";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NohupPreviewProps {
  spec: NohupSpec;
}

export function NohupPreview({ spec }: NohupPreviewProps) {
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
