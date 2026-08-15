"use client";

import type { SuSpec } from "@cmdgen/su";
import { buildArgv, lint, renderTokens } from "@cmdgen/su";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SuPreviewProps {
  spec: SuSpec;
}

/** su's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/useradd`'s preview. */
export function SuPreview({ spec }: SuPreviewProps) {
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
