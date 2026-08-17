"use client";

import type { TcpdumpSpec } from "@cmdgen/tcpdump";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/tcpdump";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TcpdumpPreviewProps {
  spec: TcpdumpSpec;
}

export function TcpdumpPreview({ spec }: TcpdumpPreviewProps) {
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
