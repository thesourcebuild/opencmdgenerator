"use client";

import type { RmmodSpec } from "@cmdgen/rmmod";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/rmmod";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface RmmodPreviewProps {
  spec: RmmodSpec;
}

export function RmmodPreview({ spec }: RmmodPreviewProps) {
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
