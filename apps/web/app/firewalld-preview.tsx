"use client";

import type { FirewalldSpec } from "@cmdgen/firewalld";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/firewalld";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FirewalldPreviewProps {
  spec: FirewalldSpec;
}

export function FirewalldPreview({ spec }: FirewalldPreviewProps) {
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
