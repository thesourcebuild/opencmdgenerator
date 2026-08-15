"use client";

import type { SudoSpec } from "@cmdgen/sudo";
import { buildArgv, lint, renderTokens } from "@cmdgen/sudo";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SudoPreviewProps {
  spec: SudoSpec;
}

/** sudo's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function SudoPreview({ spec }: SudoPreviewProps) {
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
