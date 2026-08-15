"use client";

import type { RouteSpec } from "@cmdgen/route";
import { buildArgv, lint, renderTokens } from "@cmdgen/route";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface RoutePreviewProps {
  spec: RouteSpec;
}

/** route's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/service`'s preview. */
export function RoutePreview({ spec }: RoutePreviewProps) {
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
