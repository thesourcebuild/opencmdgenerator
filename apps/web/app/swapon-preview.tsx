"use client";

import type { SwaponSpec } from "@cmdgen/swapon";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/swapon";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SwaponPreviewProps {
  spec: SwaponSpec;
}

export function SwaponPreview({ spec }: SwaponPreviewProps) {
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
