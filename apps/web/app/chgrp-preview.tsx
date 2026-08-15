"use client";

import type { ChgrpSpec } from "@cmdgen/chgrp";
import { buildArgv, lint, renderTokens } from "@cmdgen/chgrp";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChgrpPreviewProps {
  spec: ChgrpSpec;
}

/** chgrp's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chown`'s preview. */
export function ChgrpPreview({ spec }: ChgrpPreviewProps) {
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
