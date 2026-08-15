"use client";

import type { SemanageSpec } from "@cmdgen/semanage";
import { buildArgv, lint, renderTokens } from "@cmdgen/semanage";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SemanagePreviewProps {
  spec: SemanageSpec;
}

/** semanage's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/iptables`'s preview (Linux-only, one shell). */
export function SemanagePreview({ spec }: SemanagePreviewProps) {
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
