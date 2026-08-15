"use client";

import type { FindSpec } from "@cmdgen/find";
import { buildArgv, lint, renderTokens } from "@cmdgen/find";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FindPreviewProps {
  spec: FindSpec;
}

/** find's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/mount`'s preview. */
export function FindPreview({ spec }: FindPreviewProps) {
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
