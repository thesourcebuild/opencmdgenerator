"use client";

import type { PkillSpec } from "@cmdgen/pkill";
import { buildArgv, lint, renderTokens } from "@cmdgen/pkill";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PkillPreviewProps {
  spec: PkillSpec;
}

/** pkill's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function PkillPreview({ spec }: PkillPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description="This app never sends any signal."
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
