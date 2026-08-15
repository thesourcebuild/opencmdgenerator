"use client";

import type { PacmanSpec } from "@cmdgen/pacman";
import { buildArgv, lint, renderTokens } from "@cmdgen/pacman";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PacmanPreviewProps {
  spec: PacmanSpec;
}

/** pacman's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/zip`'s preview. */
export function PacmanPreview({ spec }: PacmanPreviewProps) {
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
