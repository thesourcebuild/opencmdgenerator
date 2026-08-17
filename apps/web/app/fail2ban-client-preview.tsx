"use client";

import type { Fail2banClientSpec } from "@cmdgen/fail2ban-client";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/fail2ban-client";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface Fail2banClientPreviewProps {
  spec: Fail2banClientSpec;
}

export function Fail2banClientPreview({ spec }: Fail2banClientPreviewProps) {
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
