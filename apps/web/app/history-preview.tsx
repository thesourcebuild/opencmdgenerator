"use client";

import type { HistorySpec } from "@cmdgen/history";
import { buildArgv, lint, renderTokens } from "@cmdgen/history";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HistoryPreviewProps {
  spec: HistorySpec;
}

/** history's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/whatis`'s preview. */
export function HistoryPreview({ spec }: HistoryPreviewProps) {
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
