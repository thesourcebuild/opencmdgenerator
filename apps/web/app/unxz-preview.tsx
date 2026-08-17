"use client";

import type { UnxzSpec } from "@cmdgen/unxz";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/unxz";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UnxzPreviewProps {
  spec: UnxzSpec;
}

export function UnxzPreview({ spec }: UnxzPreviewProps) {
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
