"use client";

import type { DuSpec } from "@cmdgen/du";
import { buildArgv, lint, renderTokens } from "@cmdgen/du";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DuPreviewProps {
  spec: DuSpec;
}

/** du's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function DuPreview({ spec }: DuPreviewProps) {
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
