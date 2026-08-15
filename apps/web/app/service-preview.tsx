"use client";

import type { ServiceSpec } from "@cmdgen/service";
import { buildArgv, lint, renderTokens } from "@cmdgen/service";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ServicePreviewProps {
  spec: ServiceSpec;
}

/** service's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/mount`'s preview. */
export function ServicePreview({ spec }: ServicePreviewProps) {
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
