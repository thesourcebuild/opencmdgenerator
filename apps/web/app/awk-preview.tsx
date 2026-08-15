"use client";

import type { AwkSpec } from "@cmdgen/awk";
import { buildArgv, lint, renderTokens } from "@cmdgen/awk";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface AwkPreviewProps {
  spec: AwkSpec;
}

/** awk's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function AwkPreview({ spec }: AwkPreviewProps) {
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
