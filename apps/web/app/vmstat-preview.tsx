"use client";

import type { VmstatSpec } from "@cmdgen/vmstat";
import { buildArgv, lint, renderTokens } from "@cmdgen/vmstat";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface VmstatPreviewProps {
  spec: VmstatSpec;
}

/** vmstat's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/top`'s preview. */
export function VmstatPreview({ spec }: VmstatPreviewProps) {
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
