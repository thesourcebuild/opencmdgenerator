"use client";

import type { TeeSpec } from "@cmdgen/tee";
import { buildArgv, lint, renderTokens } from "@cmdgen/tee";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TeePreviewProps {
  spec: TeeSpec;
}

/** tee's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function TeePreview({ spec }: TeePreviewProps) {
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
