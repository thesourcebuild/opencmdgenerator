"use client";

import type { CmpSpec } from "@cmdgen/cmp";
import { buildArgv, lint, renderTokens } from "@cmdgen/cmp";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface CmpPreviewProps {
  spec: CmpSpec;
}

/** cmp's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function CmpPreview({ spec }: CmpPreviewProps) {
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
