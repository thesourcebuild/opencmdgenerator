"use client";

import type { HexdumpSpec } from "@cmdgen/hexdump";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/hexdump";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HexdumpPreviewProps {
  spec: HexdumpSpec;
}

export function HexdumpPreview({ spec }: HexdumpPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
