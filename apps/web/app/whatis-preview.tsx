"use client";

import type { WhatisSpec } from "@cmdgen/whatis";
import { buildArgv, lint, renderTokens } from "@cmdgen/whatis";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WhatisPreviewProps {
  spec: WhatisSpec;
}

/** whatis's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function WhatisPreview({ spec }: WhatisPreviewProps) {
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
