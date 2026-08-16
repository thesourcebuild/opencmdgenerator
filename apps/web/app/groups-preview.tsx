"use client";

import type { GroupsSpec } from "@cmdgen/groups";
import { buildArgv, lint, renderTokens } from "@cmdgen/groups";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GroupsPreviewProps {
  spec: GroupsSpec;
}

export function GroupsPreview({ spec }: GroupsPreviewProps) {
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
