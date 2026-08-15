"use client";

import type { UniqSpec } from "@cmdgen/uniq";
import { buildArgv, lint, renderTokens } from "@cmdgen/uniq";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UniqPreviewProps {
  spec: UniqSpec;
}

/** uniq's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function UniqPreview({ spec }: UniqPreviewProps) {
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
