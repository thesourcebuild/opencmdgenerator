"use client";

import type { DigSpec } from "@cmdgen/dig";
import { buildArgv, lint, renderTokens } from "@cmdgen/dig";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DigPreviewProps {
  spec: DigSpec;
}

/** dig's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function DigPreview({ spec }: DigPreviewProps) {
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
