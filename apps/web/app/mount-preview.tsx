"use client";

import type { MountSpec } from "@cmdgen/mount";
import { buildArgv, lint, renderTokens } from "@cmdgen/mount";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface MountPreviewProps {
  spec: MountSpec;
}

/** mount's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/touch`'s preview. */
export function MountPreview({ spec }: MountPreviewProps) {
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
