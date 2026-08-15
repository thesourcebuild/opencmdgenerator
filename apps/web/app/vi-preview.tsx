"use client";

import type { ViSpec } from "@cmdgen/vi";
import { buildArgv, lint, renderTokens } from "@cmdgen/vi";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ViPreviewProps {
  spec: ViSpec;
}

/** vi's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/less`'s preview. */
export function ViPreview({ spec }: ViPreviewProps) {
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
