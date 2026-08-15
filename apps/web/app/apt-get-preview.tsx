"use client";

import type { AptGetSpec } from "@cmdgen/apt-get";
import { buildArgv, lint, renderTokens } from "@cmdgen/apt-get";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface AptGetPreviewProps {
  spec: AptGetSpec;
}

/** apt-get's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/apt`'s preview (apt-get is Linux-only, one shell). */
export function AptGetPreview({ spec }: AptGetPreviewProps) {
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
