"use client";

import type { ReniceSpec } from "@cmdgen/renice";
import { buildArgv, lint, renderTokens } from "@cmdgen/renice";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface RenicePreviewProps {
  spec: ReniceSpec;
}

export function RenicePreview({ spec }: RenicePreviewProps) {
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
