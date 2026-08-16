"use client";

import type { TelnetSpec } from "@cmdgen/telnet";
import { buildArgv, lint, renderTokens } from "@cmdgen/telnet";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TelnetPreviewProps {
  spec: TelnetSpec;
}

export function TelnetPreview({ spec }: TelnetPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \"
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
