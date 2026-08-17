"use client";

import type { DisownSpec } from "@cmdgen/disown";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/disown";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DisownPreviewProps {
  spec: DisownSpec;
}

export function DisownPreview({ spec }: DisownPreviewProps) {
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
