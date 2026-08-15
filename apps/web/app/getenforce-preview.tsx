"use client";

import type { GetenforceSpec } from "@cmdgen/getenforce";
import { buildArgv, lint, renderTokens } from "@cmdgen/getenforce";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GetenforcePreviewProps {
  spec: GetenforceSpec;
}

/** getenforce's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/iptables`'s preview (Linux-only, one shell). */
export function GetenforcePreview({ spec }: GetenforcePreviewProps) {
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
