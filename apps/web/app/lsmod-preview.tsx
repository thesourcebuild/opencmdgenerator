"use client";

import type { LsmodSpec } from "@cmdgen/lsmod";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/lsmod";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LsmodPreviewProps {
  spec: LsmodSpec;
}

export function LsmodPreview({ spec }: LsmodPreviewProps) {
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
