"use client";

import type { UptimeSpec } from "@cmdgen/uptime";
import { buildArgv, lint, renderTokens } from "@cmdgen/uptime";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UptimePreviewProps {
  spec: UptimeSpec;
}

/** uptime's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/top`'s preview. */
export function UptimePreview({ spec }: UptimePreviewProps) {
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
