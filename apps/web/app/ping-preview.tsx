"use client";

import type { PingSpec } from "@cmdgen/ping";
import { buildArgv, lint, renderTokens } from "@cmdgen/ping";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PingPreviewProps {
  spec: PingSpec;
}

/** ping's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function PingPreview({ spec }: PingPreviewProps) {
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
