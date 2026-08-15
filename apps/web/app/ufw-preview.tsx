"use client";

import type { UfwSpec } from "@cmdgen/ufw";
import { buildArgv, lint, renderTokens } from "@cmdgen/ufw";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UfwPreviewProps {
  spec: UfwSpec;
}

/** ufw's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/apt`'s preview (ufw is Linux-only, one shell). */
export function UfwPreview({ spec }: UfwPreviewProps) {
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
