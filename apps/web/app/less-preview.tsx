"use client";

import type { LessSpec } from "@cmdgen/less";
import { buildArgv, lint, renderTokens } from "@cmdgen/less";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LessPreviewProps {
  spec: LessSpec;
}

/** less's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function LessPreview({ spec }: LessPreviewProps) {
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
