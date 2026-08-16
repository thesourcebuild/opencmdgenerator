"use client";

import type { LscpuSpec } from "@cmdgen/lscpu";
import { buildArgv, lint, renderTokens } from "@cmdgen/lscpu";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LscpuPreviewProps {
  spec: LscpuSpec;
}

export function LscpuPreview({ spec }: LscpuPreviewProps) {
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
