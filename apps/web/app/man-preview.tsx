"use client";

import type { ManSpec } from "@cmdgen/man";
import { buildArgv, lint, renderTokens } from "@cmdgen/man";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ManPreviewProps {
  spec: ManSpec;
}

/** man's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function ManPreview({ spec }: ManPreviewProps) {
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
