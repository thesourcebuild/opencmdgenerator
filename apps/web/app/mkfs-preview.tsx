"use client";

import type { MkfsSpec } from "@cmdgen/mkfs";
import { buildArgv, lint, renderTokens } from "@cmdgen/mkfs";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface MkfsPreviewProps {
  spec: MkfsSpec;
}

/** mkfs's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. Always destructive — see lint/rules.ts's MKF002 — so `isDestructive` is true for every spec. */
export function MkfsPreview({ spec }: MkfsPreviewProps) {
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
