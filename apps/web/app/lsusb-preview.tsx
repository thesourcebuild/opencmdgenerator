"use client";

import type { LsusbSpec } from "@cmdgen/lsusb";
import { buildArgv, lint, renderTokens } from "@cmdgen/lsusb";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LsusbPreviewProps {
  spec: LsusbSpec;
}

export function LsusbPreview({ spec }: LsusbPreviewProps) {
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
