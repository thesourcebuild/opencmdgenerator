"use client";

import type { GroupdelSpec } from "@cmdgen/groupdel";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/groupdel";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GroupdelPreviewProps {
  spec: GroupdelSpec;
}

export function GroupdelPreview({ spec }: GroupdelPreviewProps) {
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
