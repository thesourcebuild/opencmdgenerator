"use client";

import type { HwinfoSpec } from "@cmdgen/hwinfo";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/hwinfo";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HwinfoPreviewProps {
  spec: HwinfoSpec;
}

export function HwinfoPreview({ spec }: HwinfoPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
