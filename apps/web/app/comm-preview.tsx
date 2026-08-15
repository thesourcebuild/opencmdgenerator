"use client";

import type { CommSpec } from "@cmdgen/comm";
import { buildArgv, lint, renderTokens } from "@cmdgen/comm";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface CommPreviewProps {
  spec: CommSpec;
}

/** comm's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function CommPreview({ spec }: CommPreviewProps) {
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
