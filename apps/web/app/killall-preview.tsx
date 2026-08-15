"use client";

import type { KillallSpec } from "@cmdgen/killall";
import { buildArgv, lint, renderTokens } from "@cmdgen/killall";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface KillallPreviewProps {
  spec: KillallSpec;
}

/** killall's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/touch`'s preview. */
export function KillallPreview({ spec }: KillallPreviewProps) {
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
