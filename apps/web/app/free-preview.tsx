"use client";

import type { FreeSpec } from "@cmdgen/free";
import { buildArgv, lint, renderTokens } from "@cmdgen/free";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FreePreviewProps {
  spec: FreeSpec;
}

/** free's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/top`'s preview. */
export function FreePreview({ spec }: FreePreviewProps) {
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
