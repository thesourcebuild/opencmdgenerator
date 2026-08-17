"use client";

import type { ChattrSpec } from "@cmdgen/chattr";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/chattr";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChattrPreviewProps {
  spec: ChattrSpec;
}

export function ChattrPreview({ spec }: ChattrPreviewProps) {
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
