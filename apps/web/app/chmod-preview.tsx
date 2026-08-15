"use client";

import type { ChmodSpec } from "@cmdgen/chmod";
import { buildArgv, lint, renderTokens } from "@cmdgen/chmod";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChmodPreviewProps {
  spec: ChmodSpec;
}

/**
 * chmod's data for the shared `GeneratedCommandPanel` template — no shell
 * picker at all, unlike every other command: chmod has no cmd.exe or
 * PowerShell form, it's only ever reached from within a POSIX-capable shell,
 * so there's no real second choice to offer.
 */
export function ChmodPreview({ spec }: ChmodPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
