"use client";

import type { SystemctlSpec } from "@cmdgen/systemctl";
import { buildArgv, lint, renderTokens } from "@cmdgen/systemctl";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SystemctlPreviewProps {
  spec: SystemctlSpec;
}

/** systemctl's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/service`'s preview. */
export function SystemctlPreview({ spec }: SystemctlPreviewProps) {
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
