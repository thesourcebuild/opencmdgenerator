"use client";

import type { UserdelSpec } from "@cmdgen/userdel";
import { buildArgv, lint, renderTokens } from "@cmdgen/userdel";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UserdelPreviewProps {
  spec: UserdelSpec;
}

export function UserdelPreview({ spec }: UserdelPreviewProps) {
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
