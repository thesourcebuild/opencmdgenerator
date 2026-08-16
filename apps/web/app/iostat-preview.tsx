"use client";

import type { IostatSpec } from "@cmdgen/iostat";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/iostat";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface IostatPreviewProps {
  spec: IostatSpec;
}

export function IostatPreview({ spec }: IostatPreviewProps) {
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
